import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { VideoModule } from './modules/video/video.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CheckTokenStategy } from './modules/auth/token/token-strategy';
import { VideoTypeModule } from './modules/video-type/video-type.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    VideoModule,
    VideoTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService, CheckTokenStategy],
})
export class AppModule {}
