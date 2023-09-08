import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { Roles } from 'src/modules/auth/dto/register-user.input';
import { PostOutput } from 'src/modules/posts/dto/post.output';

@ObjectType()
export class GqlUser {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  role: string;

  @Field(() => [PostOutput])
  posts: PostOutput[];
}
