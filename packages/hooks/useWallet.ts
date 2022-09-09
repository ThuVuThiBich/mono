import { useWalletData } from '@cross/context/ExchangeWebsocket';
import { useEffect, useState } from 'react';
import { TWallet } from './types';

export const useWallet = () => {
  const [authWallet, setAuthWallet] = useState<TWallet>({
    free: {},
    freezed: {},
    borrow: {},
  });
  const lastMessage = useWalletData();

  useEffect(() => {
    if (!lastMessage) {
      setAuthWallet({
        free: {},
        freezed: {},
        borrow: {},
      });
      return;
    }

    setAuthWallet(lastMessage.data);
  }, [lastMessage]);

  return {
    authWallet,
    walletFree: authWallet.free,
    walletBorrow: authWallet.borrow,
    walletFreezed: authWallet.freezed,
  };
};
