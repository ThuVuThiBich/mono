import { authRequest } from 'api/axios';
import { ISimplexPaymentParams, IPlacementOrder } from './types';

export const placePaymentOrderRequest = async (params: ISimplexPaymentParams): Promise<IPlacementOrder> => {
  const { data } = await authRequest({
    method: 'POST',
    url: '/payment/s/place/order',
    data: params,
  });

  return data;
};

export const confirmPaymentOrderRequest = async (params: { paymentId: string }): Promise<any> => {
  const { data } = await authRequest({
    method: 'POST',
    url: '/payment/monthly_amount',
    data: params,
  });

  return data;
};
