import { getCookies, parseJson, setCookies } from '@cross/cookies';
import { useConvertData } from '@cross/hooks';
import { Empty, Table } from 'antd';
import { addFavorite, removeFavorite, useWatchList } from 'api/account';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector, useTypeSafeTranslation } from 'hooks';
import { useRouter } from 'next/router';
import React, { memo, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { getCurrentCurrency } from 'store/ducks/account/slice';
import { getListPairValue, setCurrentPairValue } from 'store/ducks/exchange/slice';
import { setCurrentPair } from 'store/ducks/system/slice';
import { routes } from 'types/routes';
import { USER_COOKIES } from 'utils/constant';
import { getColumn } from './columns';
import { IFilterType } from './PairSelectorPanel';
import styles from './PairSelectorPanel.module.less';

interface TablePanelProps {
  filterType: IFilterType;
  onClose?: Function;
  fiat?: any;
  searchText?: string;
}
export interface IPairData {
  buy: string;
  dchange: string;
  dchange_pec: string;
  high: string;
  last: string;
  low: string;
  sell: string;
  timestamp: string;
  vol: string;
  pair: string;
  decimal: string;
  pairType: string;
}

const TablePanel: React.FC<TablePanelProps> = ({ filterType, onClose, fiat, searchText }) => {
  const router = useRouter();
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const user = true;

  // const { user } = useUser();

  const pairList = queryClient.getQueryData('/bb/symbol/list') as any[];
  const { convertData } = useConvertData(pairList);
  const { data: watchPairs } = useWatchList({
    onSuccess: (_data) => {
      if (_data) setCookies(USER_COOKIES.watchPairs, JSON.stringify(_data));
    },
    onError: () => {
      queryClient.setQueryData('/user/favorite/list', parseJson(getCookies(USER_COOKIES.watchPairs)));
    },
  });

  const listPairValue = useAppSelector(getListPairValue);
  // const listPairValue: any = [];

  const currency = useAppSelector(getCurrentCurrency);
  const { mutateAsync: addWatchPair } = useMutation(addFavorite);
  const { mutateAsync: removeWatchPair } = useMutation(removeFavorite);

  const fnWatchPair = useCallback(
    async (record: any) => {
      const queryKey = '/user/favorite/list';

      try {
        let newWatchList: string[] = [];
        if (watchPairs?.includes(record.pair)) {
          if (user) await removeWatchPair(record.pair);
          const currentWatchPair = queryClient.getQueryData(queryKey) as string[];
          newWatchList = currentWatchPair.filter((pair) => pair !== record.pair);
        } else {
          if (user) await addWatchPair(record.pair);
          const currentWatchPair = queryClient.getQueryData(queryKey) as string[];
          newWatchList = [...(currentWatchPair || []), record.pair];
        }

        setCookies(USER_COOKIES.watchPairs, JSON.stringify(newWatchList));
        queryClient.setQueryData(queryKey, newWatchList);
      } catch (err) {
        console.log({ err });
      }
    },
    [addWatchPair, queryClient, removeWatchPair, user, watchPairs]
  );

  const listM = useMemo(() => {
    let list: any = [];
    const blackPairs: any = [];
    if (filterType === 'innovation') {
      convertData.forEach((convertedItem: any) => {
        if (convertedItem.type === '2' && convertedItem.list_m && convertedItem.list_m.length > 0) {
          list = convertedItem.list_m;
        }
      });
    } else {
      convertData.forEach((convertedItem: any) => {
        if (convertedItem.list_m && convertedItem.list_m.length > 0) {
          convertedItem.list_m.forEach((item: any) => {
            if (blackPairs.indexOf(item.pair) < 0) {
              blackPairs.push(item.pair);
              list.push(item);
            }
          });
        }
      });
    }
    return list;
  }, [convertData, filterType]);

  const getUsdUnit = useCallback(
    (pairData: IPairData) => {
      let price = Number(pairData.last) * Number(currency.rate);
      let money = pairData.pair.split('_')[1];
      if (money === 'USDT') {
        return price;
      }

      let item = listPairValue.find((ele: any) => {
        return ele.pair === money + '_USDT';
      });

      if (item) {
        return '' + Number(item.last) * Number(price);
      }

      return price;
    },
    [currency, listPairValue]
  );
  const tableRows = useMemo(() => {
    let filterList: any = [];
    if (listPairValue.length > 0 && listM.length > 0) {
      filterList = listPairValue.reduce((pre: any, next: any) => {
        const pairValue = listM.find((pair_item: any) => pair_item.pair === next.pair);
        if (pairValue) {
          return [...pre, { ...next, decimal: pairValue.decimal, pairType: pairValue?.data[9] }];
        }
        return [...pre];
      }, []);

      // apply filterType
      let filterFiat: any = null;
      switch (filterType) {
        case 'btc':
          filterFiat = 'BTC';
          break;
        case 'fiat':
          filterFiat = fiat;
          break;
        default:
          break;
      }
      if (filterFiat !== null) {
        filterList = filterList.filter((listPairValue_item: any) => {
          let splits = listPairValue_item.pair.split('_');
          return splits[1].toUpperCase() === filterFiat;
        });
      }

      // watchlist
      if (filterType === 'watchlist') {
        filterList = filterList.filter((listPairValue_item: any) => {
          return (watchPairs || []).includes(listPairValue_item.pair);
        });
      }

      if (filterType === 'margin') {
        filterList = filterList.filter((listPairValue_item: any) => {
          return listPairValue_item.pairType === '2';
        });
      }

      // filter by search box
      filterList = filterList.filter((listPairValue_item: any) =>
        listPairValue_item.pair.includes(searchText?.toUpperCase())
      );
    }

    if (filterList.length > 0) {
      return filterList;
    } else {
      return [];
    }
  }, [listPairValue, listM, filterType, fiat, watchPairs, searchText]);

  const activateCurrentPair = (currentPair: any) => {
    if (listM.length > 0) {
      const check = listM.find((item: any) => item.pair === currentPair);
      let temp = check ? check.data : listM[0].data;

      setCookies(USER_COOKIES.currentPair, temp[0]);
      dispatch(setCurrentPair(temp[0]));
      dispatch(setCurrentPairValue(temp));

      router.replace(
        {
          pathname: `${routes.exchange}/${temp[0]}`,
        },
        undefined,
        { shallow: true }
      );
      if (onClose) {
        onClose();
      }
    }
  };

  const columns = useMemo(() => {
    return getColumn(t, fnWatchPair, watchPairs, currency, getUsdUnit);
  }, [fnWatchPair, watchPairs, currency, getUsdUnit, t]);
  return (
    <div className={clsx(styles.table, 'scroll')}>
      <Table
        dataSource={tableRows}
        rowKey="pair"
        columns={columns}
        pagination={false}
        size="small"
        onRow={(record) => {
          return {
            onClick: (e) => {
              e.preventDefault();
              activateCurrentPair(record.pair);
            },
          };
        }}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'No Data'} />,
        }}
      />
    </div>
  );
};

export default memo(TablePanel);
