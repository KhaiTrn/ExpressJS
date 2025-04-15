import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideoService {
  constructor(public prisma: PrismaService) {}
  create(createVideoDto: CreateVideoDto) {
    return 'This action adds a new video';
  }

  async getListVideo(req: any, query: any) {
    console.log({ user: req.user });
    let { page, pageSize, type_id, search } = query;
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 10;
    type_id = +type_id > 0 ? +type_id : 0;
    search = search || '';
    console.log({ page, pageSize, type_id, search });
    const whereTypeId = type_id === 0 ? {} : { type_id: type_id };
    const whereSearch =
      search.trim() === '' ? {} : { video_name: { contains: search } };
    const where = {
      ...whereTypeId,
      ...whereSearch,
    };
    // limit 5 offset 5
    const skip = (page - 1) * pageSize;
    const totalItem = await this.prisma.videos.count({
      where: where,
    });
    const totalPage = Math.ceil(totalItem / pageSize);
    const videos = await this.prisma.videos.findMany({
      where: where,
      take: pageSize,
      skip: skip,
      orderBy: {
        created_at: 'desc', // sắp xếp giảm dần đưa ngày mới nhất lên đầu
      },
    });

    return {
      page, // current page
      pageSize, // number of items per pag
      totalItem, // total number of items
      totalPage, // total number of pages
      items: videos || [],
    };
  }

  async videoDetail(id: string) {
    const video = await this.prisma.videos.findUnique({
      where: { video_id: Number(id) },
    });
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    return video;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
