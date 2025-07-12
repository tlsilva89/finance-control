/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - Added the required column `birthDate` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `securityAnswer` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `securityQuestion` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_credit_cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "limit" REAL NOT NULL,
    "currentDebt" REAL NOT NULL,
    "dueDate" INTEGER NOT NULL,
    "monthReference" TEXT NOT NULL DEFAULT '2025-06',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "credit_cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_credit_cards" ("createdAt", "currentDebt", "dueDate", "id", "limit", "monthReference", "name", "userId") SELECT "createdAt", "currentDebt", "dueDate", "id", "limit", "monthReference", "name", "userId" FROM "credit_cards";
DROP TABLE "credit_cards";
ALTER TABLE "new_credit_cards" RENAME TO "credit_cards";
CREATE TABLE "new_incomes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "monthReference" TEXT NOT NULL DEFAULT '2025-06',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "incomes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_incomes" ("amount", "createdAt", "date", "description", "id", "monthReference", "userId") SELECT "amount", "createdAt", "date", "description", "id", "monthReference", "userId" FROM "incomes";
DROP TABLE "incomes";
ALTER TABLE "new_incomes" RENAME TO "incomes";
CREATE TABLE "new_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "dueDate" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "monthReference" TEXT NOT NULL DEFAULT '2025-06',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "services_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_services" ("amount", "category", "createdAt", "dueDate", "id", "monthReference", "name", "userId") SELECT "amount", "category", "createdAt", "dueDate", "id", "monthReference", "name", "userId" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
CREATE TABLE "new_subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "renewalDate" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    "monthReference" TEXT NOT NULL DEFAULT '2025-06',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_subscriptions" ("amount", "category", "createdAt", "id", "monthReference", "name", "renewalDate", "userId") SELECT "amount", "category", "createdAt", "id", "monthReference", "name", "renewalDate", "userId" FROM "subscriptions";
DROP TABLE "subscriptions";
ALTER TABLE "new_subscriptions" RENAME TO "subscriptions";
CREATE TABLE "new_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "date" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "creditCardId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "credit_cards" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("amount", "category", "createdAt", "creditCardId", "date", "description", "id", "type", "userId") SELECT "amount", "category", "createdAt", "creditCardId", "date", "description", "id", "type", "userId" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "password" TEXT NOT NULL,
    "securityQuestion" TEXT NOT NULL,
    "securityAnswer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "id", "name", "password") SELECT "createdAt", "id", "name", "password" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
