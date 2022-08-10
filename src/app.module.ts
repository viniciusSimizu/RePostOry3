import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './global/modules/github/github.module';

@Module({
  imports: [GithubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
