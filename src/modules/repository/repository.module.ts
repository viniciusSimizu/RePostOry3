import { Module } from '@nestjs/common';
import { RepositoryService } from './service/repository.service';
import { RepositoryController } from './controller/repository.controller';
import { PrismaService } from '../../global/database/prisma.service';
import { GithubModule } from '../../global/modules/github/github.module';

@Module({
  controllers: [RepositoryController],
  providers: [RepositoryService, PrismaService],
  imports: [GithubModule],
})
export class RepositoryModule {}
