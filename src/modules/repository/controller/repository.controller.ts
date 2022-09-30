import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Res,
  Next,
} from '@nestjs/common';
import { RepositoryService } from '../service/repository.service';
import { NextFunction, Response } from 'express';
import { GithubService } from '../../github/service/github.service';

@Controller('repository')
export class RepositoryController {
  constructor(
    private readonly REPOSITORY_SERVICE: RepositoryService,
    private readonly GITHUB_SERVICE: GithubService,
  ) {}

  @Post('create/:repo')
  async createGithubRepository(
    @Param('repo') repo: string,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const repository = await this.GITHUB_SERVICE.findRepository(
        response.locals.user.githubId,
        repo.toLowerCase(),
      );

      return response.json(await this.REPOSITORY_SERVICE.create(repository));
    } catch (err) {
      next(err);
    }
  }

  @Get('list')
  async findAll(@Res() response: Response, @Next() next: NextFunction) {
    try {
      return response.json(await this.REPOSITORY_SERVICE.findAll());
    } catch (err) {
      next(err);
    }
  }

  @Get('list/user')
  async findCurrentUser(@Res() response: Response, @Next() next: NextFunction) {
    try {
      return response.json(
        await this.REPOSITORY_SERVICE.findByCurrentUser(
          response.locals.user.userId,
        ),
      );
    } catch (err) {
      next(err);
    }
  }

  @Delete('delete/:id')
  async deleteRepository(
    @Param('id') repositoryId: string,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    try {
      return response.json(await this.REPOSITORY_SERVICE.delete(repositoryId));
    } catch (err) {
      next(err);
    }
  }
}
