import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IValidateUser } from '../DTOs/IValidateUser';
import { EncriptifyService } from '../../../helpers/encriptify';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly encriptyService: EncriptifyService,
  ) {}

  async validateUser(credentials: IValidateUser, user) {
    if (
      !(await this.encriptyService.compare(credentials.password, user.password))
    ) {
      throw new UnauthorizedException('Wrong informations');
    }

    return await this.login(user);
  }

  async login(user: any) {
    const payload = {
      userId: user.id,
      username: user.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
