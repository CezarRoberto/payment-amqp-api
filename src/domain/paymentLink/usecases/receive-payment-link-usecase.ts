export interface ReceivePaymentEventsUseCaseContract {
  execute: (data: 'string' | Buffer, signatureHeader: string) => Promise<void>;
}
