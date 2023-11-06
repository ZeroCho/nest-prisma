import {ApiProperty} from "@nestjs/swagger";
import {Post} from "../../posts/entities/post.entity";

export class User {
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

  @ApiProperty({
    description: '게시글들',
    isArray: true,
  })
  Posts?: Post[];
}
