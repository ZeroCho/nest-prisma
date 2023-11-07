import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class LoginResponseDto {
  @ApiProperty({
    description: '아이디',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: '닉네임',
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    description: '이미지 주소',
  })
  @IsString()
  image: string;
}
