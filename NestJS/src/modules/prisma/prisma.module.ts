import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // xuất ra PrismaService để sử dụng ở các module khác
})
export class PrismaModule {}
