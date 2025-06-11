/*
  Warnings:

  - You are about to drop the column `createdAt` on the `StudentAchievement` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `StudentAchievement` table. All the data in the column will be lost.
  - Added the required column `password` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `badgeId` to the `StudentAchievement` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL
);
INSERT INTO "new_Student" ("email", "id", "name", "role") SELECT "email", "id", "name", "role" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
CREATE TABLE "new_StudentAchievement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "badgeId" TEXT NOT NULL,
    CONSTRAINT "StudentAchievement_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StudentAchievement" ("id", "studentId") SELECT "id", "studentId" FROM "StudentAchievement";
DROP TABLE "StudentAchievement";
ALTER TABLE "new_StudentAchievement" RENAME TO "StudentAchievement";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
