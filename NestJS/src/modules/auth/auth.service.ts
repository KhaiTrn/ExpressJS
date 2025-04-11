import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(public prisma: PrismaService) {}
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
      throw new BadRequestException(`email or password is incorrect`);
    }

    if (!userExists.pass_word) {
      if (userExists.face_app_id) {
        throw new BadRequestException(
          `Vui lòng đăng nhập bằng facebook, để tạo mật khẩu mới`,
        );
      }
      if (userExists.goole_id) {
        throw new BadRequestException(
          `Vui lòng đăng nhập bằng google, để tạo mật khẩu mới`,
        );
      }
      throw new BadRequestException(
        `Không hợp lệ, vui lòng liện hệ chăm sóc khách hàng`,
      );
    }
    // so sánh password
    const isPasswordValid = bcrypt.compareSync(pass_word, userExists.pass_word);
    if (!isPasswordValid) {
      throw new BadRequestException(`email or password is incorrect`);
    }
    return 'This action adds a new auth';
  }
  //
  createToken(userID: number) {
    if (!userID) {
      throw new BadRequestException(`userID is required`);
    }

    return 'This action adds a new auth';
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
