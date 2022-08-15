import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { PrismaService } from '../../global/database/prisma.service';
import { AuthModule } from '../../global/guards/Auth/auth.module';
import { EncriptyService } from '../../global/helpers/encripty';

@Module({
  providers: [UserService, PrismaService, EncriptyService],
  imports: [AuthModule],
  controllers: [UserController],
})
export class UserModule {}
