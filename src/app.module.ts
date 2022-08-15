import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GithubModule } from './global/modules/github/github.module';
import { ConfigModule } from '@nestjs/config';
import { GITHUB_ENVIRONMENT } from './global/@config/github.environment';
import { CONFIGURATION_ENVIRONMENT } from './global/@config/configuration.environment';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './global/guards/Auth/auth.module';
import * as Joi from 'joi';
import { JWT_ENVIRONMENT } from './global/@config/jwt.environment';
import { JwtValidateMiddleware } from './global/middlewares/jwtValidate.middleware';
import { GithubController } from './global/modules/github/controller/github.controller';
import { UserController } from './modules/user/controller/user.controller';
import { RepositoryModule } from './modules/repository/repository.module';
import { RepositoryController } from './modules/repository/controller/repository.controller';

const appModules: any[] = [GithubModule, UserModule, RepositoryModule];

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtValidateMiddleware)
      .exclude({ path: 'user/sign([a-z]{2})', method: RequestMethod.POST })
      .forRoutes(GithubController, UserController, RepositoryController);
  }
}
