import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidateUserDto } from '../dto/validate-user.dto';
import { EncriptyService } from '../../../helpers/encripty';
import { errorHandle } from '../../../helpers/errorHandle';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly JWT: ConfigService,
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

  async login(
    user: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      userId: user.id,
      githubId: user.githubAccount?.id,
      username: user.name,
      slug: user.slug,
    };
    const accessToken = this.JWT_SERVICE.sign(payload);
    const refreshToken = this.JWT_SERVICE.sign(
      { refreshUserId: payload.userId },
      { expiresIn: this.JWT.get('refreshTokenExpiresIn') },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyToken(token: string) {
    return this.JWT_SERVICE.verifyAsync(token)
      .then((user) => user.userId)
      .catch((err) => {
        throw new ForbiddenException(errorHandle(err, 'Token invalid'));
      });
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.JWT_SERVICE.verifyAsync(refreshToken).catch(
      (err) => {
        throw new ForbiddenException(errorHandle(err, 'Refresh Token invalid'));
      },
    );

    return payload.refreshUserId;
  }
}
