import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum Roles {
  user,
  admin,
}

registerEnumType(Roles, { name: 'Roles' });

@InputType()
export class RegisterUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => Roles, { nullable: true, defaultValue: Roles.user })
  role: Roles;
}
