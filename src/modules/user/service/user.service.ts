import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../global/database/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from '../../../global/guards/auth/service/auth.service';
import { ValidateUserDto } from '../../../global/guards/auth/dto/validate-user.dto';
import { EncriptyService } from '../../../global/helpers/encripty';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly PRISMA: PrismaService,
    private readonly AUTH_SERVICE: AuthService,
    private readonly ENCRIPTY_SERVICE: EncriptyService,
  ) {}

  async create(user: CreateUserDto) {
    const newUser = await this.PRISMA.user.create({
      data: {
        ...user,
        name: user.name,
        password: await this.ENCRIPTY_SERVICE.hash(user.password),
        slug: user.name.replace(/\s/g, '-').toLowerCase(),
      },
    });
    return await this.AUTH_SERVICE.login(newUser);
  }

  async loginUser(credentials: ValidateUserDto) {
    const user = await this.PRISMA.user.findFirst({
      where: { name: credentials.username, deleted: false },
      select: {
        id: true,
        name: true,
        slug: true,
        password: true,

        githubAccount: { select: { id: true } },
      },
    });
    return await this.AUTH_SERVICE.validateUser(credentials, user);
  }

  async find(slug: string) {
    const user = await this.PRISMA.user.findFirst({
      where: { slug, deleted: false },
      select: {
        name: true,
        email: true,

        githubAccount: {
          select: {
            avatarUrl: true,
            urlAccount: true,

            repositories: {
              select: { name: true, description: true, url: true },
            },
          },
        },
      },
    });

    return {
      ...user,
      avatarUrl: user.githubAccount.avatarUrl,
      urlAccount: user.githubAccount.urlAccount,
      repositories: user.githubAccount.repositories,
      githubAccount: undefined,
    };
  }

  async listByNameOrSlug(username: string) {
    const user = await this.PRISMA.user.findFirst({
      where: {
        slug: { contains: username },
        deleted: false,
        githubAccount: {
          deleted: false,
          repositories: { every: { deleted: false } },
        },
      },
      select: {
        name: true,
        email: true,

        githubAccount: {
          select: {
            avatarUrl: true,
            urlAccount: true,

            repositories: {
              select: { name: true, description: true, url: true },
            },
          },
        },
      },
    });

    return {
      ...user,
      avatarUrl: user.githubAccount.avatarUrl,
      urlAccount: user.githubAccount.urlAccount,
      repositories: user.githubAccount.repositories,
      githubAccount: undefined,
    };
  }

  async update(user: UpdateUserDto, userId: string) {
    const hashedPassword = user.password
      ? await this.ENCRIPTY_SERVICE.hash(user.password)
      : undefined;

    const formattedSlug = user.name
      ? user.name.replace(/\s/g, '-').toLowerCase()
      : undefined;

    return await this.PRISMA.user.update({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        slug: formattedSlug,
      },
      where: { id: userId },
      select: { name: true, email: true, password: true },
    });
  }

  async delete(userId: string) {
    return await this.PRISMA.user.update({
      where: { id: userId },
      data: { deleted: true },
      select: { name: true, deleted: true },
    });
  }

  async restore(userId: string) {
    return await this.PRISMA.user.update({
      where: { id: userId },
      data: { deleted: false },
      select: { name: true, deleted: true },
    });
  }
}
