export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  views: number;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}