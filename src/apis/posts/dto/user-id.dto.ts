import {ApiProperty} from "@nestjs/swagger";

export class PostUserIdDto {
  @ApiProperty({
    description: '유저 아이디'
  })
  userId: string;
}