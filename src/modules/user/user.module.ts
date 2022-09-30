import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { PrismaService } from '../../global/database/prisma.service';
import { AuthModule } from '../../global/guards/auth/auth.module';
import { EncriptyService } from '../../global/helpers/encripty';
import { GithubModule } from '../github/github.module';

@Module({
  providers: [UserService, PrismaService, EncriptyService],
  imports: [AuthModule, GithubModule],
  controllers: [UserController],
})
export class UserModule {}
