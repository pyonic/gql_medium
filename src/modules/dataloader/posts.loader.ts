import { Post } from '@prisma/client';
import * as DataLoader from 'dataloader';
import { PostService } from '../posts/post.service';
import { mapObjectById } from 'src/common/utils';

const userPostsLoader = async (postsService: PostService) => {
  return new DataLoader<number, Post>(
    async (ids: Array<number>): Promise<any> => {
      const posts = await postsService.getUserPostsGrouped(ids);
      return ids.map((id) => posts[id] || []);
    },
  );
};

const postsLoader = async (postsService: PostService) => {
  return new DataLoader<number, Post>(
    async (ids: Array<number>): Promise<any> => {
      const posts = await postsService.getPostsByIds(ids);
      const postMap = mapObjectById(posts);
      return ids.map((id) => postMap[id] || null);
    },
  );
};

export { userPostsLoader, postsLoader };
