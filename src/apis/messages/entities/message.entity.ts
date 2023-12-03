import {ApiProperty} from "@nestjs/swagger";

export class Message {
  @ApiProperty({
    description: '메시지 아이디',
  })
  messageId: number;

  @ApiProperty({
    description: '내용',
  })
  content: string;

  @ApiProperty({
    description: '전송자 아이디',
  })
  senderId: string;

  @ApiProperty({
    description: '수신자 아이디',
  })
  receiverId: string;

  @ApiProperty({
    description: '방아이디',
  })
  room: string;

  @ApiProperty({
    description: '일시',
  })
  createdAt: Date;
}
