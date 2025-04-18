import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TokenCheck } from './modules/auth/token/token-check';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector); // Lấy reflector từ Dependency Injection container
  // Reflector dùng để đọc metadata từ route decorators
  //add middleware Here
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new TokenCheck(reflector)); // Bảo vệ api bằng Passport JWT
  // CORS
  app.enableCors({ origin: ['localhost:5173', 'google.com'] });

  // https://docs.nestjs.com/openapi/introduction
  // npm install --save @nestjs/swagger
  const config = new DocumentBuilder()
    .setTitle('Cyber Media')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

/**
 * Bảo vệ api bằng Passport JWT
 * doc: https://docs.nestjs.com/recipes/passport#implementing-passport-jwt
 *
 * npm i passport-jwt
 * npm i --save-dev @types/passport-jwt
 * npm i @nestjs/passport
 *
 * CheckTokenStrategy => provider của AppModule
 */

/**
 * Một module gồm:
 *  - imports:      Chứa danh sách các module khác cần thiết để module này hoạt động, giúp module có thể sử dụng các provider từ module khác.
 *  - controllers:  Chứa danh sách các controller xử lý các request HTTP gồm các Router (endpoint)
 *  - providers:    Chứa danh sách các service (hoặc các provider khác) khi muốn dùng Dependenci Injection, có thể được inject vào controller hoặc các provider khác. Nestjs sẽ gom các class và new
 *  - exports:      Chứa danh sách các provider mà module này muốn cung cấp cho các module khác sử dụng.
 */

/**
 * Module trong NestJS
 *  - Module phải được khai báo đúng với @Module()
 *  - Ví dụ tạo module UserModule
 *  - controllers: [UsersController], // Chứa các controller xử lý request
 *  - providers: [UsersService],      // Nếu muốn dùng service theo kiểu DI
 *  - exports: [UsersService],        // Nếu muốn cho phép module khác sử dụng UsersService
 *  - Module phải được import vào AppModule
 */

/**
 * Sử dụng service từ module khác (Ví dụ VideoModule muốn dùng UserService)
 *  - Module chứa service (UserModule) phải export service đó (UserService)
 *  - Module cần sử dụng (VideoModule) phải import module chứa service (UserModule)
 *  - Inject service vào nơi cần sử dụng (VideoService)
 *    - constructor(private readonly usersService: UsersService) {}
 *    - this.usersService
 *  -
 */

/**
  * Vòng lặp module
  * Module A cần Module B, nhưng Module B cũng cần Module A
 ----------------------------------------------------------------
 @Module({
   imports: [OrdersModule], // UsersModule cần OrdersModule
   providers: [UsersService],
   exports: [UsersService],
 })
 export class UsersModule {}
 
 @Module({
   imports: [UsersModule], // OrdersModule cũng cần UsersModule
   providers: [OrdersService],
   exports: [OrdersService],
 })
 export class OrdersModule {}
 => Lỗi: Nest cannot resolve dependencies of the ...
 ----------------------------------------------------------------
  * 
  * Sửa lại
 ----------------------------------------------------------------
 @Module({
   imports: [forwardRef(() => OrdersModule)], // Dùng forwardRef để tránh vòng lặp
   providers: [UsersService],
   exports: [UsersService],
 })
 export class UsersModule {}
 
 @Module({
   imports: [forwardRef(() => UsersModule)], // Dùng forwardRef để tránh vòng lặp
   providers: [OrdersService],
   exports: [OrdersService],
 })
 export class OrdersModule {}
 ----------------------------------------------------------------
  * 
  *
  *   Khi sử dụng service từ module bị vòng lặp cần forwardRef(() => OrdersService
  * 
 constructor(
   @Inject(forwardRef(() => OrdersService)) // Inject đúng cách
   private readonly ordersService: OrdersService
 ) {}
 
  */

/**
 * nest g module modules/user
 * nest g controller modules/user --no-spec
 * nest g service modules/user --no-spec
 *
 * tạo 1 lần 3 file với crud : nest g resource modules/user --no-spec
 */
