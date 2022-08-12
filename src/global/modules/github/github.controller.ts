import { Controller, Get, Redirect, Req, Res } from '@nestjs/common';
import { GithubService } from './github.service';
import { Request, Response } from 'express';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('signup/:code')
  async signUpWithGithub(@Req() request: Request) {
    const CREDENTIALS = await this.githubService
      .execute(request.params.code)
      .then((response) => response.data);
    return CREDENTIALS;
  }
}
