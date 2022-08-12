import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../global/database/prisma.service';
import { CreateUserDTO } from '../DTOs/createUserDTO';
import { AuthService } from '../../../global/guards/Auth/components/auth.service';
import { IValidateUser } from '../../../global/guards/Auth/DTOs/IValidateUser';
import { EncriptifyService } from '../../../global/helpers/encriptify';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly encriptifyService: EncriptifyService,
  ) {}

  async createUser(user: CreateUserDTO) {
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        password: await this.encriptifyService.hash(user.password),
      },
    });
    return await this.authService.login(newUser);
  }

  async loginUser(credentials: IValidateUser) {
    const user = await this.prisma.user.findFirst({
      where: { name: credentials.username, deleted: false },
      select: { id: true, name: true, password: true },
    });
    return await this.authService.validateUser(credentials, user);
  }
}
