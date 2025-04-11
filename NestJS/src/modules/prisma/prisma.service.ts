import { Global, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// Ịnectable: cho phép class này được sử dụng như một service trong NestJS
@Global() // đánh dấu module này là global, có thể sử dụng ở bất kỳ đâu trong ứng dụng
export class PrismaService extends PrismaClient implements OnModuleInit {
  // khi module khởi tạo, nó sẽ gọi hàm này
  // hàm này sẽ kết nối đến database
  async onModuleInit() {
    await this.$connect();
  }
}
