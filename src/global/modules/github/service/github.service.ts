import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { errorHandle } from '../../../helpers/errorHandle';

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

  async connectGithubAccount(code: string, token: string) {
    const userToken = await this.JWT_SERVICE.verifyAsync(token)
      .then((payload) => payload)
      .catch((err) => {
        throw new ForbiddenException({ mensage: 'Token invalid!', error: err });
      });

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
        throw new InternalServerErrorException({
          mensage: 'Github request failed',
          error: err,
        });
      });

    if (!accessToken) {
      throw new InternalServerErrorException({
        mensage: 'Github request failed',
        error: 'Code expired',
      });
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
        where: { githubApiId: githubAccount.id },
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
        userId: userToken.userId,
        username: githubAccount.login,
        accessToken: accessToken,
        avatarUrl: githubAccount.avatar_url,
      },
    });

    return user;
  }

  async listRepositories(token: string) {
    const userToken = await this.JWT_SERVICE.verifyAsync(token)
      .then((payload) => payload.userId)
      .catch((err) => {
        throw new ForbiddenException({ mensage: 'JWT invalid', error: err });
      });

    const user = await this.PRISMA.user.findUnique({
      where: { id: userToken },
      select: { githubAccount: { select: { accessToken: true } } },
    });

    const repositories: any[] = await this.HTTP_SERVICE.axiosRef
      .get(`${this.API_URL}/user/repos`, {
        headers: {
          Authorization: `token ${user.githubAccount.accessToken}`,
          Accept: 'application / vnd.github + json',
        },
      })
      .then((response) => response.data)
      .catch((err) => err);

    return repositories.map((repository) => ({
      id: repository.id,
      name: repository.name,
      description: repository.description,
      url: repository.html_url,
    }));
  }

  async findRepository(githubId: string, repo: string) {
    const user = await this.PRISMA.githubAccount.findUnique({
      where: { id: githubId },
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
      name: repository.name,
      url: repository.html_url,
      description: repository.description,
      githubId,
    };
  }
}
