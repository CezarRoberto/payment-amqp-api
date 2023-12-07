import { Post } from "../entities/post";

export interface FeedUseCaseInterface {
  execute: () => Promise<{ posts: Post[], numberPosts: number }>
}