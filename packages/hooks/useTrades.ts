import { useEffect, useRef, useState } from "react";

import { parseJson } from "@cross/cookies";
import { useTradeData } from "@cross/context";

interface ITradesData {
  history: any[];
  lastPrice: number;
  lastPriceType: 1 | 2 | 3;
}

export const useTrades = (currentPair: string) => {
  const oldTradesPair = useRef<any>(null);
  const [loadingTradesData, setLoadingTradesData] = useState<boolean>(false);
  const [tradesData, setTradesData] = useState<ITradesData>({
    history: [],
    lastPrice: 0,
    lastPriceType: 1, // 1: not change, 2: increment, 3: decrement
  });
  const lastMessage = useTradeData();

  useEffect(() => {
    if (!lastMessage) return;
    handleSocketMessage(lastMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  // handle socket's message
  const handleSocketMessage = (convert: any) => {
    if (convert?.channel) {
      switch (convert?.channel) {
        case "trades":
          if (convert.pair !== currentPair) {
            break;
          }

          let history = [...tradesData.history];

          if (
            history.length === 0 ||
            (oldTradesPair && oldTradesPair.current !== currentPair)
          ) {
            history = convert.data;
          } else {
            convert.data.forEach((item: any) => {
              history.unshift(item);
            });

            history = Array.from(
              new Set(history.map((v: any) => JSON.stringify(v)))
            )
              .map((v: any) => parseJson(v))
              .sort(function (a, b) {
                return b[3] - a[3];
              });

            if (history.length > 50) {
              history.splice(50, history.length - 50);
            }
          }

          let lastPrice = 0;
          let lastPriceType: 1 | 2 | 3 = 1;
          if (history.length > 0) {
            lastPrice = history[0][1];
            if (history.length > 1) {
              if (parseFloat(history[0][1]) > parseFloat(history[1][1])) {
                lastPriceType = 2;
              }
              if (parseFloat(history[0][1]) < parseFloat(history[1][1])) {
                lastPriceType = 3;
              }
              if (parseFloat(history[0][1]) === parseFloat(history[1][1])) {
                lastPriceType = 1;
              }
            }
          }

          oldTradesPair.current = convert.pair;

          setTradesData({
            history: history,
            lastPrice: lastPrice,
            lastPriceType: lastPriceType,
          });
          setLoadingTradesData(false);

          break;
        default:
          break;
      }
    }
  };

  return {
    loadingTradesData,
    tradesData,
  };
};
