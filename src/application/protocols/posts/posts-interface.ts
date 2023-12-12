import { Post } from "@domain/post/entities/post";

export interface PostsInterface {
  create(data: Pick<Post, 'authorId' | 'title' | 'content'>): Promise<Post>;
  feed(): Promise<{ posts: Post[], numberPosts: number }>;
  findOne(id: string): Promise<Post | null>;
}
