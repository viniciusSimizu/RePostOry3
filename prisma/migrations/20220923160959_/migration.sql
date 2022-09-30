-- CreateTable
CREATE TABLE `user` (
    `id_user` CHAR(36) NOT NULL,
    `slug` VARCHAR(50) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` CHAR(64) NOT NULL,
    `refresh_token` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted` BIT(1) NOT NULL DEFAULT false,

    UNIQUE INDEX `user_slug_key`(`slug`),
    UNIQUE INDEX `user_name_key`(`name`),
    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_refresh_token_key`(`refresh_token`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `github_account` (
    `id_github_account` CHAR(36) NOT NULL,
    `id_github_account_github_api` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `access_token` CHAR(40) NOT NULL,
    `avatar_url` VARCHAR(191) NULL,
    `url_account` VARCHAR(191) NOT NULL,
    `id_user` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted` BIT(1) NOT NULL DEFAULT false,

    UNIQUE INDEX `github_account_id_github_account_github_api_key`(`id_github_account_github_api`),
    UNIQUE INDEX `github_account_url_account_key`(`url_account`),
    UNIQUE INDEX `github_account_id_user_key`(`id_user`),
    PRIMARY KEY (`id_github_account`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repository` (
    `id_repository` CHAR(36) NOT NULL,
    `id_repository_github_api` INTEGER NOT NULL,
    `repo_name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `description` MEDIUMTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted` BIT(1) NOT NULL DEFAULT false,
    `id_github_account` CHAR(36) NOT NULL,

    UNIQUE INDEX `repository_id_repository_github_api_key`(`id_repository_github_api`),
    UNIQUE INDEX `repository_url_key`(`url`),
    PRIMARY KEY (`id_repository`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `github_account` ADD CONSTRAINT `github_account_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repository` ADD CONSTRAINT `repository_id_github_account_fkey` FOREIGN KEY (`id_github_account`) REFERENCES `github_account`(`id_github_account`) ON DELETE RESTRICT ON UPDATE CASCADE;
