import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [VideoController],
  providers: [VideoService, PrismaService],
})
export class VideoModule {}
