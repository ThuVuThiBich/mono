export interface ITickerSocket {
  data: {
    buy: string;
    dchange: string;
    dchange_pec: string;
    high: string;
    last: string;
    low: string;
    sell: string;
    timestamp: string;
    vol: string;
  };
  pair: string;
}
