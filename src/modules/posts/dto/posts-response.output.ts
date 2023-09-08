import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PostOutput } from './post.output';

@ObjectType()
export class PaginationMetaData {
  @Field(() => Int, { nullable: true })
  lastCursor: number;

  @Field(() => Boolean)
  hasNextPage: boolean;
}

@ObjectType()
export class PostsResponse {
  @Field(() => [PostOutput])
  data: PostOutput[];

  @Field()
  metaData: PaginationMetaData;
}
