import { Post } from "@domain/post/entities/post";

export interface FeedUseCaseInterface {
  execute: () => Promise<{ posts: Post[], numberPosts: number }>
}