export interface CreateCustomerUseCaseContract {
  execute: (params: CreateCustomer.Params) => Promise<CreateCustomer.Result>;
}

export namespace CreateCustomer {
  export type Params = {
    userId: string;
    description: string;
  };

  export type Result = {
    email: string;
    name: string;
    stripe_customer_id: string;
    id: string;
    created_at_stripe: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
