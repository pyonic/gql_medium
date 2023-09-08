import { Role } from '@prisma/client';

interface IUser {
  id?: number;
  name: string;
  email: string; // unique
  password: string;
  role: Role;
  posts?: IPost[];
  viewedPosts?: IPost[];
}

interface IPost {
  id?: number;
  title: string;
  content: string;
  author?: IUser;
  viewers?: IPostView[];
}

interface IPostView {
  id?: number;
  viewerId?: number;
  postId?: number;
}

interface PostModel {
  title: string;
  content: string;
  author_id: number;
}

export { IUser, IPost, PostModel, IPostView };
