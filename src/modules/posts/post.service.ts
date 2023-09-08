import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostModel } from 'src/config/interfaces';
import { Post, PostView, User } from '@prisma/client';
import { PostInput } from './dto/post.input';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(post: PostInput, user: Partial<User>) {
    const post_data: PostModel = { ...post, author_id: user.id };
    return await this.prisma.post.create({ data: post_data });
  }

  async getPosts(filters: any = {}): Promise<any> {
    const { take = 10, lastCursor } = filters;

    const postsQuery = {
      take: ~~take,
      skip: 1,
      cursor: {
        id: ~~lastCursor,
      },
    };

    if (!lastCursor) {
      postsQuery.skip = 0;
      delete postsQuery.cursor;
    }

    const posts: Post[] = await this.prisma.post.findMany(postsQuery);

    if (posts.length === 0) {
      return {
        data: [],
        metaData: {
          lastCursor: null,
          hasNextPage: false,
        },
      };
    }

    const lastPostInResults: any = posts[posts.length - 1];
    const cursor: number = lastPostInResults.id;

    const nextPage = await this.prisma.post.findMany({
      take: ~~take,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });

    const data = {
      data: posts,
      metaData: {
        lastCursor: cursor,
        hasNextPage: nextPage.length > 0,
      },
    };

    return data;
  }

  async getPostById(id: number, user: Partial<User>): Promise<Post> {
    await this.setPostView(id, user.id);

    return await this.prisma.post.findFirst({
      where: { id },
    });
  }

  async getUserPosts(id: number): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: { author_id: id },
    });
  }

  async getUserPostsGrouped(ids: number[]): Promise<any> {
    const posts: Post[] = await this.prisma.post.findMany({
      where: { author_id: { in: ids } },
    });
    const userPosts = {};

    posts.forEach((post: Post) => {
      if (
        userPosts[post.author_id] &&
        !userPosts[post.author_id].find((p: any) => p.id === post.id)
      ) {
        userPosts[post.author_id].push(post);
      } else {
        userPosts[post.author_id] = [post];
      }
    });

    return userPosts;
  }

  async getPostsByIds(ids: number[]): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: { id: { in: ids } },
    });
  }

  async getMultiplePostViews(ids: number[]): Promise<any> {
    const data: Post[] = await this.prisma.post.findMany({
      where: { id: { in: ids } },
      include: {
        viewers: {
          select: {
            viewer: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    const viewsMap = {};

    data.forEach((d: any) => {
      viewsMap[d.id] = d.viewers.map((d: any) => d.viewer);
    });

    return viewsMap;
  }

  async getMultipleUserViewedPosts(ids: number[]): Promise<any> {
    const views: PostView[] = await this.prisma.postView.findMany({
      where: { viewerId: { in: ids } },
    });

    const viewed_post_ids = views.map((d: PostView) => d.postId);

    const posts: Post[] = await this.prisma.post.findMany({
      where: { id: { in: viewed_post_ids } },
    });

    const user_views_map = {};

    views.forEach((d: PostView) => {
      const post = posts.find((p: Post) => p.id === d.postId);

      if (post) {
        if (user_views_map[d.viewerId]) {
          user_views_map[d.viewerId].push(post);
        } else user_views_map[d.viewerId] = [post];
      }
    });

    return user_views_map;
  }

  async setPostView(postId: number, viewerId: number) {
    const view: PostView = await this.prisma.postView.findFirst({
      where: { postId, viewerId },
    });

    if (!view) {
      await this.prisma.postView.create({
        data: { postId, viewerId },
      });
    }
  }
}
