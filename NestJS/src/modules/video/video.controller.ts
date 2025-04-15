import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
  Req,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('video-create')
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }

  @Get(`video-list`)
  @ApiBearerAuth()
  async getListVideo(
    @Query() query: any,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Req() req: Request,
  ) {
    // console.log({ query });
    // console.log({ page, pageSize });
    const result = await this.videoService.getListVideo(req, query);
    return result;
  }

  @Get('video-detail/:id')
  async videoDetail(
    @Param() param: any,
    @Param('id') id: string,
    @Headers() headers: any,
  ) {
    // console.log({ param, id });
    console.log({ headers });

    return this.videoService.videoDetail(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
