import { parseJson } from '@cross/cookies';
import { Avatar, Surface } from '@cross/ui';
import { faArrowRight, faChevronRight, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Empty, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useWatchList } from 'api/account';
import { ITickerSocket } from 'api/exchange';
import { currencyImgs } from 'assets/images/currency';
import { PercentIndicator } from 'components/statistic';
import { useAppSelector, useTypeSafeTranslation } from 'hooks';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { getCurrentCurrency } from 'store/ducks/account/slice';
import { ICurrentCurrency } from 'types/local';
import { routes } from 'types/routes';
import { WEB_SOCKET_URL } from 'utils/constant';
import styles from './WatchList.module.css';

interface ICoinCurrency {
  BTC: number;
  ETH: number;
}

const getColumns = (
  coinCurrency: ICoinCurrency,
  onClick: (record: ITickerSocket) => void,
  currency: ICurrentCurrency
): ColumnsType<ITickerSocket> => [
  {
    key: 'pair',
    dataIndex: 'pair',
    render(pair) {
      const pairSplit = pair.split('_');
      return (
        <Space>
          <Space>
            <Avatar size={20} type="secondary" src={currencyImgs[pairSplit[0]] || currencyImgs.GENERIC} />
            <span className="bold default">{pairSplit[0]}</span>
          </Space>
          <span className="bold default">/</span>
          <Space>
            <Avatar size={20} type="secondary" src={currencyImgs[pairSplit[1]] || currencyImgs.GENERIC} />
            <span className="bold default">{pairSplit[1]}</span>
          </Space>
        </Space>
      );
    },
  },
  {
    key: 'data',
    render(_, record) {
      const lastPrizes = record.data.last;

      if (Number(lastPrizes) === 0) return <span className="bold default uppercase"> __ &nbsp;/ __</span>;

      let lastPrizeUSDT = Number(lastPrizes) * Number(currency.rate);
      const bbType = record.pair.split('_')[1];
      if (bbType === 'BTC') {
        lastPrizeUSDT = Number(coinCurrency[bbType]) * Number(lastPrizeUSDT);
      }
      if (bbType === 'ETH') {
        lastPrizeUSDT = Number(coinCurrency[bbType]) * Number(lastPrizeUSDT);
      }

      return (
        <>
          <span className="">{currency.symbol}</span>
          <span className=" bold">{numeral(lastPrizeUSDT).format('0,0.00')}</span>
        </>
      );
    },
  },
  {
    key: 'data',
    render(_, record) {
      return <PercentIndicator transparent value={`${Math.abs(Number(record.data.dchange_pec)).toFixed(2)}%`} />;
    },
  },
  {
    key: 'data',
    render(_, record) {
      const price = Number(record.data.vol) * Number(currency.rate);

      return (
        <div>
          <span className="text-12 secondary">24h</span>
          <br />
          <span className="text-14 light ">
            Vol.
            <span className="uppercase">
              {currency.symbol}
              {price > 999999 ? numeral(price).format('0,0.[000]a') : numeral(price).format('0,0.[000]')}
            </span>
          </span>
        </div>
      );
    },
  },
  {
    key: 'data',
    render(_, record) {
      return (
        <Button
          onClick={() => onClick(record)}
          shape="circle"
          type="text"
          icon={<FontAwesomeIcon icon={faChevronRight} color="#ffffff" />}
        />
      );
    },
  },
];

const WatchList: FC = () => {
  const { t } = useTypeSafeTranslation();
  const router = useRouter();
  const [watchList, setWatchList] = useState<ITickerSocket[]>([]);
  const watchListRef = useRef<ITickerSocket[]>([]);
  const currency = useAppSelector(getCurrentCurrency);
  const { data: watchPairs, isLoading: pairLoading } = useWatchList();

  const { sendMessage, lastMessage, readyState } = useWebSocket(WEB_SOCKET_URL);

  useEffect(() => {
    if (!lastMessage || lastMessage?.data === "{'ping':''}") return;
    const tickerData: ITickerSocket = parseJson(lastMessage.data);

    const index = watchListRef.current.findIndex((item) => item.pair === tickerData.pair);

    const listData = [...watchListRef.current];
    if (index !== -1) {
      listData[index] = tickerData;
      watchListRef.current = listData;
    } else {
      watchListRef.current = [...watchListRef.current, tickerData];
    }
    setWatchList(watchListRef.current);
  }, [lastMessage]);

  // Subscribe websocket
  useEffect(() => {
    if (!watchPairs || readyState !== ReadyState.OPEN) return;
    watchPairs?.forEach((pair) => {
      const msg = `{"event":"subscribe", "channel":"ticker","pair":"${pair}"}`;
      sendMessage(msg);
    });

    // Subscribe 2 main ticker to get there prices
    if (!watchPairs.includes('BTC_USDT')) {
      const msg = `{"event":"subscribe", "channel":"ticker","pair":"BTC_USDT"}`;
      sendMessage(msg);
    }
    if (!watchPairs.includes('ETH_USDT')) {
      const msg = `{"event":"subscribe", "channel":"ticker","pair":"ETH_USDT"}`;
      sendMessage(msg);
    }
  }, [watchPairs, readyState]);

  const coinCurrency = useMemo(() => {
    if (!watchListRef.current) return { BTC: 0, ETH: 0 };

    return watchListRef.current.reduce(
      (pre: ICoinCurrency, next: ITickerSocket) => {
        if (next.pair === 'BTC_USDT') {
          return { ...pre, BTC: Number(next.data.last) };
        }
        if (next.pair === 'ETH_USDT') {
          return { ...pre, ETH: Number(next.data.last) };
        }
        return pre;
      },
      { BTC: 0, ETH: 0 }
    );
  }, [watchList]);

  const onRowClick = (record: ITickerSocket) => {
    router.push(`${routes.exchange}/${record.pair}`);
  };

  const columns = useMemo(() => {
    return getColumns(coinCurrency, onRowClick, currency);
  }, [router, currency]);

  const dataSource = useMemo(() => {
    return watchList.filter((data) => watchPairs?.includes(data.pair));
  }, [watchPairs, watchList]);

  return (
    <Surface borderMd className={styles.root}>
      <div className="f-between">
        <div className="bold default">WATCHLIST</div>
        <FontAwesomeIcon icon={faStar} color="#788686" size="lg" />
      </div>
      <div className="divider-x my-8" />

      <div className={styles.table}>
        <Table
          loading={pairLoading || readyState !== ReadyState.OPEN}
          dataSource={dataSource}
          rowKey="pair"
          columns={columns}
          pagination={false}
          size="small"
          scroll={{ x: true }}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" />,
          }}
        />
      </div>
      <div className="f-end -mr-15">
        <Button size="middle" type="text" className="right" onClick={() => router.push(routes.market)}>
          <Space>
            Market <FontAwesomeIcon icon={faArrowRight} />
          </Space>
        </Button>
      </div>
    </Surface>
  );
};

export default WatchList;
