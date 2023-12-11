import { Post } from "@domain/post/entities/post";

export interface CreatePostUseCaseInterface {
  execute: (params: CreatePost.Params) => Promise<Post>
}

export namespace CreatePost {
  export type Params = {
    authorId: string;
    title: string;
    content?: string;
  }
}