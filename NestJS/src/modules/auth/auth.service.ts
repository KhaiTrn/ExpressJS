import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_SECRET,
} from 'src/common/constant/app.constant';
@Injectable()
export class AuthService {
  constructor(
    public prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const { email, pass_word, full_name } = createUserDto;

    const userExists = await this.prisma.users.findFirst({
      where: { email: email },
    });
    if (userExists) {
      throw new BadRequestException(
        `email was already taken, please try again`,
      );
    }
    const hashPassword = bcrypt.hashSync(pass_word, 10);
    const userNew = await this.prisma.users.create({
      data: { email, pass_word: hashPassword, full_name },
      select: {
        user_id: true,
        email: true,
        full_name: true,
        pass_word: true,
      },
    });
    userNew.pass_word = ''; // xóa mật khẩu trước khi trả về cho client
    return userNew;
  }
  async login(createUserDto: CreateUserDto) {
    const { email, pass_word } = createUserDto;
    const userExists = await this.prisma.users.findFirst({
      where: { email: email },
    });
    if (!userExists) {
      throw new BadRequestException(`email is not exist, please register`);
    }

    if (!userExists.pass_word) {
      if (userExists.face_app_id) {
        throw new BadRequestException(
          `Please login with facebook to create a new password`,
        );
      }
      if (userExists.goole_id) {
        throw new BadRequestException(
          `Please login with google to create a new password`,
        );
      }
      throw new BadRequestException(`Invalid, please contact customer care`);
    }
    // so sánh password
    // npm i bcrypt
    // npm i --save-dev @types/bcrypt
    const isPasswordValid = bcrypt.compareSync(pass_word, userExists.pass_word);
    if (!isPasswordValid) {
      throw new BadRequestException(`email or password is incorrect`);
    }
    const tokens = this.createToken(userExists.user_id);
    return tokens;
  }
  //
  createToken(userID: number) {
    if (!userID) {
      throw new BadRequestException(`userID is required`);
    }
    // doc: https://docs.nestjs.com/security/authentication#jwt-token
    // npm install --save @nestjs/jwt
    const accessToken = this.jwt.sign(
      { userID },
      { secret: ACCESS_TOKEN_SECRET, expiresIn: ACCESS_TOKEN_EXPIRED },
    );
    const refreshToken = this.jwt.sign(
      { userID },
      { secret: REFRESH_TOKEN_SECRET, expiresIn: REFRESH_TOKEN_EXPIRED },
    );
    return {
      accessToken,
      refreshToken,
    };
  }
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
