export interface FindOneCustomerUseCaseContract {
  execute: (params: FindOneCustomer.Params) => Promise<FindOneCustomer.Result>;
}

export namespace FindOneCustomer {
  export type Params = {
    id: string;
  };

  export type Result = {
    email: string;
    stripe_customer_id: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
