import express from "express";
import videoRouter from "./video.router.js";
import carRouter from "./car.router.js";
import authRouter from "./auth.router.js";
import roleRouter from "./role.router.js";
import permissionRouter from "./permission.router.js";
import swaggerDocument from "../common/swagger/init.swagger.js";
import swaggerUi from "swagger-ui-express";
import chatRouter from "./chat.router.js";
import userRouter from "./user.router.js";
const rootRouter = express.Router();

rootRouter.use("/", swaggerUi.serve);
rootRouter.get(
  "/",
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: { persistAuthorization: true },
  })
); // persistAuthorization : lưu giữ token sau mỗi lần tải lại trang

// rootRouter.get(`/`, (request, response, next) => {
//   response.json(`ok`);
// });

rootRouter.use("/video", videoRouter);
rootRouter.use(`/car`, carRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use(`/role`, roleRouter);
rootRouter.use(`/permission`, permissionRouter);
rootRouter.use(`/chat`, chatRouter);
rootRouter.use(`/user`, userRouter);
export default rootRouter;
