import { responseError } from "./response.helper.js";
import jwt from "jsonwebtoken";
// middleware xử lý lỗi
// Nhận lỗi (err) từ các middleware hoặc controller trước đó.
// Gọi responseError để tạo response lỗi chuẩn.
// Trả về JSON lỗi cho client với res.status(resData.code).json(resData);.
// Express tự động nhận diện đây là middleware xử lý lỗi vì có 4 tham số (err, req, res, next).
export const handleError = (err, req, res, next) => {
  console.log({ err });
  // 401: logout
  // 403: refresshToken
  // 2 mã này sẽ do FE và BE tự quy định với nhau
  if (err instanceof jwt.JsonWebTokenError) {
    err.code = 401;
  }

  if (err instanceof jwt.TokenExpiredError) {
    err.code = 403;
  }

  const resData = responseError(err.message, err.code, err.stack);
  res.status(resData.code).json(resData);
};

export class BadRequestException extends Error {
  constructor(message = `BadRequestException`) {
    super(message);
    this.code = 400;
  }
}

export class ForbiddenException extends Error {
  constructor(message = `ForbiddenException`) {
    super(message);
    this.code = 403;
  }
}

export class UnauthorizationException extends Error {
  constructor(message = `UnauthorizationException`) {
    super(message);
    this.code = 401;
  }
}
