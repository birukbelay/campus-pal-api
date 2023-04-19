import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { UsersModule } from './features/users/users.module';
import { DatabaseModule } from './providers/database/databaseModule';
import { AuthModule } from './features/auth/auth.module';
import { ArticleModule } from './features/articles/article.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, ArticleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
