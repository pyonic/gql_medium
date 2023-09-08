import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from '@prisma/client';
import { GqlUser } from 'src/modules/users/dto/user.output';

@ObjectType()
export class PostOutput {
  @Field(() => Int)
  id: Post['id'];

  @Field(() => String)
  title: Post['title'];

  @Field(() => String)
  content: Post['content'];

  @Field(() => Int)
  author_id: Post['author_id'];

  @Field(() => GqlUser)
  author: GqlUser;

  @Field(() => [GqlUser])
  viewers: GqlUser[];
}
