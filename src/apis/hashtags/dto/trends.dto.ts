import {ApiProperty} from "@nestjs/swagger";

export class TrendsDto {
  @ApiProperty({
    description: '태그',
  })
  title: string;

  @ApiProperty({
    description: '언급 수',
  })
  count: number;
}