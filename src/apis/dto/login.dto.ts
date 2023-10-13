import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '아이디',
    example: 'zerohch0',
    required: true,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: '비밀번호',
    example: '123123123',
    required: true,
  })
  @IsStrongPassword()
  password: string;
}
