import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../../global/database/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from '../../../global/guards/auth/service/auth.service';
import { ValidateUserDto } from '../../../global/guards/auth/dto/validate-user.dto';
import { EncriptyService } from '../../../global/helpers/encripty';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GithubService } from '../../github/service/github.service';
import { errorHandle } from '../../../global/helpers/errorHandle';

@Injectable()
export class UserService {
  constructor(
    private readonly PRISMA: PrismaService,
    private readonly GITHUB_SERVICE: GithubService,
    private readonly AUTH_SERVICE: AuthService,
    private readonly ENCRIPTY_SERVICE: EncriptyService,
  ) {}

  async create(user: CreateUserDto) {
    if (
      await this.PRISMA.user.findFirst({
        where: {
          OR: {
            email: user.email,
            name: user.name,
          },
        },
      })
    ) {
      throw new BadRequestException('User already exist');
    }

    const newUser = await this.PRISMA.user.create({
      data: {
        ...user,
        name: user.name,
        password: await this.ENCRIPTY_SERVICE.hash(user.password),
        slug: user.name.replace(/\s/g, '-').toLowerCase(),
      },
      select: {
        id: true,
      },
    });
    const tokens = await this.AUTH_SERVICE.login(newUser);

    await this.helperSaveRefreshToken(newUser.id, tokens.refreshToken);

    return { tokens };
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

    const tokens = await this.AUTH_SERVICE.validateUser(credentials, user);

    await this.helperSaveRefreshToken(user.id, tokens.refreshToken);

    return { tokens, gitUser: !!user?.githubAccount };
  }

  async find(slug: string) {
    const user = await this.PRISMA.user.findFirst({
      where: { slug, deleted: false },
      select: {
        name: true,

        githubAccount: {
          select: {
            id: true,
            avatarUrl: true,
            urlAccount: true,
            username: true,

            repositories: {
              select: { repoName: true, description: true, url: true },
            },
          },
        },
      },
    });

    return user;
  }

  async listByNameOrSlug(username: string) {
    const users = await this.PRISMA.user.findMany({
      where: {
        slug: { contains: username },
        deleted: false,
      },
      select: {
        name: true,
        email: true,
        slug: true,

        githubAccount: {
          select: {
            username: true,
            avatarUrl: true,
            urlAccount: true,

            repositories: {
              select: { repoName: true, description: true, url: true },
            },
          },
        },
      },
    });

    return users.map((user) => ({
      ...user,
      avatarUrl: user?.githubAccount?.avatarUrl,
      urlAccount: user?.githubAccount?.urlAccount,
      repositories: user?.githubAccount?.repositories.length,
      username: user?.githubAccount?.username,
      githubAccount: undefined,
      email: undefined,
    }));
  }

  async getInfo(userId: string) {
    const user = await this.PRISMA.user.findFirst({
      where: { id: userId },
      select: {
        name: true,
        email: true,

        githubAccount: {
          select: {
            username: true,
            avatarUrl: true,
            urlAccount: true,

            _count: {
              select: {
                repositories: true,
              },
            },
          },
        },
      },
    });

    if (user.githubAccount) {
      await this.GITHUB_SERVICE.listRepositories(userId)
        .then((gitRepositories) => {
          user.githubAccount._count['gitRepositories'] = gitRepositories.length;
        })
        .catch(() => (user.githubAccount._count['gitRepositories'] = 'Failed'));
    }

    return user;
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
    await this.PRISMA.repository.deleteMany({
      where: {
        githubAccount: {
          userId,
        },
      },
    });
    await this.PRISMA.githubAccount.deleteMany({
      where: {
        userId,
      },
    });
    await this.PRISMA.user.delete({
      where: { id: userId },
    });
  }

  async verifySignature(token: string) {
    const userId = await this.AUTH_SERVICE.verifyToken(token);

    const user = await this.PRISMA.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        githubAccount: {
          select: {
            username: true,
          },
        },
      },
    });

    return { gitUser: !!user.githubAccount };
  }

  async refreshTokenUser(refreshToken: string) {
    const userId = await this.AUTH_SERVICE.refreshToken(refreshToken);

    const user = await this.PRISMA.user
      .findFirstOrThrow({
        where: { AND: { id: userId, refreshToken, deleted: false } },
        select: {
          id: true,
          name: true,
          slug: true,

          githubAccount: { select: { id: true } },
        },
      })
      .catch((err) => {
        throw new ForbiddenException(errorHandle(err, 'Refresh Token Invalid'));
      });

    const tokens = await this.AUTH_SERVICE.login(user);

    await this.helperSaveRefreshToken(user.id, tokens.refreshToken);

    return { tokens, gitUser: !!user?.githubAccount };
  }

  async helperSaveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.PRISMA.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}
