import { ApiProperty } from '@nestjs/swagger';
import { Post } from './post.entity';
import { User } from 'src/apis/users/entities/user.entity';

export class Image {
  @ApiProperty({
    description: '아이디',
  })
  imageId: number;

  @ApiProperty({
    description: '링크',
  })
  link: string;

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
  })
  deletedAt?: Date;

  @ApiProperty({
    description: '게시글 아이디',
  })
  postId: string;

  @ApiProperty({
    description: '게시글'
  })
  Post?: Post;

  @ApiProperty({
    description: '작성자'
  })
  User?: User;
}
