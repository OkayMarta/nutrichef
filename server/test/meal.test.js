process.env.NODE_ENV = "test";
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

describe("Meals (Calculator) API Module Tests", () => {
    before(async () => {
        await prisma.$connect();

        // Create two test users
        const passwordHash = await bcrypt.hash("TestPass123!", 10);
        user1 = await prisma.user.create({
            data: {
                email: `meal_test_u1_${Date.now()}@example.com`,
                passwordHash,
            },
        });

        user2 = await prisma.user.create({
            data: {
                email: `meal_test_u2_${Date.now()}@example.com`,
                passwordHash,
            },
        });

        user1Token = jwt.sign({ userId: user1.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        user2Token = jwt.sign({ userId: user2.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
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
        // Delete created users (cascade deletes their meals)
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
        test("POST /api/meals should reject unauthenticated request with 401", async () => {
            const res = await fetch(`${baseUrl}/api/meals`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Test Meal" }),
            });
            assert.equal(res.status, 401);
        });

        test("GET /api/meals should reject unauthenticated request with 401", async () => {
            const res = await fetch(`${baseUrl}/api/meals`);
            assert.equal(res.status, 401);
        });

        test("PUT /api/meals/:id should reject unauthenticated request with 401", async () => {
            const res = await fetch(`${baseUrl}/api/meals/some-id`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Updated Name" }),
            });
            assert.equal(res.status, 401);
        });

        test("DELETE /api/meals/:id should reject unauthenticated request with 401", async () => {
            const res = await fetch(`${baseUrl}/api/meals/some-id`, {
                method: "DELETE",
            });
            assert.equal(res.status, 401);
        });
    });

    describe("POST /api/meals (Create Meal)", () => {
        test("should reject creation when name is missing or empty", async () => {
            const res = await fetch(`${baseUrl}/api/meals`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify({
                    name: "   ",
                    caloriesPer100g: 200,
                    proteinPer100g: 20,
                    fatPer100g: 10,
                    carbsPer100g: 5,
                }),
            });
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.ok(data.message.includes("name is required"));
        });

        test("should reject creation when any macro is negative or invalid", async () => {
            const res = await fetch(`${baseUrl}/api/meals`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify({
                    name: "Invalid Meal",
                    caloriesPer100g: -50,
                    proteinPer100g: 20,
                    fatPer100g: 10,
                    carbsPer100g: 5,
                }),
            });
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.ok(data.message.includes("caloriesPer100g"));
        });

        test("should reject creation when name exceeds 60 characters", async () => {
            const res = await fetch(`${baseUrl}/api/meals`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify({
                    name: "A".repeat(61),
                    caloriesPer100g: 200,
                    proteinPer100g: 20,
                    fatPer100g: 10,
                    carbsPer100g: 5,
                }),
            });
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.ok(data.message.includes("cannot exceed 60 characters"));
        });

        test("should successfully create a meal for user1 and return 201 Created", async () => {
            const payload = {
                name: "Chicken Rice Bowl",
                caloriesPer100g: 165.5,
                proteinPer100g: 25.2,
                fatPer100g: 3.5,
                carbsPer100g: 22.0,
            };

            const res = await fetch(`${baseUrl}/api/meals`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user1Token}`,
                },
                body: JSON.stringify(payload),
            });

            assert.equal(res.status, 201);
            const meal = await res.json();
            assert.ok(meal.id);
            assert.equal(meal.name, payload.name);
            assert.equal(meal.caloriesPer100g, payload.caloriesPer100g);
            assert.equal(meal.proteinPer100g, payload.proteinPer100g);
            assert.equal(meal.fatPer100g, payload.fatPer100g);
            assert.equal(meal.carbsPer100g, payload.carbsPer100g);
            assert.equal(meal.userId, user1.id);
            assert.ok(meal.createdAt);
        });
    });

    describe("GET /api/meals (List & Search Meals)", () => {
        let mealU1A, mealU1B, mealU2;

        before(async () => {
            // Create additional meals
            mealU1A = await prisma.meal.create({
                data: {
                    name: "Oatmeal with Berries",
                    caloriesPer100g: 120,
                    proteinPer100g: 5,
                    fatPer100g: 2.5,
                    carbsPer100g: 24,
                    userId: user1.id,
                },
            });

            // Add a slight delay to guarantee distinct createdAt timestamps
            await new Promise((r) => setTimeout(r, 20));

            mealU1B = await prisma.meal.create({
                data: {
                    name: "Roasted Chicken Breast",
                    caloriesPer100g: 165,
                    proteinPer100g: 31,
                    fatPer100g: 3.6,
                    carbsPer100g: 0,
                    userId: user1.id,
                },
            });

            mealU2 = await prisma.meal.create({
                data: {
                    name: "User 2 Secret Pasta",
                    caloriesPer100g: 300,
                    proteinPer100g: 12,
                    fatPer100g: 8,
                    carbsPer100g: 45,
                    userId: user2.id,
                },
            });
        });

        test("should return only user1 meals and exclude user2 meals", async () => {
            const res = await fetch(`${baseUrl}/api/meals`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });
            assert.equal(res.status, 200);
            const meals = await res.json();
            assert.ok(Array.isArray(meals));

            // User 1 has 3 meals total (1 from POST test + 2 from before)
            assert.equal(meals.length, 3);
            assert.ok(meals.every((m) => m.userId === user1.id));
            assert.ok(!meals.some((m) => m.name === "User 2 Secret Pasta"));
        });

        test("should order meals by createdAt descending", async () => {
            const res = await fetch(`${baseUrl}/api/meals`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });
            assert.equal(res.status, 200);
            const meals = await res.json();

            for (let i = 0; i < meals.length - 1; i++) {
                const dateA = new Date(meals[i].createdAt).getTime();
                const dateB = new Date(meals[i + 1].createdAt).getTime();
                assert.ok(
                    dateA >= dateB,
                    "Meals must be sorted createdAt descending",
                );
            }
        });

        test("should filter meals by search query case-insensitively", async () => {
            const res = await fetch(`${baseUrl}/api/meals?search=chicken`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });
            assert.equal(res.status, 200);
            const meals = await res.json();

            // Should match "Chicken Rice Bowl" and "Roasted Chicken Breast"
            assert.equal(meals.length, 2);
            assert.ok(
                meals.every((m) => m.name.toLowerCase().includes("chicken")),
            );
        });

        test("should return empty array if search query matches no meals", async () => {
            const res = await fetch(
                `${baseUrl}/api/meals?search=nonexistent_xyz`,
                {
                    headers: { Authorization: `Bearer ${user1Token}` },
                },
            );
            assert.equal(res.status, 200);
            const meals = await res.json();
            assert.equal(meals.length, 0);
        });
    });

    describe("GET /api/meals/:id", () => {
        let testMeal;

        before(async () => {
            testMeal = await prisma.meal.create({
                data: {
                    name: "Greek Salad",
                    caloriesPer100g: 95,
                    proteinPer100g: 2.5,
                    fatPer100g: 7.5,
                    carbsPer100g: 4.5,
                    userId: user1.id,
                },
            });
        });

        test("should return 200 and meal data for authorized user", async () => {
            const res = await fetch(`${baseUrl}/api/meals/${testMeal.id}`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });
            assert.equal(res.status, 200);
            const meal = await res.json();
            assert.equal(meal.id, testMeal.id);
            assert.equal(meal.name, "Greek Salad");
        });

        test("should return 404 when meal does not exist", async () => {
            const res = await fetch(
                `${baseUrl}/api/meals/00000000-0000-0000-0000-000000000000`,
                {
                    headers: { Authorization: `Bearer ${user1Token}` },
                },
            );
            assert.equal(res.status, 404);
            const data = await res.json();
            assert.equal(data.message, "Meal not found");
        });

        test("should return 403 Forbidden when user2 attempts to access user1 meal", async () => {
            const res = await fetch(`${baseUrl}/api/meals/${testMeal.id}`, {
                headers: { Authorization: `Bearer ${user2Token}` },
            });
            assert.equal(res.status, 403);
            const data = await res.json();
            assert.ok(data.message.includes("Forbidden"));
        });
    });

    describe("PUT /api/meals/:id (Update Meal)", () => {
        let updateMealTarget;

        before(async () => {
            updateMealTarget = await prisma.meal.create({
                data: {
                    name: "Original Meal Name",
                    caloriesPer100g: 100,
                    proteinPer100g: 10,
                    fatPer100g: 5,
                    carbsPer100g: 15,
                    userId: user1.id,
                },
            });
        });

        test("should return 404 for non-existent meal", async () => {
            const res = await fetch(
                `${baseUrl}/api/meals/00000000-0000-0000-0000-000000000000`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user1Token}`,
                    },
                    body: JSON.stringify({ name: "New Name" }),
                },
            );
            assert.equal(res.status, 404);
        });

        test("should return 403 Forbidden when user2 attempts to update user1 meal", async () => {
            const res = await fetch(
                `${baseUrl}/api/meals/${updateMealTarget.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user2Token}`,
                    },
                    body: JSON.stringify({ name: "Hacked Name" }),
                },
            );
            assert.equal(res.status, 403);
        });

        test("should return 400 when invalid macro value is supplied", async () => {
            const res = await fetch(
                `${baseUrl}/api/meals/${updateMealTarget.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user1Token}`,
                    },
                    body: JSON.stringify({ caloriesPer100g: -20 }),
                },
            );
            assert.equal(res.status, 400);
        });

        test("should return 400 when empty body is sent", async () => {
            const res = await fetch(
                `${baseUrl}/api/meals/${updateMealTarget.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user1Token}`,
                    },
                    body: JSON.stringify({}),
                },
            );
            assert.equal(res.status, 400);
        });

        test("should return 400 when updated name exceeds 60 characters", async () => {
            const res = await fetch(
                `${baseUrl}/api/meals/${updateMealTarget.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user1Token}`,
                    },
                    body: JSON.stringify({ name: "B".repeat(61) }),
                },
            );
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.ok(data.message.includes("cannot exceed 60 characters"));
        });

        test("should update meal successfully and return 200 OK", async () => {
            const res = await fetch(
                `${baseUrl}/api/meals/${updateMealTarget.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user1Token}`,
                    },
                    body: JSON.stringify({
                        name: "Updated Meal Name",
                        caloriesPer100g: 150.5,
                    }),
                },
            );

            assert.equal(res.status, 200);
            const updated = await res.json();
            assert.equal(updated.name, "Updated Meal Name");
            assert.equal(updated.caloriesPer100g, 150.5);
            assert.equal(updated.proteinPer100g, 10); // Unchanged
        });
    });

    describe("DELETE /api/meals/:id (Delete Meal)", () => {
        let deleteMealTarget;

        before(async () => {
            deleteMealTarget = await prisma.meal.create({
                data: {
                    name: "Meal To Be Deleted",
                    caloriesPer100g: 80,
                    proteinPer100g: 2,
                    fatPer100g: 1,
                    carbsPer100g: 15,
                    userId: user1.id,
                },
            });
        });

        test("should return 404 for non-existent meal", async () => {
            const res = await fetch(
                `${baseUrl}/api/meals/00000000-0000-0000-0000-000000000000`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${user1Token}` },
                },
            );
            assert.equal(res.status, 404);
        });

        test("should return 403 Forbidden when user2 attempts to delete user1 meal", async () => {
            const res = await fetch(
                `${baseUrl}/api/meals/${deleteMealTarget.id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${user2Token}` },
                },
            );
            assert.equal(res.status, 403);

            // Verify meal was not deleted
            const stillExists = await prisma.meal.findUnique({
                where: { id: deleteMealTarget.id },
            });
            assert.ok(stillExists);
        });

        test("should delete meal successfully and return 200 OK", async () => {
            const res = await fetch(
                `${baseUrl}/api/meals/${deleteMealTarget.id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${user1Token}` },
                },
            );
            assert.equal(res.status, 200);
            const data = await res.json();
            assert.equal(data.message, "Meal deleted successfully");

            // Verify meal is gone from database
            const check = await prisma.meal.findUnique({
                where: { id: deleteMealTarget.id },
            });
            assert.equal(check, null);
        });
    });
});
