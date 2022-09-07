import { useCallback, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { getCurrentPair } from 'store/ducks/system/slice';
import { useAppSelector } from './reduxHook';

const useRefetchMaxBorrow = () => {
  const currentPair = useAppSelector(getCurrentPair);
  const queryClient = useQueryClient();
  const coin = useMemo(() => currentPair?.split('_')[0], [currentPair]);
  const moneyCoin = useMemo(() => currentPair?.split('_')[1], [currentPair]);

  const refetch = useCallback(() => {
    const keyCoin = ['/margin/max-borrowable', { pairName: currentPair, coinType: coin }];
    const keyMoneyCoin = ['/margin/max-borrowable', { pairName: currentPair, coinType: moneyCoin }];

    queryClient.invalidateQueries(keyCoin);
    queryClient.invalidateQueries(keyMoneyCoin);
  }, [currentPair, , coin, moneyCoin]);

  return { currentPair, coin, moneyCoin, refetch };
};

export default useRefetchMaxBorrow;
