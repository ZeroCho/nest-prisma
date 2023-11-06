import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: '아이디',
  })
  id: string;

  @ApiProperty({
    description: '닉네임',
  })
  nickname: string;


  @ApiProperty({
    description: '비밀번호',
  })
  password: string;


  @ApiProperty({
    description: '이미지 주소',
  })
  image: string;
}
