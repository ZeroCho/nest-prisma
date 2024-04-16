import {ApiProperty} from '@nestjs/swagger';
import {User} from '../../users/entities/user.entity';
import {Image} from "./image.entity";
import {PostUserIdDto} from "../dto/user-id.dto";
import {CountDto} from "../dto/count.dto";

export class Post {
  @ApiProperty({
    description: '아이디',
  })
  postId: number;

  @ApiProperty({
    description: '게시글',
  })
  content: string;

  @ApiProperty({
    description: '작성자 아이디',
  })
  userId: string;

  @ApiProperty({
    description: '작성일',
  })
  createdAt: Date;

  @ApiProperty({
    description: '삭제일',
    required: false,
  })
  deletedAt?: Date;

  @ApiProperty({
    description: '작성자'
  })
  User?: User;

  @ApiProperty({
    description: '이미지 배열',
    isArray: true,
  })
  Images: Image[];

  @ApiProperty({
    description: '내가 하트 눌렀는지(달았으면 내 아이디가 들어 있음)',
    isArray: true,
    type: PostUserIdDto,
  })
  Hearts: PostUserIdDto[]

  @ApiProperty({
    description: '내가 재게시했는지(달았으면 내 아이디가 들어 있음)',
    isArray: true,
    type: PostUserIdDto,
  })
  Reposts: PostUserIdDto[]

  @ApiProperty({
    description: '내가 답글 달았는지(달았으면 내 아이디가 들어 있음)',
    isArray: true,
    type: PostUserIdDto,
  })
  Comments: PostUserIdDto[]

  @ApiProperty({
    description: '하트, 재게시, 답글 수',
    type: CountDto,
  })
  _count: CountDto;

  @ApiProperty({
    description: '답글에 대한 부모',
    type: Post,
  })
  Parent: Post;

  @ApiProperty({
    description: '재게시 원글',
    type: Post,
  })
  Original: Post;
}
