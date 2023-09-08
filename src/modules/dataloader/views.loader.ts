import { Post } from '@prisma/client';
import * as DataLoader from 'dataloader';
import { PostService } from '../posts/post.service';

const postViewsLoader = async (postsService: PostService) => {
  return new DataLoader<number, Post>(async (ids: Array<number>) => {
    const views = await postsService.getMultiplePostViews(ids);
    return ids.map((id) => views[id] || null);
  });
};

const userViewsLoader = async (postsService: PostService) => {
  return new DataLoader<number, Post>(async (ids: Array<number>) => {
    const views = await postsService.getMultipleUserViewedPosts(ids);
    return ids.map((id) => views[id] || []);
  });
};

export { postViewsLoader, userViewsLoader };
