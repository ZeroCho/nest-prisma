import {ApiProperty} from "@nestjs/swagger";

export class CreateMessageDto {
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
}
