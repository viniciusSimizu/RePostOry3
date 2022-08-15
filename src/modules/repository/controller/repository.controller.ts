import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Next,
} from '@nestjs/common';
import { RepositoryService } from '../service/repository.service';
import { CreateRepositoryDto } from '../dto/create-repository.dto';
import { UpdateRepositoryDto } from '../dto/update-repository.dto';
import { NextFunction, Response } from 'express';
import { GithubService } from '../../../global/modules/github/service/github.service';

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
  findAll() {
    return this.REPOSITORY_SERVICE.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.REPOSITORY_SERVICE.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRepositoryDto: UpdateRepositoryDto,
  ) {
    return this.REPOSITORY_SERVICE.update(+id, updateRepositoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.REPOSITORY_SERVICE.remove(+id);
  }
}
