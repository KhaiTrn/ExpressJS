import {
  CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY,
} from "../common/constant/app.constant.js";
import { v2 as cloudinary } from "cloudinary";
import prisma from "../common/prisma/init.prisma.js";
import { BadRequestException } from "../common/helpers/error.helper.js";

export const userService = {
  create: async function (req) {
    return `This action create`;
  },

  findAll: async function (req) {
    return `This action returns all user`;
  },

  findOne: async function (req) {
    return `This action returns a id: ${req.params.id} user`;
  },

  update: async function (req) {
    return `This action updates a id: ${req.params.id} user`;
  },

  remove: async function (req) {
    return `This action removes a id: ${req.params.id} user`;
  },
  uploadLocal: async function (req) {
    console.log({ file: req.file });
    const file = req.file; // file: file được upload lên từ client
    if (!file)
      throw new BadRequestException(
        `Vui lòng gửi hình ảnh qua key file (form-data)`
      );
    const userId = req.user.user_id; // lấy id của user đang đăng nhập
    await prisma.users.update({
      where: { user_id: Number(userId) },
      data: {
        avatar: file.filename, // lưu tên file vào trong database
      },
    });
    return {
      folder: "images/",
      file: file.filename,
      imgURL: `images/${file.path}`,
    }; // trả về tên file đã upload lên
  },
  uploadCloud: async function (req) {
    console.log({ file: req.file });
    const file = req.file; // file: file được upload lên từ client
    if (!file)
      throw new BadRequestException(
        `Vui lòng gửi hình ảnh qua key file (form-data)`
      );
    const userId = req.user.user_id; // lấy id của user đang đăng nhập
    // configuration cloudinary
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_SECRET_KEY,
    });

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload(
          { folder: "images" }, // folder lưu trữ trên cloudinary
          (error, UploadResult) => {
            return resolve(UploadResult); // trả về kết quả upload lên cloudinary
          }
        )
        .end(file.buffer); // file.buffer: lấy dữ liệu của file đã upload lên
    });
    console.log({ uploadResult });
    await prisma.users.update({
      where: { user_id: Number(userId) },
      data: {
        avatar: uploadResult.secure_url, // lưu đường dẫn của hình ảnh vào trong database
      },
    });
    // Để cho FE show được hình cần đổi từ dòng 60 cloud_name: "vulebaolong" => tên `https://res.cloudinary.com/<TÊN CỦA CÁC BẠN>/image/upload/`
    // src/constant/app.constant.ts
    // export const BASE_DOMAIN_CLOUDINARY = `https://res.cloudinary.com/vulebaolong/image/upload/`;
    return {
      folder: uploadResult.folder, // folder lưu trữ trên cloudinary
      filename: file.filename, // tên file đã upload lên cloudinary
      imgURL: uploadResult.secure_url, // đường dẫn của hình ảnh đã upload lên cloudinary
    };
  },
};
