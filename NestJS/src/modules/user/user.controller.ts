import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import uploadLocal from 'src/common/multer/local.multer';
import { FileInterceptor } from '@nestjs/platform-express';
import uploadCloud from 'src/common/multer/cloud.multer';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';

@Controller('user')
export class UserController {
  constructor(public userService: UserService) {}
  //Dùng để apply middleware — ở đây là FileInterceptor
  @UseInterceptors(FileInterceptor('avatar', uploadLocal))
  // https://docs.nestjs.com/openapi/operations#file-upload
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FileUploadDto,
  })
  @Post(`avatar-local`)
  async avatarLocal(@UploadedFile() file) {
    return await this.userService.avatarLocal(file);
  }

  @UseInterceptors(FileInterceptor('avatar', uploadCloud))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FileUploadDto,
  })
  @Post(`avatar-cloud`)
  async avatarCloud(@UploadedFile() file) {
    return await this.userService.avatarCloud(file);
  }
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
