export interface ISimplexPaymentParams {
  quoteId: any;
  digitalCurrency: string;
  digitalAmount: string;
  fiatCurrency: string;
  fiatAmount: string;
}

export interface IPlacementOrder {
  partner: string;
  paymentFlowType: string;
  paymentId: string;
  version: string;
}
