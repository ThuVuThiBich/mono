import { useEffect, useState } from 'react';

import { parseJson } from '@cross/cookies';
import { TWallet, UserProfile } from './types';
import { useAuthWebSocketHook } from './useAuthWebSocketHook';

export const useAuthWallet = (
  user: UserProfile,
  webSocketURL: string,
  currentSubAccount: string,
  getAuthToken: () => Promise<any>
) => {
  const [authWallet, setAuthWallet] = useState<TWallet>({
    free: {},
    freezed: {},
    borrow: {},
  });

  const { lastMessage, sendMessage } = useAuthWebSocketHook(
    webSocketURL,
    user,
    currentSubAccount,
    getAuthToken
  );

  useEffect(() => {
    if (!lastMessage || lastMessage?.data === "{'ping':''}") return;
    const message = parseJson(lastMessage.data);

    if (message && message.channel) {
      switch (message.channel) {
        case 'auth-wallet':
          setAuthWallet(message.data);
          break;
        default:
          break;
      }
    }

    if (message?.event === 'loginToken') {
      const authWalletMsg = `{"event":"subscribe", "channel":"auth-wallet"}`;
      sendMessage(authWalletMsg);
    }
  }, [lastMessage, sendMessage]);

  return {
    authWallet,
    walletFree: authWallet.free,
    walletBorrow: authWallet.borrow,
    walletFreezed: authWallet.freezed,
  };
};
