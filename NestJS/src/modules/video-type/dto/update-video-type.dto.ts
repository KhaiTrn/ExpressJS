import { PartialType } from '@nestjs/swagger';
import { CreateVideoTypeDto } from './create-video-type.dto';

export class UpdateVideoTypeDto extends PartialType(CreateVideoTypeDto) {}
