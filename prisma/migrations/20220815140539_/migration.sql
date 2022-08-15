-- AlterTable
ALTER TABLE `github_account` MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `repository` MODIFY `description` MEDIUMTEXT NULL,
    MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` MODIFY `deleted` BIT(1) NOT NULL DEFAULT false;
