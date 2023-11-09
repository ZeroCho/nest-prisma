import {ApiProperty} from "@nestjs/swagger";
import {Post} from "../../posts/entities/post.entity";
import {UserIdDto} from "../dto/user-id.dto";
import {CountDto} from "../dto/count.dto";

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
    required: false,
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

  @ApiProperty({
    description: '내가 팔로우 했는지(달았으면 내 아이디가 들어 있음)',
    isArray: true,
    type: UserIdDto,
  })
  Followers: UserIdDto[]

  @ApiProperty({
    description: '하트, 재게시, 답글 수',
    type: CountDto,
  })
  _count: CountDto;
}
