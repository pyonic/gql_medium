import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PostService } from './post.service';
import { PostsResponse } from './dto/posts-response.output';
import { GqlUser } from '../users/dto/user.output';
import { Post, User } from '@prisma/client';
import { PostOutput } from './dto/post.output';
import DataLoader from 'dataloader';
import { PostInput } from './dto/post.input';
import { CurrentUser } from 'src/common/decorators/context.decorator';

@Resolver(() => PostOutput)
export class PostResolver {
  constructor(private readonly postsService: PostService) {}

  @Query(() => PostsResponse, { name: 'get_posts' })
  async get_posts(
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('lastCursor', { type: () => Int, nullable: true }) lastCursor: number,
  ) {
    return this.postsService.getPosts({ take, lastCursor });
  }

  @Query(() => PostOutput, { name: 'get_post_by_id' })
  async get_post_by_id(
    @Args('id', { type: () => Int, nullable: false }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.postsService.getPostById(id, user);
  }

  @Mutation(() => PostOutput, { name: 'create_post' })
  async create_post(
    @Args('createPostInput') createPostInput: PostInput,
    @CurrentUser() user: User,
  ) {
    return this.postsService.createPost(createPostInput, user);
  }

  @ResolveField('viewers', (returns) => [GqlUser])
  async getPostViews(
    @Parent() post: Post,
    @Context('postViewsLoader') postViewsLoader: DataLoader<number, User>,
  ) {
    return postViewsLoader.load(post.id);
  }

  @ResolveField('author', (returns) => GqlUser)
  async getPostAuthor(
    @Parent() post: Post,
    @Context('usersLoader') usersLoader: DataLoader<number, User>,
  ) {
    return usersLoader.load(post.author_id);
  }
}
