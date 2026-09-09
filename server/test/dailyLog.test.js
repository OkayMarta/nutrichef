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
let mealUser1;
let mealUser2;

describe("Daily Logs API Module Tests", () => {
    before(async () => {
        await prisma.$connect();

        // Create test users
        const passwordHash = await bcrypt.hash("TestPass123!", 10);
        user1 = await prisma.user.create({
            data: {
                email: `log_test_u1_${Date.now()}@example.com`,
                passwordHash,
            },
        });

        user2 = await prisma.user.create({
            data: {
                email: `log_test_u2_${Date.now()}@example.com`,
                passwordHash,
            },
        });

        user1Token = jwt.sign({ userId: user1.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        user2Token = jwt.sign({ userId: user2.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Create test meals
        mealUser1 = await prisma.meal.create({
            data: {
                name: "Turkey Quinoa Salad",
                caloriesPer100g: 220.0,
                proteinPer100g: 24.5,
                fatPer100g: 6.0,
                carbsPer100g: 16.5,
                userId: user1.id,
            },
        });

        mealUser2 = await prisma.meal.create({
            data: {
                name: "Avocado Toast",
                caloriesPer100g: 250.0,
                proteinPer100g: 6.0,
                fatPer100g: 15.0,
                carbsPer100g: 22.0,
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
        test("POST /api/logs should reject unauthenticated request with 401", async () => {
            const res = await fetch(`${baseUrl}/api/logs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mealId: mealUser1.id,
                    date: "2026-09-09",
                    mealType: "LUNCH",
                    consumedGrams: 100,
                }),
            });
            assert.equal(res.status, 401);
        });

        test("GET /api/logs should reject unauthenticated request with 401", async () => {
            const res = await fetch(`${baseUrl}/api/logs`);
            assert.equal(res.status, 401);
        });

        test("GET /api/logs/:id should reject unauthenticated request with 401", async () => {
            const res = await fetch(`${baseUrl}/api/logs/some-id`);
            assert.equal(res.status, 401);
        });

        test("PUT /api/logs/:id should reject unauthenticated request with 401", async () => {
            const res = await fetch(`${baseUrl}/api/logs/some-id`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ consumedGrams: 200 }),
            });
            assert.equal(res.status, 401);
        });

        test("DELETE /api/logs/:id should reject unauthenticated request with 401", async () => {
            const res = await fetch(`${baseUrl}/api/logs/some-id`, {
                method: "DELETE",
            });
            assert.equal(res.status, 401);
        });
    });

    describe("POST /api/logs (Create Daily Log)", () => {
        test("should reject creation when required fields are missing", async () => {
            const res = await fetch(`${baseUrl}/api/logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify({ mealId: mealUser1.id }),
            });
            assert.equal(res.status, 400);
        });

        test("should reject creation with invalid date", async () => {
            const res = await fetch(`${baseUrl}/api/logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify({
                    mealId: mealUser1.id,
                    date: "not-a-date",
                    mealType: "BREAKFAST",
                    consumedGrams: 150,
                }),
            });
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.ok(data.message.includes("valid date"));
        });

        test("should reject creation with invalid mealType enum", async () => {
            const res = await fetch(`${baseUrl}/api/logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify({
                    mealId: mealUser1.id,
                    date: "2026-09-09",
                    mealType: "BRUNCH",
                    consumedGrams: 150,
                }),
            });
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.ok(data.message.includes("mealType"));
        });

        test("should reject creation when consumedGrams is zero or negative", async () => {
            const res = await fetch(`${baseUrl}/api/logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify({
                    mealId: mealUser1.id,
                    date: "2026-09-09",
                    mealType: "BREAKFAST",
                    consumedGrams: 0,
                }),
            });
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.ok(data.message.includes("consumedGrams"));
        });

        test("should return 404 when meal does not exist", async () => {
            const res = await fetch(`${baseUrl}/api/logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify({
                    mealId: "00000000-0000-0000-0000-000000000000",
                    date: "2026-09-09",
                    mealType: "BREAKFAST",
                    consumedGrams: 100,
                }),
            });
            assert.equal(res.status, 404);
            const data = await res.json();
            assert.equal(data.message, "Meal not found");
        });

        test("should return 404 when attempting to log meal owned by another user", async () => {
            const res = await fetch(`${baseUrl}/api/logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify({
                    mealId: mealUser2.id, // Owned by user 2!
                    date: "2026-09-09",
                    mealType: "BREAKFAST",
                    consumedGrams: 100,
                }),
            });
            assert.equal(res.status, 404);
            const data = await res.json();
            assert.equal(data.message, "Meal not found");
        });

        test("should successfully create daily log with exact snapshot calculations", async () => {
            // mealUser1: calories 220, protein 24.5, fat 6.0, carbs 16.5
            // consumedGrams: 150 -> factor: 1.5
            // snapshotCalories: 220 * 1.5 = 330
            // snapshotProtein: 24.5 * 1.5 = 36.75
            // snapshotFat: 6 * 1.5 = 9
            // snapshotCarbs: 16.5 * 1.5 = 24.75
            const payload = {
                mealId: mealUser1.id,
                date: "2026-09-09",
                mealType: "LUNCH",
                consumedGrams: 150,
            };

            const res = await fetch(`${baseUrl}/api/logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify(payload),
            });

            assert.equal(res.status, 201);
            const log = await res.json();
            assert.ok(log.id);
            assert.equal(log.userId, user1.id);
            assert.equal(log.mealId, mealUser1.id);
            assert.equal(log.mealType, "LUNCH");
            assert.equal(log.consumedGrams, 150);
            assert.equal(log.snapshotCalories, 330);
            assert.equal(log.snapshotProtein, 36.75);
            assert.equal(log.snapshotFat, 9);
            assert.equal(log.snapshotCarbs, 24.75);
            assert.ok(log.meal);
            assert.equal(log.meal.id, mealUser1.id);
        });
    });

    describe("GET /api/logs (List & Filter Daily Logs)", () => {
        let logToday;
        let logYesterday;
        let logUser2;

        before(async () => {
            logToday = await prisma.dailyLog.create({
                data: {
                    userId: user1.id,
                    mealId: mealUser1.id,
                    date: new Date("2026-09-09T10:00:00.000Z"),
                    mealType: "BREAKFAST",
                    consumedGrams: 100,
                    snapshotCalories: 220,
                    snapshotProtein: 24.5,
                    snapshotFat: 6,
                    snapshotCarbs: 16.5,
                },
            });

            logYesterday = await prisma.dailyLog.create({
                data: {
                    userId: user1.id,
                    mealId: mealUser1.id,
                    date: new Date("2026-09-08T18:00:00.000Z"),
                    mealType: "DINNER",
                    consumedGrams: 200,
                    snapshotCalories: 440,
                    snapshotProtein: 49,
                    snapshotFat: 12,
                    snapshotCarbs: 33,
                },
            });

            logUser2 = await prisma.dailyLog.create({
                data: {
                    userId: user2.id,
                    mealId: mealUser2.id,
                    date: new Date("2026-09-09T12:00:00.000Z"),
                    mealType: "LUNCH",
                    consumedGrams: 80,
                    snapshotCalories: 200,
                    snapshotProtein: 4.8,
                    snapshotFat: 12,
                    snapshotCarbs: 17.6,
                },
            });
        });

        test("should return only user1 logs and exclude user2 logs", async () => {
            const res = await fetch(`${baseUrl}/api/logs`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });
            assert.equal(res.status, 200);
            const logs = await res.json();
            assert.ok(Array.isArray(logs));
            assert.ok(logs.every((l) => l.userId === user1.id));
            assert.ok(!logs.some((l) => l.id === logUser2.id));
            assert.ok(logs.every((l) => l.meal && l.meal.name));
        });

        test("should filter logs by date query parameter", async () => {
            const res = await fetch(`${baseUrl}/api/logs?date=2026-09-08`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });
            assert.equal(res.status, 200);
            const logs = await res.json();
            assert.ok(Array.isArray(logs));
            assert.ok(logs.some((l) => l.id === logYesterday.id));
            assert.ok(!logs.some((l) => l.id === logToday.id));
        });

        test("should reject invalid date query parameter with 400", async () => {
            const res = await fetch(`${baseUrl}/api/logs?date=invalid-date`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });
            assert.equal(res.status, 400);
        });
    });

    describe("GET /api/logs/:id (Get Single Log)", () => {
        let testLog;

        before(async () => {
            testLog = await prisma.dailyLog.create({
                data: {
                    userId: user1.id,
                    mealId: mealUser1.id,
                    date: new Date("2026-09-09"),
                    mealType: "SNACK",
                    consumedGrams: 50,
                    snapshotCalories: 110,
                    snapshotProtein: 12.25,
                    snapshotFat: 3,
                    snapshotCarbs: 8.25,
                },
            });
        });

        test("should return 200 and log data with meal included for owner", async () => {
            const res = await fetch(`${baseUrl}/api/logs/${testLog.id}`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });
            assert.equal(res.status, 200);
            const data = await res.json();
            assert.equal(data.id, testLog.id);
            assert.ok(data.meal);
            assert.equal(data.meal.id, mealUser1.id);
        });

        test("should return 404 for non-existent log", async () => {
            const res = await fetch(
                `${baseUrl}/api/logs/00000000-0000-0000-0000-000000000000`,
                {
                    headers: { Authorization: `Bearer ${user1Token}` },
                },
            );
            assert.equal(res.status, 404);
        });

        test("should return 403 Forbidden when user2 accesses user1 log", async () => {
            const res = await fetch(`${baseUrl}/api/logs/${testLog.id}`, {
                headers: { Authorization: `Bearer ${user2Token}` },
            });
            assert.equal(res.status, 403);
        });
    });

    describe("PUT /api/logs/:id (Update Daily Log)", () => {
        let targetLog;

        before(async () => {
            targetLog = await prisma.dailyLog.create({
                data: {
                    userId: user1.id,
                    mealId: mealUser1.id,
                    date: new Date("2026-09-09"),
                    mealType: "BREAKFAST",
                    consumedGrams: 100,
                    snapshotCalories: 220,
                    snapshotProtein: 24.5,
                    snapshotFat: 6,
                    snapshotCarbs: 16.5,
                },
            });
        });

        test("should return 404 for non-existent log", async () => {
            const res = await fetch(
                `${baseUrl}/api/logs/00000000-0000-0000-0000-000000000000`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user1Token}`,
                    },
                    body: JSON.stringify({ mealType: "LUNCH" }),
                },
            );
            assert.equal(res.status, 404);
        });

        test("should return 403 Forbidden when user2 attempts to update user1 log", async () => {
            const res = await fetch(`${baseUrl}/api/logs/${targetLog.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user2Token}`,
                },
                body: JSON.stringify({ mealType: "LUNCH" }),
            });
            assert.equal(res.status, 403);
        });

        test("should return 400 when invalid consumedGrams is provided", async () => {
            const res = await fetch(`${baseUrl}/api/logs/${targetLog.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify({ consumedGrams: -10 }),
            });
            assert.equal(res.status, 400);
        });

        test("should update mealType without changing macro snapshots", async () => {
            const res = await fetch(`${baseUrl}/api/logs/${targetLog.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify({ mealType: "DINNER" }),
            });
            assert.equal(res.status, 200);
            const updated = await res.json();
            assert.equal(updated.mealType, "DINNER");
            assert.equal(updated.consumedGrams, 100);
            assert.equal(updated.snapshotCalories, 220);
        });

        test("should automatically recalculate all snapshot macros when consumedGrams is updated", async () => {
            // mealUser1: calories 220, protein 24.5, fat 6.0, carbs 16.5
            // update consumedGrams to 250 -> factor 2.5
            // snapshotCalories: 220 * 2.5 = 550
            // snapshotProtein: 24.5 * 2.5 = 61.25
            // snapshotFat: 6 * 2.5 = 15
            // snapshotCarbs: 16.5 * 2.5 = 41.25
            const res = await fetch(`${baseUrl}/api/logs/${targetLog.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify({ consumedGrams: 250 }),
            });

            assert.equal(res.status, 200);
            const updated = await res.json();
            assert.equal(updated.consumedGrams, 250);
            assert.equal(updated.snapshotCalories, 550);
            assert.equal(updated.snapshotProtein, 61.25);
            assert.equal(updated.snapshotFat, 15);
            assert.equal(updated.snapshotCarbs, 41.25);
        });
    });

    describe("DELETE /api/logs/:id (Delete Daily Log)", () => {
        let deleteTargetLog;

        before(async () => {
            deleteTargetLog = await prisma.dailyLog.create({
                data: {
                    userId: user1.id,
                    mealId: mealUser1.id,
                    date: new Date("2026-09-09"),
                    mealType: "SNACK",
                    consumedGrams: 50,
                    snapshotCalories: 110,
                    snapshotProtein: 12.25,
                    snapshotFat: 3,
                    snapshotCarbs: 8.25,
                },
            });
        });

        test("should return 404 for non-existent log", async () => {
            const res = await fetch(
                `${baseUrl}/api/logs/00000000-0000-0000-0000-000000000000`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${user1Token}` },
                },
            );
            assert.equal(res.status, 404);
        });

        test("should return 403 Forbidden when user2 attempts to delete user1 log", async () => {
            const res = await fetch(
                `${baseUrl}/api/logs/${deleteTargetLog.id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${user2Token}` },
                },
            );
            assert.equal(res.status, 403);

            const stillExists = await prisma.dailyLog.findUnique({
                where: { id: deleteTargetLog.id },
            });
            assert.ok(stillExists);
        });

        test("should delete daily log successfully and return 200 OK", async () => {
            const res = await fetch(
                `${baseUrl}/api/logs/${deleteTargetLog.id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${user1Token}` },
                },
            );
            assert.equal(res.status, 200);
            const data = await res.json();
            assert.equal(data.message, "Daily log deleted successfully");

            const check = await prisma.dailyLog.findUnique({
                where: { id: deleteTargetLog.id },
            });
            assert.equal(check, null);
        });
    });
});
