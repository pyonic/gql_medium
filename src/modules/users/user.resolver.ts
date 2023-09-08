import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { GqlUser } from './dto/user.output';
import { UserQueryInput } from './dto/user-query.input';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { PostOutput } from '../posts/dto/post.output';
import { Post, User } from '@prisma/client';
import { PostService } from '../posts/post.service';
import * as DataLoader from 'dataloader';

@Resolver(() => GqlUser)
export class UserResolver {
  constructor(
    private readonly usersService: UserService,
    private postsService: PostService,
  ) {}

  @Query(() => [GqlUser], { name: 'get_users' })
  @UseGuards(AdminGuard)
  async get_users(
    @Args('limit', { nullable: true, type: () => Int }) limit: number,
    @Args('page', { nullable: true, type: () => Int }) page: number,
  ) {
    return this.usersService.getAll({ limit, page });
  }

  @Query(() => GqlUser, { name: 'get_user_by_id' })
  @UseGuards(AdminGuard)
  async get_user_by_id(@Args('queryInput') queryInput: UserQueryInput) {
    return this.usersService.getUser({ id: queryInput.id });
  }

  @ResolveField('posts', (returns) => [PostOutput])
  async getUserPosts(
    @Parent() author: User,
    @Context('userPostsLoader') userPostsLoader: DataLoader<number, Post>,
  ) {
    return userPostsLoader.load(author.id);
  }

  @ResolveField('viewedPosts', (returns) => [PostOutput])
  async viewedPosts(
    @Parent() author: User,
    @Context('userViewsLoader') userViewsLoader: DataLoader<number, Post>,
  ) {
    return userViewsLoader.load(author.id);
  }
}
