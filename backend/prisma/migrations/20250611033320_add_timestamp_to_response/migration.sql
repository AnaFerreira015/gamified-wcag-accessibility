/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ResponseHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[badgeId]` on the table `StudentAchievement` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ResponseHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ResponseHistory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ResponseHistory" ("id", "isCorrect", "questionId", "studentId") SELECT "id", "isCorrect", "questionId", "studentId" FROM "ResponseHistory";
DROP TABLE "ResponseHistory";
ALTER TABLE "new_ResponseHistory" RENAME TO "ResponseHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "StudentAchievement_badgeId_key" ON "StudentAchievement"("badgeId");
