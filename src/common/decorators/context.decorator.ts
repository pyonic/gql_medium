import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((data, req) => {
  const ctx = GqlExecutionContext.create(req);
  const request = ctx.getContext().request;
  return request.user;
});
