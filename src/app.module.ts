import { Module } from '@nestjs/common';
import { GithubModule } from './global/modules/github/github.module';
import { ConfigModule } from '@nestjs/config';
import { GITHUB_ENVIRONMENT } from './global/@config/github.environment';
import { CONFIGURATION_ENVIRONMENT } from './global/@config/configuration.environment';
import { UserModule } from './modules/user/components/user.module';
import { AuthModule } from './global/guards/Auth/components/auth.module';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { JWT_ENVIRONMENT } from './global/@config/jwt.environment';

const appModules: any[] = [GithubModule, UserModule];

const guardsModules: any[] = [AuthModule];

const controllers: any[] = [];

const providers: any[] = [];

@Module({
  imports: [
    ...appModules,
    ...guardsModules,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        CLIENT_SECRET: Joi.string().length(40).required(),
        CLIENT_ID: Joi.string().length(20).required(),
        DATABASE_URL: Joi.string().required(),
      }),
      isGlobal: true,
      load: [GITHUB_ENVIRONMENT, CONFIGURATION_ENVIRONMENT, JWT_ENVIRONMENT],
    }),
  ],
  controllers: [...controllers],
  providers: [...providers],
  exports: [],
})
export class AppModule {}
