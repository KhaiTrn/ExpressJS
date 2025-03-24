import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  // Authorization: Bearer <accessToken>
  // split(" ")[1] giúp lấy token sau "Bearer ".
  const accessToken = req.headers.authorization.split(" ")[1];
  // ACCESS_TOKEN_SECRECT là chuỗi set cứng -> process.env.ACCESSTOKEN_SECRECT
  const decode = jwt.verify(accessToken, `ACCESS_TOKEN_SECRET`);

  console.log({ decode });

  next();
};
