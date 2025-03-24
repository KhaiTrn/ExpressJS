import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constant/app.constant.js";
import { UnauthorizationException } from "../helpers/error.helper.js";
import prisma from "../prisma/init.prisma.js";
export const protect = async (req, res, next) => {
  try {
    // Authorization: Bearer <accessToken>
    // split(" ")[1] giúp lấy token sau "Bearer ".
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      throw new UnauthorizationException(
        "Vui lòng cung cấp token để tiếp tục sử dụng"
      );
    }
    // ACCESS_TOKEN_SECRECT là chuỗi set cứng -> process.env.ACCESSTOKEN_SECRECT
    const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    console.log({ decode });
    const user = await prisma.users.findUnique({
      where: {
        user_id: decode.userId,
      },
    });
    // Lưu thông tin user vào req.user để các middleware hoặc controller sau có thể dùng.
    req.user = user;
    // next() gọi nhiều lần quá nên sẽ gây lỗi
    // next();
  } catch (error) {
    next(error);
  }

  next();
};
