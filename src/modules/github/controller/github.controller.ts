import {
  Controller,
  Get,
  Headers,
  Next,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { GithubService } from '../service/github.service';
import { NextFunction, Response } from 'express';

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
      const USER = await this.GITHUB_SERVICE.connectGithubAccount(
        code,
        response.locals.user.userId,
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
        response.locals.user.userId,
      );
      return response.json(repositories);
    } catch (err) {
      next(err);
    }
  }
}
