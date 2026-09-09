require("dotenv").config();
const { test, describe, before, after } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const prisma = require("../src/lib/prisma");

let server;
let baseUrl;
let user1;
let user2;
let user1Token;
let user2Token;
let meal1;
let meal2;
let mealUser2;

describe("Dashboard API Module Tests", () => {
    before(async () => {
        await prisma.$connect();

        const passwordHash = await bcrypt.hash("DashboardPass123!", 10);

        // Create user1 with configured goals
        user1 = await prisma.user.create({
            data: {
                email: `dash_test_u1_${Date.now()}@example.com`,
                passwordHash,
                goalCalories: 2200,
                goalProtein: 160,
                goalFat: 70,
                goalCarbs: 230,
            },
        });

        // Create user2 with different goals
        user2 = await prisma.user.create({
            data: {
                email: `dash_test_u2_${Date.now()}@example.com`,
                passwordHash,
                goalCalories: 1800,
                goalProtein: 120,
                goalFat: 50,
                goalCarbs: 200,
            },
        });

        user1Token = jwt.sign({ userId: user1.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        user2Token = jwt.sign({ userId: user2.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Create meals for users
        meal1 = await prisma.meal.create({
            data: {
                name: "Scrambled Eggs & Toast",
                caloriesPer100g: 210.0,
                proteinPer100g: 14.0,
                fatPer100g: 12.0,
                carbsPer100g: 15.0,
                userId: user1.id,
            },
        });

        meal2 = await prisma.meal.create({
            data: {
                name: "Grilled Salmon Bowl",
                caloriesPer100g: 190.0,
                proteinPer100g: 22.0,
                fatPer100g: 8.5,
                carbsPer100g: 12.5,
                userId: user1.id,
            },
        });

        mealUser2 = await prisma.meal.create({
            data: {
                name: "User2 Protein Shake",
                caloriesPer100g: 150.0,
                proteinPer100g: 25.0,
                fatPer100g: 3.0,
                carbsPer100g: 5.0,
                userId: user2.id,
            },
        });

        // Start server on ephemeral port
        await new Promise((resolve) => {
            server = app.listen(0, () => {
                const port = server.address().port;
                baseUrl = `http://127.0.0.1:${port}`;
                resolve();
            });
        });
    });

    after(async () => {
        // Delete created users (cascade deletes meals and daily logs)
        if (user1) {
            await prisma.user.deleteMany({ where: { id: user1.id } });
        }
        if (user2) {
            await prisma.user.deleteMany({ where: { id: user2.id } });
        }

        await prisma.$disconnect();
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
    });

    describe("Route Protection with authMiddleware", () => {
        test("GET /api/dashboard/:date should return 401 when no token is provided", async () => {
            const res = await fetch(`${baseUrl}/api/dashboard/2026-09-09`);
            assert.equal(res.status, 401);
            const data = await res.json();
            assert.ok(data.message.includes("Authorization header"));
        });
    });

    describe("Date Validation", () => {
        test("GET /api/dashboard/:date should return 400 for invalid date format", async () => {
            const res = await fetch(`${baseUrl}/api/dashboard/not-a-date`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.ok(data.message.includes("Invalid date format"));
        });

        test("GET /api/dashboard/:date should return 400 for invalid calendar date", async () => {
            const res = await fetch(`${baseUrl}/api/dashboard/2026-99-99`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });
            assert.equal(res.status, 400);
        });
    });

    describe("Empty Day Response (200 OK)", () => {
        test("should return zeroed totals, user goals, and empty logs array when day has no entries", async () => {
            const targetDate = "2026-01-15";
            const res = await fetch(`${baseUrl}/api/dashboard/${targetDate}`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });

            assert.equal(res.status, 200);
            const data = await res.json();

            assert.equal(data.date, targetDate);
            assert.deepEqual(data.totals, {
                calories: 0,
                protein: 0,
                fat: 0,
                carbs: 0,
            });
            assert.deepEqual(data.goals, {
                calories: 2200,
                protein: 160,
                fat: 70,
                carbs: 230,
            });
            assert.ok(Array.isArray(data.logs));
            assert.equal(data.logs.length, 0);
        });
    });

    describe("Populated Day Aggregation & User Isolation (200 OK)", () => {
        const testDate = "2026-09-10";

        before(async () => {
            // Log 1 for User 1: Breakfast
            // consumedGrams = 150 -> factor 1.5
            // 210 * 1.5 = 315, 14 * 1.5 = 21, 12 * 1.5 = 18, 15 * 1.5 = 22.5
            await prisma.dailyLog.create({
                data: {
                    userId: user1.id,
                    mealId: meal1.id,
                    date: new Date(`${testDate}T08:00:00.000Z`),
                    mealType: "BREAKFAST",
                    consumedGrams: 150,
                    snapshotCalories: 315.0,
                    snapshotProtein: 21.0,
                    snapshotFat: 18.0,
                    snapshotCarbs: 22.5,
                },
            });

            // Add delay to ensure distinct createdAt
            await new Promise((r) => setTimeout(r, 20));

            // Log 2 for User 1: Lunch
            // consumedGrams = 200 -> factor 2.0
            // 190 * 2 = 380, 22 * 2 = 44, 8.5 * 2 = 17, 12.5 * 2 = 25
            await prisma.dailyLog.create({
                data: {
                    userId: user1.id,
                    mealId: meal2.id,
                    date: new Date(`${testDate}T13:00:00.000Z`),
                    mealType: "LUNCH",
                    consumedGrams: 200,
                    snapshotCalories: 380.0,
                    snapshotProtein: 44.0,
                    snapshotFat: 17.0,
                    snapshotCarbs: 25.0,
                },
            });

            // Log for User 2 on the same date: Should NOT be included in User 1's summary!
            await prisma.dailyLog.create({
                data: {
                    userId: user2.id,
                    mealId: mealUser2.id,
                    date: new Date(`${testDate}T12:00:00.000Z`),
                    mealType: "LUNCH",
                    consumedGrams: 300,
                    snapshotCalories: 450.0,
                    snapshotProtein: 75.0,
                    snapshotFat: 9.0,
                    snapshotCarbs: 15.0,
                },
            });
        });

        test("should accurately calculate total macros from multiple logs for User 1", async () => {
            const res = await fetch(`${baseUrl}/api/dashboard/${testDate}`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });

            assert.equal(res.status, 200);
            const data = await res.json();

            assert.equal(data.date, testDate);

            // Expected sums:
            // calories: 315.0 + 380.0 = 695.0
            // protein:  21.0 + 44.0 = 65.0
            // fat:      18.0 + 17.0 = 35.0
            // carbs:    22.5 + 25.0 = 47.5
            assert.deepEqual(data.totals, {
                calories: 695.0,
                protein: 65.0,
                fat: 35.0,
                carbs: 47.5,
            });

            assert.deepEqual(data.goals, {
                calories: 2200,
                protein: 160,
                fat: 70,
                carbs: 230,
            });

            assert.equal(data.logs.length, 2);
            assert.equal(data.logs[0].mealType, "BREAKFAST");
            assert.equal(data.logs[0].meal.name, "Scrambled Eggs & Toast");
            assert.equal(data.logs[1].mealType, "LUNCH");
            assert.equal(data.logs[1].meal.name, "Grilled Salmon Bowl");

            // Verify createdAt ascending ordering
            const time0 = new Date(data.logs[0].createdAt).getTime();
            const time1 = new Date(data.logs[1].createdAt).getTime();
            assert.ok(
                time0 <= time1,
                "Logs must be ordered by createdAt ascending",
            );
        });

        test("should verify data isolation: User 2 only receives their own data", async () => {
            const res = await fetch(`${baseUrl}/api/dashboard/${testDate}`, {
                headers: { Authorization: `Bearer ${user2Token}` },
            });

            assert.equal(res.status, 200);
            const data = await res.json();

            assert.deepEqual(data.totals, {
                calories: 450.0,
                protein: 75.0,
                fat: 9.0,
                carbs: 15.0,
            });

            assert.deepEqual(data.goals, {
                calories: 1800,
                protein: 120,
                fat: 50,
                carbs: 200,
            });

            assert.equal(data.logs.length, 1);
            assert.equal(data.logs[0].meal.name, "User2 Protein Shake");
        });
    });
});
