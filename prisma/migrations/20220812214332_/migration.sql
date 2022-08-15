/*
  Warnings:

  - The primary key for the `github_account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_git_account` on the `github_account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_github_api]` on the table `github_account` will be added. If there are existing duplicate values, this will fail.
  - The required column `id_github_account` was added to the `github_account` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id_github_api` to the `github_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `github_account` DROP PRIMARY KEY,
    DROP COLUMN `id_git_account`,
    ADD COLUMN `id_github_account` CHAR(36) NOT NULL,
    ADD COLUMN `id_github_api` INTEGER NOT NULL,
    MODIFY `deleted` BIT(1) NOT NULL DEFAULT false,
    ADD PRIMARY KEY (`id_github_account`);

-- AlterTable
ALTER TABLE `repository` MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `github_account_id_github_api_key` ON `github_account`(`id_github_api`);
