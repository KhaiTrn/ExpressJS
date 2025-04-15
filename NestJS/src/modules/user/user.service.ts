import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY,
} from 'src/common/constant/app.constant';
import { resolve } from 'path';
import { error } from 'console';
@Injectable()
export class UserService {
  async avatarLocal(file) {
    return `avatar-local`;
  }
  async avatarCloud(file) {
    console.log({ file });
    if (!file) {
      throw new BadRequestException(
        'vui lòng gửi ảnh lên thông qua key file (form-data)',
      );
    }
    // configuration
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_SECRET_KEY,
    });
    const uploadResult: any = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream({ folder: 'images' }, (error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(file.buffer);
    });

    console.log({ uploadResult });
    return {
      folder: uploadResult?.asset_folder,
      filename: uploadResult?.display_name,
      imgUrl: uploadResult?.secure_url,
    };
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
