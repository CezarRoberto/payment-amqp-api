export interface CreatePaymentLinkUseCaseContract {
  execute: (
    params: CreatePaymentlink.Params,
  ) => Promise<CreatePaymentlink.Result>;
}

export namespace CreatePaymentlink {
  export type Params = {
    postId: string;
    currency: string;
    amount: number;
    recurringInterval: string;
  };

  export type Result = {
    url: string;
  };
}
