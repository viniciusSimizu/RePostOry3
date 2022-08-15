import {
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Next,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { GithubService } from '../service/github.service';
import { NextFunction, Request, Response } from 'express';

@Controller('github')
export class GithubController {
  constructor(private readonly GITHUB_SERVICE: GithubService) {}

  @Post('signup/:code')
  async signUpWithGithub(
    @Param('code') code: string,
    @Headers('Authorization') token: string,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      if (!token) {
        throw new ForbiddenException('Bearer Token required');
      }

      const USER = await this.GITHUB_SERVICE.connectGithubAccount(
        code,
        token.split(' ')[1],
      );

      return response.json(USER);
    } catch (err) {
      next(err);
    }
  }

  @Get('list')
  async listUserGithubRepositories(
    @Headers('Authorization') token: string,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const repositories = await this.GITHUB_SERVICE.listRepositories(
        token.split(' ')[1],
      );
      return response.json(repositories);
    } catch (err) {
      next(err);
    }
  }
}
