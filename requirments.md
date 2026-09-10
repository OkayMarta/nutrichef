# NutriChef: Project Description and Technical Requirements

This document contains a complete overview of the architecture, features, and business logic for a full-stack web application designed for nutrition tracking and calculating macronutrients of complex cooked meals.

## 1. General Project Concept

**NutriChef** is a full-stack web application built for detailed daily diet tracking. Its core unique feature is the ability to accurately calculate the nutritional value of complex cooked meals based on raw ingredients and the final weight after thermal processing (cooking). The application includes a user account system, a personal nutritional diary, and daily goal tracking.

## 2. Tech Stack & Infrastructure

The project uses a split architecture (monorepo with `client` and `server` directories).

**Frontend (`client` directory):**

- **Framework:** React (initialized via Vite).
- **Styling:** CSS / Component libraries (at the UI developer's discretion).
- **Hosting (planned):** Vercel or Netlify (Free tier).

**Backend (`server` directory):**

- **Environment:** Node.js.
- **Framework:** Express.js.
- **Hosting (planned):** Render (Free tier).

**Database:**

- **DBMS:** PostgreSQL.
- **ORM:** Prisma **(Version 6)**.
- **DB Hosting (planned):** Neon or Supabase (Free tier).

## 3. Core Features

### 3.1. Authentication and Users

- User registration and authorization (Email/Password with password hashing).
- OAuth support (Google Login).
- API route protection using JWT (JSON Web Tokens).
- Daily macro goals configuration in the user profile (Calories, Protein, Fat, Carbs).

### 3.2. Meal Calculator and Management (Meal CRUD)

- Create, read, update, and delete custom meals.
- Meal privacy (each user only sees their own meals).
- Calculation of macros per 100g of the cooked meal using a custom formula.

### 3.3. Nutritional Diary

- Logging consumed meals for a specific date, indicating the meal type (`BREAKFAST`, `LUNCH`, `DINNER`, `SNACK`).
- Specifying the weight of the consumed portion (in grams).
- **Historical Data:** Saving a snapshot of macros at the exact time of logging (ensuring that future changes to a meal's recipe do not break the diary history for past days).

### 3.4. Additional Widgets

- An AI-style "Daily Tip" widget to motivate or inform the user.
- Visualization of daily goal progress (e.g., progress bars or pie charts).

## 4. Business Logic: Macro Calculation Formula

The system must calculate the final macronutrients of a meal per 100 grams after it is cooked (accounting for moisture loss/reduction).

**Formula for calculation (applied separately to each macro: calories, protein, fat, carbs):**

```text
(Sum of the macro for all raw ingredients / Final cooked weight of the meal) * 100 = Value per 100g

```

## 5. Database Structure (Prisma Schema)

The database consists of three main models:

1. **User:**

- Stores credentials (`email`, `passwordHash`).
- Stores optional goal settings (`goalCalories`, `goalProtein`, `goalFat`, `goalCarbs`).
- Has a 1-to-Many relationship with the `Meal` and `DailyLog` models.

2. **Meal:**

- Stores the meal name and pre-calculated values per 100g (`caloriesPer100g`, `proteinPer100g`, `fatPer100g`, `carbsPer100g`).
- Linked to a specific user (`userId`).

3. **DailyLog:**

- Records a consumption event: date (date only, no time), meal type (Enum `MealType`), portion weight (`consumedGrams`).
- Stores independent copies of macros (`snapshotCalories`, etc.).
- Linked to the user and the original meal. If a user or meal is deleted, the associated logs are deleted automatically (`onDelete: Cascade`).
