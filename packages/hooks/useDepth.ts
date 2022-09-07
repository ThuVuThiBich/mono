import { useEffect, useState } from 'react';

import { parseJson } from '@cross/cookies';
import { useDepthData } from '@cross/context';

export const useDepth = (currentPair: string) => {
  const [loadingDepthData, setLoadingTradesData] = useState<boolean>(false);
  const [depthData, setDepthData] = useState<{
    bids: { [key: number]: any[] };
    asks: { [key: number]: any[] };
    avgSum: number;
    maxBid: number;
    minAsk: number;
  }>({
    bids: {},
    asks: {},
    avgSum: 0,
    maxBid: Math.max(),
    minAsk: Math.min(),
  });

  let bids: { [key: number]: any[] } = depthData.bids || {};
  let asks: { [key: number]: any[] } = depthData.asks || {};
  let minAsk: number = depthData.minAsk;
  let maxBid: number = depthData.maxBid;

  const lastMessage = useDepthData();

  useEffect(() => {
    if (!lastMessage) return;
    handleSocketMessage(lastMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  // handle socket's message
  const handleSocketMessage = (convert: any) => {
    if (convert?.channel) {
      switch (convert?.channel) {
        case 'depth':
          if (convert.pair !== currentPair) {
            break;
          }
          let changes = convert.data.change;
          if (changes) {
            let newBids: { [key: number]: any[] } = parseJson(JSON.stringify(bids));
            let newAsks: { [key: number]: any[] } = parseJson(JSON.stringify(asks));

            for (const change of changes) {
              let price = parseFloat(change[0]);
              let absPrice = Math.abs(price);
              if (price > 0) {
                if (newBids.hasOwnProperty(price)) {
                  if (parseFloat(change[1]) === 0) {
                    delete newBids[price];
                  } else {
                    newBids[price] = change;
                  }
                } else if (parseFloat(change[1]) > 0) {
                  newBids[price] = change;
                }
              } else if (price < 0) {
                if (newAsks.hasOwnProperty(absPrice)) {
                  if (parseFloat(change[1]) === 0) {
                    delete newAsks[absPrice];
                  } else {
                    newAsks[absPrice] = [absPrice, change[1], change[2]];
                  }
                } else if (parseFloat(change[1]) > 0) {
                  newAsks[absPrice] = [absPrice, change[1], change[2]];
                }
              }
            }
            asks = newAsks;
            bids = newBids;
          } else {
            maxBid = Math.max();
            minAsk = Math.min();

            const tempBids = convert.data.bids;
            const tempAsks = convert.data.asks;

            asks = {};
            bids = {};

            for (const bid of tempBids) {
              const price = parseFloat(bid[0]);
              bids[price] = bid;
            }

            for (const ask of tempAsks) {
              const absPrice = Math.abs(parseFloat(ask[0]));
              asks[absPrice] = ask;
            }
          }
          let tempMinAsk = Math.min();
          let tempMaxBid = Math.max();
          const quantity = Object.keys(bids).length + Object.keys(asks).length;
          const sumAsk = Object.values(asks).reduce((res, ask) => {
            tempMinAsk = Math.min(tempMinAsk, Math.abs(Number(ask[0])));
            return res + Number(ask[2]);
          }, 0 as number);
          const sumBid = Object.values(bids).reduce((res, bid) => {
            tempMaxBid = Math.max(tempMaxBid, Math.abs(Number(bid[0])));
            return res + Number(bid[2]);
          }, 0 as number);

          if (tempMaxBid >= tempMinAsk) {
            if (minAsk === tempMinAsk && tempMaxBid > maxBid) {
              Object.keys(asks).forEach((ask) => {
                if (Number(ask) <= tempMaxBid) {
                  delete asks[Number(ask)];
                }
              });
            } else if (maxBid === tempMaxBid && tempMinAsk < minAsk) {
              Object.keys(bids).forEach((bid) => {
                if (Number(bid) >= tempMinAsk) {
                  delete bids[Number(bid)];
                }
              });
            }
          }

          const avgSum = (sumAsk + sumBid) / quantity;
          setDepthData({
            bids: bids,
            asks: asks,
            avgSum: avgSum,
            minAsk: tempMinAsk,
            maxBid: tempMaxBid,
          });
          break;
        default:
          break;
      }
    }
  };

  return {
    loadingDepthData,
    depthData,
  };
};
