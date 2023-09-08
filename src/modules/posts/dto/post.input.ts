import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;
}

@InputType()
export class PostById {
  @Field(() => Int)
  id: number;
}
