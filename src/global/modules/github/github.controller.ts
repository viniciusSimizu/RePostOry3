import { Controller, Get, Redirect, Req, Res } from '@nestjs/common';
import { GithubService } from './github.service';
import { Request, Response } from 'express';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('teste/:code')
  async teste(@Req() request: Request, @Res() response: Response) {
    const CREDENTIALS = await this.githubService
      .teste(request.params.code)
      .then((response) => response.data);
    return response.status(200).json(CREDENTIALS);
  }
}
