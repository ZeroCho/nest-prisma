import { PartialType } from '@nestjs/mapped-types';
import { CreateHashtagDto } from './create-hashtag.dto';

export class UpdateHashtagDto extends PartialType(CreateHashtagDto) {}
