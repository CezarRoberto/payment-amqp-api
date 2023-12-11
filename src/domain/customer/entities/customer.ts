export interface Customer {
  id: string;
  email: string;
  description?: string;
  userId: string;
  stripe_customer_id: string;
  createdAt: Date;
  updatedAt: Date;
}