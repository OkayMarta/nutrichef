require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { test, describe, before, after } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const prisma = require("../src/lib/prisma");
const { OAuth2Client } = require("google-auth-library");

let server;
let baseUrl;
const testEmail = `test_user_${Date.now()}@example.com`;
const testPassword = "Password123!";
let authToken;
let createdUserId;

describe("Authentication & Security Module Tests", () => {
    before(async () => {
        // Ensure DB connection
        await prisma.$connect();

        // Start server on random available port
        await new Promise((resolve) => {
            server = app.listen(0, () => {
                const port = server.address().port;
                baseUrl = `http://127.0.0.1:${port}`;
                resolve();
            });
        });
    });

    after(async () => {
        // Clean up created test user
        if (createdUserId) {
            await prisma.user.deleteMany({
                where: { id: createdUserId },
            });
        }

        // Clean up any test users matching test prefix
        await prisma.user.deleteMany({
            where: { email: { contains: "test_user_" } },
        });

        await prisma.user.deleteMany({
            where: { email: { contains: "google_test_" } },
        });

        await prisma.$disconnect();
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
    });

    describe("Health Check Endpoint", () => {
        test("GET /api/health should return 200 and status ok", async () => {
            const res = await fetch(`${baseUrl}/api/health`);
            assert.equal(res.status, 200);
            const data = await res.json();
            assert.equal(data.status, "ok");
        });
    });

    describe("POST /api/auth/register", () => {
        test("should reject registration when email or password is missing", async () => {
            const res1 = await fetch(`${baseUrl}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: testEmail }),
            });
            assert.equal(res1.status, 400);
            const data1 = await res1.json();
            assert.ok(data1.message.includes("required"));

            const res2 = await fetch(`${baseUrl}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: testPassword }),
            });
            assert.equal(res2.status, 400);
        });

        test("should reject registration with invalid email format", async () => {
            const res = await fetch(`${baseUrl}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: "not-an-email",
                    password: testPassword,
                }),
            });
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.equal(data.message, "Invalid email format");
        });

        test("should reject registration with password shorter than 6 chars", async () => {
            const res = await fetch(`${baseUrl}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: testEmail, password: "123" }),
            });
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.ok(data.message.includes("at least 6 characters"));
        });

        test("should successfully register a new user and return token + user without passwordHash", async () => {
            const res = await fetch(`${baseUrl}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: testEmail,
                    password: testPassword,
                }),
            });

            assert.equal(res.status, 201);
            const data = await res.json();
            assert.ok(data.token, "Token should be returned");
            assert.ok(data.user, "User object should be returned");
            assert.equal(data.user.email, testEmail.toLowerCase());
            assert.equal(
                data.user.passwordHash,
                undefined,
                "passwordHash must not be exposed",
            );
            assert.ok(data.user.id, "User id should be present");

            // Verify JWT payload
            const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
            assert.equal(decoded.userId, data.user.id);

            createdUserId = data.user.id;
            authToken = data.token;
        });

        test("should reject duplicate email registration with 400 Bad Request", async () => {
            const res = await fetch(`${baseUrl}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: testEmail,
                    password: testPassword,
                }),
            });

            assert.equal(res.status, 400);
            const data = await res.json();
            assert.equal(
                data.message,
                "An account with this email already exists",
            );
        });
    });

    describe("POST /api/auth/login", () => {
        test("should reject login if email or password missing", async () => {
            const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: testEmail }),
            });
            assert.equal(res.status, 400);
        });

        test("should reject login for non-existent user with 401 Unauthorized", async () => {
            const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: "nonexistent@example.com",
                    password: "SomePassword1!",
                }),
            });
            assert.equal(res.status, 401);
            const data = await res.json();
            assert.equal(data.message, "No account found with this email");
        });

        test("should reject login with wrong password with 401 Unauthorized", async () => {
            const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: testEmail,
                    password: "WrongPassword123!",
                }),
            });
            assert.equal(res.status, 401);
            const data = await res.json();
            assert.equal(data.message, "Incorrect password. Please try again.");
        });

        test("should successfully login and return JWT and user info without passwordHash", async () => {
            const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: testEmail,
                    password: testPassword,
                }),
            });

            assert.equal(res.status, 200);
            const data = await res.json();
            assert.ok(data.token);
            assert.ok(data.user);
            assert.equal(data.user.email, testEmail.toLowerCase());
            assert.equal(
                data.user.passwordHash,
                undefined,
                "passwordHash must not be returned",
            );

            // Update authToken to the newly issued one
            authToken = data.token;
        });
    });

    describe("Authentication Middleware (authMiddleware)", () => {
        test("should reject request when Authorization header is missing", async () => {
            const res = await fetch(`${baseUrl}/api/auth/me`);
            assert.equal(res.status, 401);
            const data = await res.json();
            assert.equal(
                data.message,
                "Authorization header missing or malformed",
            );
        });

        test("should reject request when Authorization header does not use Bearer scheme", async () => {
            const res = await fetch(`${baseUrl}/api/auth/me`, {
                headers: { Authorization: `Basic ${authToken}` },
            });
            assert.equal(res.status, 401);
            const data = await res.json();
            assert.equal(
                data.message,
                "Authorization header missing or malformed",
            );
        });

        test("should reject request with an invalid token signature", async () => {
            const invalidToken = jwt.sign(
                { userId: "fake-id" },
                "wrong_secret",
            );
            const res = await fetch(`${baseUrl}/api/auth/me`, {
                headers: { Authorization: `Bearer ${invalidToken}` },
            });
            assert.equal(res.status, 401);
            const data = await res.json();
            assert.equal(data.message, "Invalid token");
        });

        test("should reject request with an expired token", async () => {
            const expiredToken = jwt.sign(
                { userId: createdUserId },
                process.env.JWT_SECRET,
                { expiresIn: -10 },
            );
            const res = await fetch(`${baseUrl}/api/auth/me`, {
                headers: { Authorization: `Bearer ${expiredToken}` },
            });
            assert.equal(res.status, 401);
            const data = await res.json();
            assert.equal(data.message, "Token has expired");
        });

        test("should allow access to protected route with valid Bearer token", async () => {
            const res = await fetch(`${baseUrl}/api/auth/me`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            assert.equal(res.status, 200);
            const data = await res.json();
            assert.ok(data.user);
            assert.equal(data.user.id, createdUserId);
            assert.equal(data.user.email, testEmail.toLowerCase());
            assert.equal(data.user.passwordHash, undefined);
        });
    });

    describe("POST /api/auth/google", () => {
        test("should reject Google auth when token is missing", async () => {
            const res = await fetch(`${baseUrl}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.equal(data.message, "Google credential token is required");
        });

        test("should return 401 for an invalid or forged Google token", async () => {
            const res = await fetch(`${baseUrl}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: "invalid.google.token" }),
            });
            assert.equal(res.status, 401);
            const data = await res.json();
            assert.equal(data.message, "Invalid or expired Google token");
        });

        test("should authenticate and auto-create user when Google token is valid", async () => {
            // Mock OAuth2Client.prototype.verifyIdToken to test successful Google auth flow
            const originalVerifyIdToken = OAuth2Client.prototype.verifyIdToken;
            const googleMockEmail = `google_test_${Date.now()}@gmail.com`;

            OAuth2Client.prototype.verifyIdToken = async function () {
                return {
                    getPayload: () => ({
                        email: googleMockEmail,
                        email_verified: true,
                        name: "Google Test User",
                    }),
                };
            };

            try {
                const res = await fetch(`${baseUrl}/api/auth/google`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: "mock-valid-google-id-token",
                    }),
                });

                assert.equal(res.status, 200);
                const data = await res.json();
                assert.ok(data.token, "Should return session JWT");
                assert.ok(data.user, "Should return user info");
                assert.equal(data.user.email, googleMockEmail);
                assert.equal(
                    data.user.passwordHash,
                    undefined,
                    "passwordHash must not be exposed",
                );

                // Check user exists in database
                const dbUser = await prisma.user.findUnique({
                    where: { email: googleMockEmail },
                });
                assert.ok(dbUser, "User must be saved in database");
                assert.ok(
                    dbUser.passwordHash,
                    "PasswordHash should be populated with secure hash",
                );

                // Clean up mock user
                await prisma.user.delete({ where: { id: dbUser.id } });
            } finally {
                OAuth2Client.prototype.verifyIdToken = originalVerifyIdToken;
            }
        });

        test("should authenticate existing user with Google login without creating duplicate", async () => {
            // Mock OAuth2Client.prototype.verifyIdToken returning the registered user's email
            const originalVerifyIdToken = OAuth2Client.prototype.verifyIdToken;

            OAuth2Client.prototype.verifyIdToken = async function () {
                return {
                    getPayload: () => ({
                        email: testEmail,
                        email_verified: true,
                        name: "Existing User",
                    }),
                };
            };

            try {
                const countBefore = await prisma.user.count({
                    where: { email: testEmail.toLowerCase() },
                });
                assert.equal(countBefore, 1);

                const res = await fetch(`${baseUrl}/api/auth/google`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: "mock-valid-google-id-token",
                    }),
                });

                assert.equal(res.status, 200);
                const data = await res.json();
                assert.ok(data.token);
                assert.equal(data.user.id, createdUserId);

                const countAfter = await prisma.user.count({
                    where: { email: testEmail.toLowerCase() },
                });
                assert.equal(
                    countAfter,
                    1,
                    "No duplicate record should be created",
                );
            } finally {
                OAuth2Client.prototype.verifyIdToken = originalVerifyIdToken;
            }
        });
    });

    describe("PUT /api/auth/goals", () => {
        test("should reject request when unauthenticated", async () => {
            const res = await fetch(`${baseUrl}/api/auth/goals`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    goalCalories: 2000,
                    goalProtein: 140,
                    goalFat: 65,
                    goalCarbs: 210,
                }),
            });
            assert.equal(res.status, 401);
        });

        test("should reject request when any goal field is missing", async () => {
            const res = await fetch(`${baseUrl}/api/auth/goals`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    goalCalories: 2000,
                }),
            });
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.ok(data.message.includes("required"));
        });

        test("should reject request when goal value is not a positive number", async () => {
            const res = await fetch(`${baseUrl}/api/auth/goals`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    goalCalories: -500,
                    goalProtein: 140,
                    goalFat: 65,
                    goalCarbs: 210,
                }),
            });
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.ok(data.message.includes("positive number"));
        });

        test("should successfully update goals and return updated user", async () => {
            const res = await fetch(`${baseUrl}/api/auth/goals`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    goalCalories: 2200,
                    goalProtein: 160,
                    goalFat: 70,
                    goalCarbs: 230,
                }),
            });
            assert.equal(res.status, 200);
            const data = await res.json();
            assert.equal(data.user.goalCalories, 2200);
            assert.equal(data.user.goalProtein, 160);
            assert.equal(data.user.goalFat, 70);
            assert.equal(data.user.goalCarbs, 230);
        });
    });

    describe("PUT /api/auth/profile", () => {
        test("should reject profile update when unauthenticated", async () => {
            const res = await fetch(`${baseUrl}/api/auth/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Jane Doe" }),
            });
            assert.equal(res.status, 401);
        });

        test("should reject non-string name", async () => {
            const res = await fetch(`${baseUrl}/api/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ name: 12345 }),
            });
            assert.equal(res.status, 400);
        });

        test("should successfully update user name (including Cyrillic)", async () => {
            const res = await fetch(`${baseUrl}/api/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ name: "Олександр Шевченко" }),
            });
            assert.equal(res.status, 200);
            const data = await res.json();
            assert.equal(data.user.name, "Олександр Шевченко");
        });
    });

    describe("POST /api/auth/avatar", () => {
        test("should reject avatar upload when unauthenticated", async () => {
            const res = await fetch(`${baseUrl}/api/auth/avatar`, {
                method: "POST",
            });
            assert.equal(res.status, 401);
        });

        test("should reject avatar upload when no file is provided", async () => {
            const formData = new FormData();
            const res = await fetch(`${baseUrl}/api/auth/avatar`, {
                method: "POST",
                headers: { Authorization: `Bearer ${authToken}` },
                body: formData,
            });
            assert.equal(res.status, 400);
        });

        test("should upload avatar image and return updated user with avatarUrl", async () => {
            // Create a minimal PNG buffer
            const png1x1 = Buffer.from(
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                "base64",
            );
            const blob = new Blob([png1x1], { type: "image/png" });
            const formData = new FormData();
            formData.append("avatar", blob, "avatar.png");

            const res = await fetch(`${baseUrl}/api/auth/avatar`, {
                method: "POST",
                headers: { Authorization: `Bearer ${authToken}` },
                body: formData,
            });
            assert.equal(res.status, 200);
            const data = await res.json();
            assert.ok(data.user.avatarUrl);
            assert.ok(data.user.avatarUrl.startsWith("/uploads/avatars/"));

            // Verify the static endpoint serves the avatar
            const staticRes = await fetch(`${baseUrl}${data.user.avatarUrl}`);
            assert.equal(staticRes.status, 200);

            // Clean up uploaded test avatar file from disk
            const uploadedFilePath = path.join(
                __dirname,
                "..",
                data.user.avatarUrl,
            );
            if (fs.existsSync(uploadedFilePath)) {
                fs.unlinkSync(uploadedFilePath);
            }
        });
    });
});
