import {ApiProperty} from "@nestjs/swagger";

export class CountDto {
  @ApiProperty({
    description: '팔로워 수'
  })
  Followers: number;

  @ApiProperty({
    description: '팔로잉 수'
  })
  Followings: number;
}