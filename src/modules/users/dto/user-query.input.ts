import { Field, InputType, Int } from '@nestjs/graphql';
import { User } from '@prisma/client';

@InputType()
export class UserQueryInput {
  @Field(() => Int)
  id: User['id'];
}

@InputType()
export class UserPaginationInput {
  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  page: number;
}
