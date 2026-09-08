require("dotenv").config();
const app = require("./src/app");
const prisma = require("./src/lib/prisma");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const gracefulShutdown = async (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
        try {
            await prisma.$disconnect();
            console.log("Database disconnected. Process exiting.");
            process.exit(0);
        } catch (err) {
            console.error("Error disconnecting database:", err);
            process.exit(1);
        }
    });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

module.exports = server;
