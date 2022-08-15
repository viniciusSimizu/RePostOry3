import { Module } from '@nestjs/common';
import { GithubService } from './service/github.service';
import { GithubController } from './controller/github.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../global/database/prisma.service';
import { AuthModule } from '../../global/guards/auth/auth.module';

@Module({
  controllers: [GithubController],
  imports: [HttpModule, AuthModule],
  providers: [GithubService, PrismaService],
  exports: [GithubService],
})
export class GithubModule {}
