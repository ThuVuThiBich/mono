import { parseJson } from '@cross/cookies';
import { createContext, FC, useContext, useEffect, useMemo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const NUMBER_OF_ORDER_BOOK = 16;

export interface UserProfile {
  email?: string | null;
  email_verified?: boolean | null;
  name?: string | null;
  nickname?: string | null;
  picture?: string | null;
  sub?: string | null;
  updated_at?: string | null;
  org_id?: string | null;
  [key: string]: unknown; // Any custom claim which could be in the profile
}
// interface IExchangeWebsocket {
//   trades: any;
//   ticker: any;
//   depth: any;
// }

// const ExchangeWebsocketContext = createContext<IExchangeWebsocket>({
//   trades: undefined,
//   ticker: undefined,
//   depth: undefined,
// });

const TradeWebsocketContext = createContext<any>(undefined);
const DepthWebsocketContext = createContext<any>(undefined);
const TickerWebsocketContext = createContext<any>(undefined);
const WalletWebsocketContext = createContext<any>(undefined);

interface Props {
  pair: string;
  prePair: string;
  pairList?: any;
  webSocketURL: string;
  user: any;
  currentSubAccount: string;
  getAuthToken: () => Promise<any>;
}

const ExchangeWebsocketProvider: FC<Props> = ({
  children,
  pairList,
  pair,
  prePair,
  webSocketURL,
  user,
  currentSubAccount,
  getAuthToken,
}) => {
  const { readyState, sendMessage, lastMessage } = useWebSocket(webSocketURL, {
    shouldReconnect: () => true,
    reconnectAttempts: 20,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (readyState === ReadyState.OPEN && !!user) {
      (async () => {
        const authTokenResponse = await getAuthToken();
        if (authTokenResponse['auth-token']) {
          const authTokenMsg = `{"event":"loginToken", "token":"${authTokenResponse['auth-token']}"}`;
          sendMessage(authTokenMsg);
        }
      })();
    }
  }, [readyState, user, currentSubAccount, getAuthToken, sendMessage]);

  // subscribe channel when rocket ready
  useEffect(() => {
    if (readyState === ReadyState.OPEN && pairList) {
      pairList.forEach((pair: any) => {
        const msg = `{"event":"subscribe", "channel":"ticker","pair":"${pair[0]}"}`;
        sendMessage(msg);
      });
    }
  }, [readyState, pairList, sendMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && pair) {
      const tradesMsg = `{"event":"subscribe", "channel":"trades","pair":"${pair}","last":100}`;
      sendMessage(tradesMsg);
      const depthMsg = `{"event":"subscribe", "channel":"depth","pair":"${pair}","prec":0,"depth": ${NUMBER_OF_ORDER_BOOK}}`;
      sendMessage(depthMsg);
    }
  }, [readyState, pair, sendMessage]);

  useEffect(() => {
    if (!lastMessage || lastMessage?.data === "{'ping':''}") return;
    const message = parseJson(lastMessage.data);
    if (readyState === ReadyState.OPEN && message?.event === 'loginToken') {
      const authWalletMsg = `{"event":"subscribe", "channel":"auth-wallet"}`;
      sendMessage(authWalletMsg);
    }
  }, [readyState, pair, sendMessage, lastMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && pair && prePair && pair !== prePair) {
      // const depthMsg = `{"event":"cancel_subscribe", "channel":"depth","pair":"${prePair}"`;
      // sendMessage(depthMsg);
      // const tradesMsg = `{"event":"cancel_subscribe", "channel":"trades","pair":"${prePair}"`;
      // sendMessage(tradesMsg);
    }
  }, [pair, prePair, readyState, sendMessage]);

  const lastMessageFilter = useMemo(() => {
    if (!lastMessage || lastMessage?.data === "{'ping':''}") {
      return {
        trades: undefined,
        ticker: undefined,
        depth: undefined,
        wallet: undefined,
      };
    }

    const convert = parseJson(lastMessage.data);

    return {
      trades: convert.channel === 'trades' ? convert : undefined,
      ticker: convert.channel === 'ticker' ? convert : undefined,
      depth: convert.channel === 'depth' ? convert : undefined,
      wallet: convert.channel === 'auth-wallet' ? convert : undefined,
    };
  }, [lastMessage]);

  return (
    <TickerWebsocketContext.Provider value={lastMessageFilter.ticker}>
      <TradeWebsocketContext.Provider value={lastMessageFilter.trades}>
        <DepthWebsocketContext.Provider value={lastMessageFilter.depth}>
          <WalletWebsocketContext.Provider value={lastMessageFilter.wallet}>{children}</WalletWebsocketContext.Provider>
        </DepthWebsocketContext.Provider>
      </TradeWebsocketContext.Provider>
    </TickerWebsocketContext.Provider>
  );
};

export default ExchangeWebsocketProvider;

export const useTradeData = () => useContext(TradeWebsocketContext);
export const useTickerData = () => useContext(TickerWebsocketContext);
export const useDepthData = () => useContext(DepthWebsocketContext);
export const useWalletData = () => useContext(WalletWebsocketContext);
