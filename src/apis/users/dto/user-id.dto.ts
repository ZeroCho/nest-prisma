import {ApiProperty} from "@nestjs/swagger";

export class UserIdDto {
  @ApiProperty({
    description: '유저 아이디'
  })
  id: string;
}