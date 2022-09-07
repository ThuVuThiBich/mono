import { useEffect, useRef, useState } from 'react';

import { parseJson } from '@cross/cookies';
import { useAuthWebSocketHook } from './useAuthWebSocketHook';
import { UserProfile } from './types';

const ORDER_CANCELED = '4';
const ORDER_COMPLETE = '3';

export const useAuthOrders = (
  user: UserProfile | any,
  webSocketURL: string,
  currentSubAccount: string,
  getAuthToken: () => Promise<any>
) => {
  const openOrdersSocket = useRef<any>([]);
  const [openOrdersList, setOpenOrdersList] = useState([]);
  const [loadingOpenOrders, setLoadingOpenOrders] = useState<boolean>(false);

  const { lastMessage, sendMessage } = useAuthWebSocketHook(
    webSocketURL,
    user,
    currentSubAccount,
    getAuthToken
  );

  useEffect(() => {
    if (!lastMessage || lastMessage?.data === "{'ping':''}") return;
    handleSocketMessage(lastMessage);
  }, [lastMessage]);

  // handle socket's message
  const handleSocketMessage = (evt: any) => {
    const convert = parseJson(evt.data);
    if (convert?.channel) {
      switch (convert?.channel) {
        case 'auth-orders':
          if (convert.data) {
            let authOrders: string[] = [...openOrdersSocket.current];
            if (authOrders.length > 0) {
              convert.data.forEach((item: any) => {
                const orderExist = authOrders.find((i) => i[0] === item[0]);
                //case orderExist !== undefined
                if (orderExist !== undefined) {
                  if (item[9] === '3' || item[9] === '4') {
                    //status canceled & complete, remove item from list
                    authOrders = authOrders.filter((i) => i[0] !== item[0]); //if data server stt(3,4) remove item from list
                  } else {
                    let index = 0;
                    authOrders.forEach((i, key) => {
                      if (i[0] === item[0]) {
                        index = key;
                      }
                    });
                    authOrders[index] = item;
                  }
                } else if (
                  !orderExist &&
                  item[9] !== ORDER_CANCELED &&
                  item[9] !== ORDER_COMPLETE
                ) {
                  //case orderExist undefined & stt(!= 3,4)
                  authOrders.unshift(item);
                }
              });
            } else {
              convert.data.forEach((item: any) => {
                if (item[9] !== ORDER_CANCELED && item[9] !== ORDER_COMPLETE) {
                  authOrders.push(item);
                }
              });
            }
            openOrdersSocket.current = authOrders;
            setOpenOrdersList(openOrdersSocket.current);
            setLoadingOpenOrders(false);
          }
          break;
        default:
          break;
      }
    }

    if (convert.event && convert.event === 'loginToken') {
      setLoadingOpenOrders(true);
      const authOrderMsg = `{"event":"subscribe", "channel":"auth-orders","pageSize": 10,"pageIndex": 1}`;
      sendMessage(authOrderMsg);
    }
  };

  return {
    loadingOpenOrders,
    openOrdersList,
  };
};
