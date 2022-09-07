import { useTickerData } from '@cross/context';
import { useEffect, useRef, useState } from 'react';
import { ITickerSocket } from './types';

export const useTicker = () => {
  const listValue = useRef<ITickerSocket[]>([]);
  const [listPairValue, setListPairValue] = useState<ITickerSocket[]>([]);
  
  const lastMessage = useTickerData();

  useEffect(() => {
    if (!lastMessage) return;
    handleSocketMessage(lastMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  // handle socket's message
  const handleSocketMessage = (convert: any) => {
    if (convert?.channel) {
      switch (convert?.channel) {
        case 'ticker':
          const index = listValue.current.findIndex((i: any) => i.pair === convert.pair);
          const pairData = convert.data;
          pairData.pair = convert.pair;

          const listData = [...listValue.current];

          if (index !== -1) {
            listData[index] = pairData;
            listValue.current = listData;
          } else {
            listValue.current = [...listValue.current, pairData];
          }
          setListPairValue(listValue.current);
          break;
        default:
          break;
      }
    }
  };

  return {
    listPairValue,
  };
};
