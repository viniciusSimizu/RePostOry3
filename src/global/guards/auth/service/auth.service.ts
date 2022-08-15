import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidateUserDto } from '../dto/validate-user.dto';
import { EncriptyService } from '../../../helpers/encripty';

@Injectable()
export class AuthService {
  constructor(
    private readonly JWT_SERVICE: JwtService,
    private readonly ENCRIPTY_SERVICE: EncriptyService,
  ) {}

  async validateUser(credentials: ValidateUserDto, user) {
    if (
      !(await this.ENCRIPTY_SERVICE.compare(
        credentials.password,
        user.password,
      ))
    ) {
      throw new UnauthorizedException('Wrong informations');
    }

    return await this.login(user);
  }

  async login(user: any) {
    const payload = {
      userId: user.id,
      githubId: user.githubAccount?.id,
      username: user.name,
      slug: user.slug,
    };
    return {
      access_token: this.JWT_SERVICE.sign(payload),
    };
  }
}
