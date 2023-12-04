import { Post } from "@domain/post/entities/post";
import { User } from "../entities/user";

export interface UsersInterface {
  create(data: Pick<User, 'email' | 'name'>): Promise<User>
  delete(id: string): Promise<void>
  deleteMany(id: string): Promise<void>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  update(id: string, data: Partial<User>): Promise<User>
  listPosts(id: string): Promise<User & { posts: Post[] } | null>
}