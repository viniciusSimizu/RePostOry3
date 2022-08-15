/*
  Warnings:

  - You are about to drop the column `id_github` on the `repository` table. All the data in the column will be lost.
  - Added the required column `id_github_account` to the `repository` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `repository` DROP FOREIGN KEY `repository_id_github_fkey`;

-- AlterTable
ALTER TABLE `github_account` MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `repository` DROP COLUMN `id_github`,
    ADD COLUMN `id_github_account` CHAR(36) NOT NULL,
    MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `repository` ADD CONSTRAINT `repository_id_github_account_fkey` FOREIGN KEY (`id_github_account`) REFERENCES `github_account`(`id_github_account`) ON DELETE RESTRICT ON UPDATE CASCADE;
