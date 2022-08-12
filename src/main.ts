import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONFIGURATION_ENVIRONMENT } from './global/@config/configuration.environment';
import { PrismaService } from './global/database/prisma.service';
import { ValidationPipe } from '@nestjs/common';

const CFG = CONFIGURATION_ENVIRONMENT();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ enableDebugMessages: true }));
  await app.listen(CFG.PORT);
  await prismaService.enableShutDownHooks(app);
}
bootstrap();
