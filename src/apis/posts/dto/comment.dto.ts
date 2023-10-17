import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({
    description: '컨텐츠',
  })
  content: string;
}
