import { FC, useEffect, useMemo, useRef, useState } from 'react';

import styles from './MainMarket.module.css';
import { Col, Empty, Form, Row, Table } from 'antd';
import { Space, Button as AntdButton } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { currencyFormatter } from 'utils/currency';
import { PercentIndicator } from 'components/statistic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faStar } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';
import { ITickerSocket, usePairListQuery } from 'api/exchange';
import { addFavorite, removeFavorite, useWatchList } from 'api/account';
import { USER_COOKIES, WEB_SOCKET_URL } from 'utils/constant';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { currencyImgs } from 'assets/images/currency';
import numeral from 'numeral';
import clsx from 'clsx';
import { useMutation, useQueryClient } from 'react-query';
import SortIcon from 'components/sortIcon';
import Router from 'next/router';
import { routes } from 'types/routes';
import { ICurrentCurrency } from 'types/local';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getCurrentCurrency } from 'store/ducks/account/slice';
import { useGetCreditCoins } from 'api/get_credit';
import { setAuthModal } from 'store/ducks/system/slice';
import { getCookies, parseJson, setCookies } from '@cross/cookies';
import { Avatar, Button, FilterGroup, InputWithLabel } from '@cross/ui';

interface ICoinCurrency {
  BTC: number;
  ETH: number;
}

const getColumns = (
  t: Function,
  handleWatch: (pair: string) => void,
  coinCurrency: ICoinCurrency,
  sortInfo: ISortInfo,
  setSortInfo: any,
  watchPairLoading: string[],
  currency: ICurrentCurrency,
  dispatch: any,
  user: any,
  creditCoins?: string[],
  watchPairs?: string[]
): ColumnsType<ITickerSocket> => [
  {
    title: (
      <SortIcon
        level={sortInfo.column === 'pair' ? sortInfo.direction : 0}
        onChangeOrder={(newOrder: any) => {
          setSortInfo({
            column: 'pair',
            direction: newOrder,
          });
        }}
      >
        Coin
      </SortIcon>
    ),
    dataIndex: 'pair',
    render(pair) {
      const pairSplit = pair.split('_');

      return (
        <Space>
          <AntdButton
            type="text"
            // disabled={watchPairLoading.includes(pair)}
            className={styles.btnWatch}
            onClick={() => handleWatch(pair)}
            icon={<FontAwesomeIcon color={(watchPairs || []).includes(pair) ? '#FFBA00' : '#9AA3A7'} icon={faStar} />}
          />
          <Space>
            <Avatar size={20} type="secondary" src={currencyImgs[pairSplit[0]] || currencyImgs.GENERIC} />
            <span className="bold default">{pairSplit[0]}</span>
          </Space>
          <span className="bold default">/</span>
          <Space>
            <Avatar size={20} type="secondary" src={currencyImgs[pairSplit[1]] || currencyImgs.GENERIC} />
            <span className=" bold default">{pairSplit[1]}</span>
          </Space>
        </Space>
      );
    },
  },
  {
    title: (
      <SortIcon
        level={sortInfo.column === 'last' ? sortInfo.direction : 0}
        onChangeOrder={(newOrder: any) => {
          setSortInfo({
            column: 'last',
            direction: newOrder,
          });
        }}
      >
        Last Price
      </SortIcon>
    ),
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
        <Space size="small">
          <span className={clsx(`bold success uppercase`)}>{numeral(lastPrizes).format('0,0.00[00000]')}</span>
          <span className="bold default">/</span>
          <div>
            <span className="default">{currency.symbol}</span>
            <span className="bold default uppercase">{`${numeral(lastPrizeUSDT).format('0,0.00[00000]')}`}</span>
          </div>
        </Space>
      );
    },
  },
  {
    title: (
      <SortIcon
        level={sortInfo.column === 'dchange_pec' ? sortInfo.direction : 0}
        onChangeOrder={(newOrder: any) => {
          setSortInfo({
            column: 'dchange_pec',
            direction: newOrder,
          });
        }}
      >
        24h Change
      </SortIcon>
    ),
    key: 'data',
    render(_, record) {
      return <PercentIndicator transparent value={`${Number(record.data.dchange_pec).toFixed(2)}%`} />;
    },
  },
  {
    title: (
      <SortIcon
        level={sortInfo.column === 'high' ? sortInfo.direction : 0}
        onChangeOrder={(newOrder: any) => {
          setSortInfo({
            column: 'high',
            direction: newOrder,
          });
        }}
      >
        24h High
      </SortIcon>
    ),
    key: 'data',
    render(_, record) {
      return <span className="uppercase">{`${numeral(record.data.high).format('0,0.00[00000]')}`}</span>;
    },
  },
  {
    title: (
      <SortIcon
        level={sortInfo.column === 'low' ? sortInfo.direction : 0}
        onChangeOrder={(newOrder: any) => {
          setSortInfo({
            column: 'low',
            direction: newOrder,
          });
        }}
      >
        24h Low
      </SortIcon>
    ),
    key: 'data',
    render(_, record) {
      return <span className="uppercase">{`${numeral(record.data.low).format('0,0.00[00000]')}`}</span>;
    },
  },
  // {
  //   title: t('marketpage.marketTable.market_cap'),
  //   key: 'marketCap',
  //   dataIndex: 'marketCap',
  // },
  {
    title: (
      <SortIcon
        level={sortInfo.column === 'vol' ? sortInfo.direction : 0}
        onChangeOrder={(newOrder: any) => {
          setSortInfo({
            column: 'vol',
            direction: newOrder,
          });
        }}
      >
        24h Volume
      </SortIcon>
    ),
    key: 'data',
    render(_, record) {
      return (
        <>
          <span>{currency.symbol}</span>
          <span className="uppercase">{currencyFormatter(`${Number(record.data.vol) * Number(currency.rate)}`)}</span>
        </>
      );
    },
  },
  {
    key: 'actions',
    align: 'right',
    colSpan: 5,
    render(_, record) {
      const coin = record.pair.split('_')[0];
      return (
        <Space size="large">
          <Button
            disabled={!creditCoins?.includes(coin)}
            onClick={() => {
              if (!user) return dispatch(setAuthModal('auth'));
              else Router.push(`${routes.buy}?coin=${coin}`);
            }}
            type="accent-turqoise"
            size="small"
          >
            Buy
          </Button>
          <Button onClick={() => Router.push(`${routes.exchange}/${record.pair}`)} type="success" size="small">
            Trade
          </Button>
        </Space>
      );
    },
  },
];

type IFilterType = 'all' | 'watch_list' | 'gainer' | 'loser';
interface ISortInfo {
  column: 'pair' | 'last' | 'dchange_pec' | 'high' | 'low' | 'vol';
  direction: number;
}

const MainMarket: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const currency = useAppSelector(getCurrentCurrency);
  const { sendMessage, lastMessage, readyState } = useWebSocket(WEB_SOCKET_URL);
  const { data: creditCoins } = useGetCreditCoins();

  const [filterType, setFilterType] = useState<IFilterType>('all');
  const [sortInfo, setSortInfo] = useState<ISortInfo>({ column: 'pair', direction: 0 });

  const [search, setSearch] = useState('');
  const [marketDatas, setMarketDatas] = useState<ITickerSocket[]>([]);
  const marketDatasRef = useRef<ITickerSocket[]>([]);

  // const { user } = useUser();
  const user = true;

  const { data: pairList, isLoading } = usePairListQuery({ leverage: 'ALL' });
  const { data: watchPairs } = useWatchList({
    onSuccess: (_data) => {
      if (_data) setCookies(USER_COOKIES.watchPairs, JSON.stringify(_data));
    },
    onError: () => {
      queryClient.setQueryData('/user/favorite/list', parseJson(getCookies(USER_COOKIES.watchPairs)));
    },
  });

  const [watchPairLoading, setWatchPairLoading] = useState<string[]>([]);
  const { mutateAsync: addWatchPair } = useMutation(addFavorite);
  const { mutateAsync: removeWatchPair } = useMutation(removeFavorite);

  useEffect(() => {
    if (!lastMessage || lastMessage?.data === "{'ping':''}") return;
    const tickerData: ITickerSocket = parseJson(lastMessage.data);

    const index = marketDatasRef.current.findIndex((item) => item.pair === tickerData.pair);

    const listData = [...marketDatasRef.current];
    if (index !== -1) {
      listData[index] = tickerData;
      marketDatasRef.current = listData;
    } else {
      marketDatasRef.current = [...marketDatasRef.current, tickerData];
    }

    setMarketDatas(marketDatasRef.current);
  }, [lastMessage, search]);

  // Subscribe websocket
  useEffect(() => {
    if (!pairList || readyState !== ReadyState.OPEN) return;
    pairList.forEach((pair: any) => {
      const msg = `{"event":"subscribe", "channel":"ticker","pair":"${pair[0]}"}`;
      sendMessage(msg);
    });
  }, [pairList, readyState, sendMessage]);

  const handleWatchPair = async (pair: string) => {
    const queryKey = '/user/favorite/list';

    try {
      setWatchPairLoading((old) => Array.from(new Set([...old, pair])));
      let newWatchList: string[] = [];
      if (watchPairs?.includes(pair)) {
        if (user) await removeWatchPair(pair);
        const currentWatchPair = queryClient.getQueryData(queryKey) as string[];
        newWatchList = currentWatchPair.filter((currentPair) => currentPair !== pair);
      } else {
        if (user) await addWatchPair(pair);
        const currentWatchPair = queryClient.getQueryData(queryKey) as string[];
        newWatchList = [...(currentWatchPair || []), pair];
      }

      setCookies(USER_COOKIES.watchPairs, JSON.stringify(newWatchList));
      queryClient.setQueryData(queryKey, newWatchList);
      setWatchPairLoading((old) => old.filter((pair) => pair !== pair));
    } catch (err) {
      setWatchPairLoading((old) => old.filter((pair) => pair !== pair));
      console.log({ err });
    }
  };

  const coinCurrency = useMemo(() => {
    if (!marketDatasRef.current) return { BTC: 0, ETH: 0 };

    return marketDatasRef.current.reduce(
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
  }, []);

  const columns = useMemo(() => {
    return getColumns(
      t,
      handleWatchPair,
      coinCurrency,
      sortInfo,
      setSortInfo,
      watchPairLoading,
      currency,
      dispatch,
      user,
      creditCoins,
      watchPairs
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinCurrency, watchPairs, watchPairLoading, sortInfo, creditCoins, t]);

  const dataSource = useMemo(() => {
    let datas = [...marketDatas];

    // Search
    if (search) {
      datas = datas.filter((x) => x.pair.includes(search.toUpperCase()));
    }

    // Filter
    switch (filterType) {
      case 'loser':
        datas = datas.filter((x) => Number(x.data.dchange_pec) < 0);
        break;
      case 'gainer':
        datas = datas.filter((x) => Number(x.data.dchange_pec) > 0);
        break;
      case 'watch_list':
        datas = datas.filter((x) => watchPairs?.includes(x.pair));
        break;
      default:
        break;
    }

    // Sort
    let sortCallback = null;
    if (datas.length > 0 && sortInfo.direction !== 0) {
      let direction = sortInfo.direction;
      if (direction === 2) {
        direction = -1;
      }

      switch (sortInfo.column) {
        case 'pair':
          sortCallback = (a: ITickerSocket, b: ITickerSocket) => {
            if (a.pair < b.pair) return -direction;
            if (a.pair > b.pair) return direction;
            return 0;
          };
          break;
        case 'last':
          sortCallback = (a: ITickerSocket, b: ITickerSocket) => {
            let aValue = Number(a.data.last);
            let bValue = Number(b.data.last);
            if (aValue < bValue) return -direction;
            if (aValue > bValue) return direction;
            return 0;
          };
          break;
        case 'dchange_pec':
          sortCallback = (a: ITickerSocket, b: ITickerSocket) => {
            let aValue = Number(a.data.dchange_pec);
            let bValue = Number(b.data.dchange_pec);
            if (aValue < bValue) return -direction;
            if (aValue > bValue) return direction;
            return 0;
          };
          break;
        case 'high':
          sortCallback = (a: ITickerSocket, b: ITickerSocket) => {
            let aValue = Number(a.data.high);
            let bValue = Number(b.data.high);
            if (aValue < bValue) return -direction;
            if (aValue > bValue) return direction;
            return 0;
          };
          break;
        case 'low':
          sortCallback = (a: ITickerSocket, b: ITickerSocket) => {
            let aValue = Number(a.data.low);
            let bValue = Number(b.data.low);
            if (aValue < bValue) return -direction;
            if (aValue > bValue) return direction;
            return 0;
          };
          break;
        case 'vol':
          sortCallback = (a: ITickerSocket, b: ITickerSocket) => {
            let aValue = Number(a.data.vol);
            let bValue = Number(b.data.vol);
            if (aValue < bValue) return -direction;
            if (aValue > bValue) return direction;
            return 0;
          };
          break;
        default:
          break;
      }
    }
    if (sortCallback) {
      datas = datas.sort(sortCallback);
    }

    return datas;
  }, [marketDatas, search, filterType, sortInfo.direction, sortInfo.column, watchPairs]);

  return (
    <div className="container">
      <Row gutter={[24, 0]} className={styles.introWrapper} justify="space-between">
        <Col lg={6}>
          <Form.Item>
            <InputWithLabel
              value={search}
              className={styles.searchInput}
              onChange={(e) => setSearch(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              placeholder={'Type Crypto Name'}
              label={'Search'}
              suffix={<FontAwesomeIcon color="#788686" icon={faSearch} className={styles.searchIcon} size="lg" />}
              searchForm
            />
          </Form.Item>
        </Col>
        <Col lg={6.5}>
          <Space size={30}>
            <FilterGroup
              datas={[
                { label: 'All', value: 'all' },
                {
                  label: 'Your Watchlist',
                  value: 'watch_list',
                },
                {
                  label: 'Top Gainers',
                  value: 'gainer',
                },
                {
                  label: 'Top Losers',
                  value: 'loser',
                },
              ]}
              value={filterType}
              onChange={(e: any) => {
                setFilterType(e.target.value);
              }}
            />
          </Space>
        </Col>
      </Row>
      <div className="divider-x my-8" />
      <div className={styles.table}>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={dataSource}
          rowKey="pair"
          pagination={{
            pageSize: 15,
            hideOnSinglePage: true,
          }}
          size="small"
          scroll={{ x: true }}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'No Data'} />,
          }}
        />
      </div>
    </div>
  );
};

export default MainMarket;
