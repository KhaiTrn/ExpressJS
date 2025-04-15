import { Injectable } from '@nestjs/common';
import { CreateVideoTypeDto } from './dto/create-video-type.dto';
import { UpdateVideoTypeDto } from './dto/update-video-type.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideoTypeService {
  constructor(private prisma: PrismaService) {}
  create(createVideoTypeDto: CreateVideoTypeDto) {
    const videoTypeNew = this.prisma.video_type.create({
      data: {
        type_name: createVideoTypeDto.type_name,
      },
    });
    return videoTypeNew;
  }

  findAll() {
    return `This action returns all videoType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} videoType`;
  }

  update(id: number, updateVideoTypeDto: UpdateVideoTypeDto) {
    return `This action updates a #${id} videoType`;
  }

  remove(id: number) {
    return `This action removes a #${id} videoType`;
  }
}
