import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../../../global/database/prisma.service';
import { AuthModule } from '../../../global/guards/Auth/components/auth.module';
import { EncriptifyService } from '../../../global/helpers/encriptify';

@Module({
  providers: [UserService, PrismaService, EncriptifyService],
  imports: [AuthModule],
  controllers: [UserController],
})
export class UserModule {}
