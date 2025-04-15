import {
  BadGatewayException,
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/is-public.decorator';

@Injectable()
// Để sử dụng passport thì cần phải tạo 1 class kế thừa AuthGuard
// và truyền vào tên của strategy('check-token')
// AuthGuard sẽ tự động gọi hàm validate trong TokenStategy
export class TokenCheck extends AuthGuard('check-token') {
  // sử dụng reflector để lấy được các metadata của class và method
  // trong trường hợp này là lấy được metadata của decorator @Public()
  constructor(private reflector: Reflector) {
    super();
  }
  // ghi đè canACtivate để xử lý logic để khi có isPublic thì đi tiếp
  canActivate(context: ExecutionContext) {
    console.log(`TOKEN - canActivate`);
    // context là 1 object có nhiều thông tin về request, response, và các metadata của class và method
    // lấy được request từ context

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // gọi lại canActivate của AuthGuard để xử lý kiểm tra token sau đó gọi hàm handleRequest
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // hàm handleRequest sẽ luôn luôn chạy cho dù kiểm tra token có đúng hay là sai
    console.log(`TOKEN - handleRequest`);

    console.log({ err, user, info });

    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        throw new ForbiddenException(info.message);
      }
      if (info instanceof JsonWebTokenError) {
        throw new UnauthorizedException(info.message);
      }
      if (info instanceof Error) {
        throw new BadRequestException(info.message);
      }

      throw err || new BadGatewayException();
    }
    return user;
  }
}
