# NutriChef

[![Live Demo](https://img.shields.io/badge/Live_Demo-nutrichef--ten.vercel.app-469c3c?style=flat&logo=vercel&logoColor=white)](https://nutrichef-ten.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Sass](https://img.shields.io/badge/Sass-SCSS-CC6699?style=flat&logo=sass&logoColor=white)](https://sass-lang.com/)
[![Tests](https://img.shields.io/badge/Tests-93%20passed-brightgreen?style=flat)](server/test)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat)](LICENSE)

NutriChef is a full-stack nutrition tracking web application engineered to eliminate guesswork in home-cooked meal management. It provides precise calculations of calories, proteins, fats, and carbohydrates based on raw ingredients and cooked portion weights, paired with a daily diary, customizable nutritional goals, and an automated macronutrient calculator.

**Live Preview**: [https://nutrichef-ten.vercel.app/](https://nutrichef-ten.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Interface Preview](#interface-preview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Security Architecture](#security-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Configuration](#environment-configuration)
    - [Database Initialization](#database-initialization)
    - [Running the Application](#running-the-application)
- [Testing and Code Quality](#testing-and-code-quality)
- [API Reference](#api-reference)
- [License](#license)

---

## Overview

Traditional calorie-tracking applications frequently fail when handling multi-ingredient home-cooked meals due to moisture evaporation during cooking and non-linear yield factors. NutriChef addresses this by calculating exact macronutrient densities per 100 grams of prepared dish:

$$\text{Macro per 100g} = \frac{\sum \text{Raw Ingredient Macros}}{\text{Final Cooked Weight (g)}} \times 100$$

This guarantees that any portion logged into the user's daily diary accurately reflects actual dietary intake.

---

## Interface Preview

### Landing Page

![NutriChef Landing Page](docs/screenshots/landing.png)

### Dashboard

![NutriChef Dashboard](docs/screenshots/dashboard.png)

### Saved Meals

![NutriChef Saved Meals](docs/screenshots/saved-meals.png)

### Create Meal & Recipe Calculator

![NutriChef Create Meal](docs/screenshots/create-meal.png)

---

## Key Features

### 1. Home-Cooked Meal Calculator

- Calculates nutritional values (Calories, Protein, Fat, Carbohydrates) per 100g and for any served portion.
- Computes caloric distribution percentages (P/F/C ratios).
- Saves recipes directly to a private meal collection.

### 2. Daily Nutrition Diary & Dashboard

- Interactive date navigator with day-by-day logging.
- Categorized logs for Breakfast, Lunch, Dinner, and Snacks.
- Real-time visual progress bars tracking consumption against target goals.
- Daily wellness and mindful eating recommendations.

### 3. Saved Meals Management

- Search, filter, edit, and delete saved recipes.
- Quick logging of saved meals directly to the active date with portion scaling.

### 4. Goal Setting & TDEE Calculator

- Custom daily targets for calories, protein, fat, and carbs.
- Scientific macro calculator based on the Mifflin-St Jeor equation:
    - Basal Metabolic Rate (BMR) estimation using age, gender, height, and weight.
    - Total Daily Energy Expenditure (TDEE) based on activity coefficients.
    - Goal adjustments for weight loss, maintenance, or muscle gain.

### 5. Profile & Session Management

- Local registration and login with bcrypt password hashing.
- Google OAuth 2.0 authentication integration.
- Secure avatar upload with file signature validation (magic bytes) and automatic disk cleanup.
- Account deletion with cascading data removal.

---

## Technology Stack

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Routing**: React Router DOM v7 (with `React.lazy` code splitting)
- **Styling**: SCSS (Modular Sass with design tokens and responsive mixins)
- **HTTP Client**: Axios (with custom auth interceptors and 15s timeout)
- **UI Components & Icons**: Lucide React, React Toastify
- **Resilience**: Custom React `ErrorBoundary` fallback

### Backend

- **Runtime**: Node.js
- **Framework**: Express 5
- **ORM**: Prisma Client v6
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (`jsonwebtoken` with HS256 algorithm enforcement) and `bcryptjs`
- **Security**: Helmet, Express Rate Limit, CORS protection
- **File Processing**: Multer with magic-byte image validation
- **Mailing**: Nodemailer (password reset flow)

---

## Security Architecture

NutriChef has undergone a comprehensive backend and client-side security audit:

- **Rate Limiting**: Tiered protection against brute-force and denial-of-service attacks via `express-rate-limit`:
    - 300 requests / 15 min on general API endpoints.
    - 10 requests / 15 min on sensitive auth routes (`login`, `forgot-password`, `reset-password`).
    - 10 registrations / hour per IP address.
- **Enumeration Protection**: The `forgotPassword` endpoint returns a uniform `200 OK` response regardless of email existence, preventing account harvesting.
- **JWT Hardening**: Explicit `HS256` algorithm specification on token generation and verification, preventing algorithm-confusion attacks.
- **Upload Hardening**: Avatar uploads enforce file extension whitelists (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`), MIME checks, and strict magic-byte signature inspection (`FF D8 FF`, `89 50 4E 47`, `RIFF/WEBP`, `GIF8`).
- **Database Indexing**: Targeted compound and single-column indexes on `Meal` (`userId`) and `DailyLog` (`userId, date`, `mealId`) for high-throughput queries.
- **Client Resilience**: Global `ErrorBoundary` preventing application unmounts, network timeout boundaries, and sanitized error messages hiding stack traces in production.

---

## Project Structure

```text
nutrichef/
|-- client/                         # Frontend React Application
|   |-- public/                     # Static public assets (favicon, logo)
|   |-- src/
|   |   |-- api/                    # Axios instance and API service modules
|   |   |-- assets/                 # Processed images and graphics
|   |   |-- components/             # Reusable UI elements, modals, layout
|   |   |-- context/                # AuthContext state provider
|   |   |-- pages/                  # Route views (Landing, Dashboard, Settings, etc.)
|   |   |-- routes/                 # Route configuration with code-splitting
|   |   |-- styles/                 # SCSS variables, mixins, reset, global styles
|   |   `-- utils/                  # Date helpers, math formulas, user formatters
|   |-- index.html                  # HTML entry point with SEO metadata
|   `-- package.json
|
|-- server/                         # Backend Express Application
|   |-- prisma/
|   |   `-- schema.prisma           # Prisma database schema and indexes
|   |-- src/
|   |   |-- controllers/            # Request handlers (auth, meals, logs, dashboard)
|   |   |-- middleware/             # Auth verification, rate limiting, file upload
|   |   |-- routes/                 # Express API routes
|   |   |-- services/               # Nodemailer email service
|   |   `-- app.js                  # Express app configuration
|   |-- test/                       # Node.js automated test suites (93 tests)
|   |-- .env.example                # Environment variables reference
|   `-- package.json
|
`-- README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18.x, v20.x, or v22.x recommended)
- PostgreSQL database instance
- npm or yarn package manager

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/OkayMarta/nutrichef.git
    cd nutrichef
    ```

2. Install backend dependencies:

    ```bash
    cd server
    npm install
    ```

3. Install frontend dependencies:
    ```bash
    cd ../client
    npm install
    ```

### Environment Configuration

#### 1. Server Environment (`server/.env`)

Create a `.env` file in `server/` using `server/.env.example` as a template:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Connection
DATABASE_URL="postgresql://username:password@localhost:5432/nutrichef_db?schema=public"

# JWT Authentication
JWT_SECRET="generate_a_secure_random_string_here"
JWT_EXPIRES_IN="7d"

# Google OAuth 2.0 (Optional)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"

# Client URL (for CORS & Reset Links)
FRONTEND_URL="http://localhost:5173"

# SMTP Configuration (Optional, for Password Reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="NutriChef <noreply@nutrichef.com>"
```

#### 2. Client Environment (`client/.env`)

Create a `.env` file in `client/`:

```env
VITE_API_URL="http://localhost:5000"
```

### Database Initialization

From the `server/` directory, apply the Prisma schema to your PostgreSQL database:

```bash
cd server
npx prisma db push
```

To inspect database tables in a visual interface:

```bash
npx prisma studio
```

### Running the Application

1. Start the backend development server:

    ```bash
    cd server
    npm run dev
    ```

    Server will run on `http://localhost:5000`.

2. Start the frontend development server:
    ```bash
    cd client
    npm run dev
    ```
    Client will run on `http://localhost:5173`.

---

## Testing and Code Quality

### Backend Automated Tests

The backend test suite is written using the native Node.js test runner (`node:test`) and covers authentication, session management, access isolation (IDOR protection), meal calculations, and daily logging.

Run all tests:

```bash
cd server
npm test
```

Expected result:

```text
# tests 93
# suites 30
# pass 93
# fail 0
# cancelled 0
# skipped 0
```

### Frontend Code Quality

Check code styling and ESLint compliance:

```bash
cd client
npm run lint
```

Verify production build and chunk distribution:

```bash
cd client
npm run build
```

---

## API Reference

### Authentication (`/api/auth`)

| Method   | Endpoint                    | Description                       | Auth Required |
| :------- | :-------------------------- | :-------------------------------- | :------------ |
| `POST`   | `/api/auth/register`        | Register new user account         | No            |
| `POST`   | `/api/auth/login`           | Authenticate with credentials     | No            |
| `POST`   | `/api/auth/google`          | Authenticate with Google ID token | No            |
| `GET`    | `/api/auth/me`              | Fetch active user profile         | Yes (JWT)     |
| `PUT`    | `/api/auth/profile`         | Update profile information        | Yes (JWT)     |
| `PUT`    | `/api/auth/goals`           | Update daily nutritional goals    | Yes (JWT)     |
| `POST`   | `/api/auth/avatar`          | Upload profile avatar (multipart) | Yes (JWT)     |
| `POST`   | `/api/auth/forgot-password` | Request password reset token      | No            |
| `POST`   | `/api/auth/reset-password`  | Reset password using valid token  | No            |
| `DELETE` | `/api/auth/account`         | Permanently delete user account   | Yes (JWT)     |

### Meals & Calculator (`/api/meals`)

| Method   | Endpoint         | Description                        | Auth Required |
| :------- | :--------------- | :--------------------------------- | :------------ |
| `POST`   | `/api/meals`     | Create new calculated meal         | Yes (JWT)     |
| `GET`    | `/api/meals`     | List and search user's saved meals | Yes (JWT)     |
| `GET`    | `/api/meals/:id` | Retrieve single meal by ID         | Yes (JWT)     |
| `PUT`    | `/api/meals/:id` | Update meal macros and details     | Yes (JWT)     |
| `DELETE` | `/api/meals/:id` | Delete meal from library           | Yes (JWT)     |

### Daily Diary & Logs (`/api/logs` & `/api/dashboard`)

| Method   | Endpoint               | Description                            | Auth Required |
| :------- | :--------------------- | :------------------------------------- | :------------ |
| `GET`    | `/api/dashboard/:date` | Aggregated statistics, logs, and goals | Yes (JWT)     |
| `POST`   | `/api/logs`            | Log meal consumption for specific date | Yes (JWT)     |
| `PUT`    | `/api/logs/:id`        | Update consumed portion or meal type   | Yes (JWT)     |
| `DELETE` | `/api/logs/:id`        | Remove entry from daily diary          | Yes (JWT)     |

---

## License

This project is licensed under the [ISC License](LICENSE).
