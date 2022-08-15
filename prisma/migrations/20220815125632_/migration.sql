/*
  Warnings:

  - You are about to drop the column `id_github_api` on the `github_account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_github_account_github_api]` on the table `github_account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_repository_github_api]` on the table `repository` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_github_account_github_api` to the `github_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `github_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_repository_github_api` to the `repository` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `github_account_id_github_api_key` ON `github_account`;

-- AlterTable
ALTER TABLE `github_account` DROP COLUMN `id_github_api`,
    ADD COLUMN `id_github_account_github_api` INTEGER NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL,
    MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `repository` ADD COLUMN `id_repository_github_api` INTEGER NOT NULL,
    MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `github_account_id_github_account_github_api_key` ON `github_account`(`id_github_account_github_api`);

-- CreateIndex
CREATE UNIQUE INDEX `repository_id_repository_github_api_key` ON `repository`(`id_repository_github_api`);
