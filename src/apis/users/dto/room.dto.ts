import {ApiProperty} from "@nestjs/swagger";
import {User} from "../entities/user.entity";

export class RoomDto {
  @ApiProperty({
    description: '수신자'
  })
  Receiver: User;

  @ApiProperty({
    description: '전송자'
  })
  Sender: User;

  @ApiProperty({
    description: '방 아이디'
  })
  room: string;

  @ApiProperty({
    description: '마지막 메시지'
  })
  content: string;

  @ApiProperty({
    description: '마지막 전송 시간'
  })
  createdAt: Date;
}