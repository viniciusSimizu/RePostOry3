import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../global/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { errorHandle } from '../../../global/helpers/errorHandle';

@Injectable()
export class GithubService {
  private readonly GITHUB_URL = 'https://github.com';
  private readonly API_URL = 'https://api.github.com';

  constructor(
    private readonly GITHUB: ConfigService,
    private readonly HTTP_SERVICE: HttpService,
    private readonly JWT_SERVICE: JwtService,
    private readonly PRISMA: PrismaService,
  ) {}

  async connectGithubAccount(code: string, userId: string) {
    const accessToken = await this.HTTP_SERVICE.axiosRef
      .post(
        `${this.GITHUB_URL}/login/oauth/access_token`,
        {
          client_id: this.GITHUB.get('CLIENT_ID'),
          client_secret: this.GITHUB.get('CLIENT_SECRET'),
          code,
        },
        {
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With',
          },
          withCredentials: false,
        },
      )
      .then((response) => response.data.access_token)
      .catch((err) => {
        throw new InternalServerErrorException(
          errorHandle(err, 'Github request failed'),
        );
      });

    if (!accessToken) {
      throw new BadRequestException(
        errorHandle(new Error('Code invalid'), 'Github request failed'),
      );
    }

    const githubAccount = await this.HTTP_SERVICE.axiosRef
      .get('https://api.github.com/user', {
        headers: { Authorization: `token ${accessToken}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        throw new InternalServerErrorException({
          mensage: 'GitHub Request Failed',
          error: err,
        });
      });

    if (
      await this.PRISMA.githubAccount.findFirst({
        where: {
          githubApiId: githubAccount.id,
          deleted: false,
          user: { deleted: false },
        },
      })
    ) {
      throw new InternalServerErrorException(
        'Github account already registered',
      );
    }

    const user = await this.PRISMA.githubAccount.create({
      data: {
        githubApiId: githubAccount.id,
        urlAccount: githubAccount.html_url,
        username: githubAccount.login,
        avatarUrl: githubAccount.avatar_url,
        accessToken,
        userId,
      },
    });

    return user;
  }

  async listRepositories(userId: string) {
    const user = await this.PRISMA.user.findFirst({
      where: {
        AND: {
          id: userId,
          githubAccount: { isNot: null },
        },
      },
      select: { githubAccount: { select: { accessToken: true } } },
    });

    if (!user) {
      throw new ForbiddenException('Github account not linked');
    }

    const userRepoIds = await this.PRISMA.repository
      .findMany({
        where: {
          githubAccount: {
            user: {
              id: userId,
            },
          },
        },
        select: {
          githubApiId: true,
        },
      })
      .then((repos) => repos.map((repo) => repo.githubApiId));

    const repositories: any[] = await this.HTTP_SERVICE.axiosRef
      .get(`${this.API_URL}/user/repos`, {
        headers: {
          Authorization: `token ${user.githubAccount.accessToken}`,
          Accept: 'application / vnd.github + json',
        },
      })
      .then((response) =>
        response.data.map((repo) => {
          repo['alreadyAdded'] = userRepoIds.includes(repo.id);

          return repo;
        }),
      )
      .catch((err) => {
        throw new InternalServerErrorException(
          errorHandle(err, 'Github Request Failed'),
        );
      });

    return repositories.map((repository) => ({
      apiId: repository.id,
      repoName: repository.name,
      description: repository.description,
      url: repository.html_url,
      alreadyAdded: repository.alreadyAdded,
      githubAccount: {
        username: repository.login,
        avatarUrl: repository.avatar_url,
      },
    }));
  }

  async findRepository(githubId: string, repo: string) {
    const user = await this.PRISMA.githubAccount.findFirst({
      where: { id: githubId, deleted: false, user: { deleted: false } },
      select: { username: true, accessToken: true },
    });

    const repository = await this.HTTP_SERVICE.axiosRef
      .get(`${this.API_URL}/repos/${user.username.toLowerCase()}/${repo}`, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${user.accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch((err) => {
        throw new InternalServerErrorException(
          errorHandle(err, 'Github request failed'),
        );
      });

    return {
      githubApiId: repository.id,
      repoName: repository.name,
      url: repository.html_url,
      description: repository.description,
      githubId,
    };
  }
}
