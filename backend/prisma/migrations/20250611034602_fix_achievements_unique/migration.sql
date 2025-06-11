/*
  Warnings:

  - A unique constraint covering the columns `[studentId,badgeId]` on the table `StudentAchievement` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StudentAchievement_badgeId_key";

-- CreateIndex
CREATE UNIQUE INDEX "StudentAchievement_studentId_badgeId_key" ON "StudentAchievement"("studentId", "badgeId");
