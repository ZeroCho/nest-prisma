import {ApiProperty} from "@nestjs/swagger";

export class CountDto {
  @ApiProperty({
    description: '하트 개수'
  })
  Hearts: number;

  @ApiProperty({
    description: '재게시 개수'
  })
  Reposts: number;

  @ApiProperty({
    description: '댓글 개수'
  })
  Comments: number;
}