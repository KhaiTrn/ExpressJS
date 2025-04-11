import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { VideoModule } from './modules/video/video.module';
@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PrismaModule, UserModule, VideoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
