// quản lý token có passport thì mới xử lý tiếp được
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_SECRET } from 'src/common/constant/app.constant';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
// Để sử dụng passport thì cần phải tạo 1 class kế thừa PassportStrategy
// và truyền vào 2 tham số là Strategy và tên của strategy
export class CheckTokenStategy extends PassportStrategy(
  Strategy,
  'check-token',
) {
  constructor(public prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ACCESS_TOKEN_SECRET as string,
    });
  }
  async validate(payload: any) {
    console.log(`token-validate`);
    const user = await this.prisma.users.findUnique({
      where: {
        user_id: payload.userID,
      },
    });

    //  Return cái gì thì nestjs tự động gắn cái ddos vào req
    return user;
  }
}
