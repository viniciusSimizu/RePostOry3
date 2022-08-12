import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [GithubController],
  imports: [HttpModule],
  providers: [GithubService],
})
export class GithubModule {}
