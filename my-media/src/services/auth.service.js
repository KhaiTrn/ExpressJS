import prisma from "../common/prisma/init.prisma.js";
import { BadRequestException } from "../common/helpers/error.helper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_SECRET,
} from "../common/constant/app.constant.js";
const authService = {
  //api
  register: async (req) => {
    // Bước 1: nhận dữ liệu: full_name, email, pass_word
    const { full_name, email, pass_word } = req.body;
    console.log({ full_name, email, pass_word });
    const userExists = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    console.log({ userExists });
    if (userExists) {
      throw new BadRequestException(`Tài khoản đã tồn tại, Vui lòng đăng nhập`);
    }
    // mã hoá password
    const passHash = bcrypt.hashSync(pass_word, 10);
    // Bước 3: tạo người dùng mới
    const userNew = await prisma.users.create({
      data: {
        email: email,
        full_name: full_name,
        pass_word: passHash,
      },
    });

    // xoá password khi trả về
    delete userNew.pass_word;

    // Bước 4: trả kết quả thành công
    return userNew;
  },
  login: async (req) => {
    const { email, pass_word } = req.body;
    console.log({ email, pass_word });

    const userExists = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      throw new BadRequestException(`Tài khoản chưa tồn tại, Vui lòng đăng ký`);
    }

    // so sánh password
    const isPassword = bcrypt.compareSync(pass_word, userExists.pass_word);
    if (!isPassword) {
      throw new BadRequestException(`Mật khẩu không chính xác`);
    }
    const accessToken = authService.createTokens(userExists.user_id);
    return {
      accessToken: accessToken,
      refreshToken: `456`,
    };
  },
  createTokens: (userId) => {
    if (!userId) throw new BadRequestException(`Khoong có userId để tạo token`);
    // token chỉ tồn tại được trong 10s
    const accessToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRED,
    });
    return accessToken;
  },
};
export default authService;
