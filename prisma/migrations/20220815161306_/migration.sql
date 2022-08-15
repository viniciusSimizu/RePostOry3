/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `github_account` MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `repository` MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `slug` VARCHAR(50) NOT NULL,
    MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `user_slug_key` ON `user`(`slug`);
