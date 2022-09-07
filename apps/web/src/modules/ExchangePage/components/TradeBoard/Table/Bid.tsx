import { useDepth } from '@cross/hooks';
import { Popover } from 'antd';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector, useTypeSafeTranslation } from 'hooks';
import { TOTAL_DECIMAL } from 'modules/ExchangePage/config';
import { sortArr } from 'modules/ExchangePage/dataParser';
import { useRouter } from 'next/router';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { getCurrentPairValue, setOrderBookSelect } from 'store/ducks/exchange/slice';
import { nDecimalFormat } from 'utils/number';
import styles from './Bid.module.less';
import Row from './Row';

const MIN_ROWS = 15;

const BidTable: FC = () => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const [bidsDataTables, setBidsDataTables] = useState<any[]>([]);
  const [coinName, setCoinName] = useState<string[]>(['Coin', 'Money']);
  const [hoverBidsIndex, setHoverBidsIndex] = useState<any>(-1);
  
  const currentPair = useRouter().query.id as string;
  const { depthData: dataDepth } = useDepth(currentPair);

  const currentPairValue = useAppSelector(getCurrentPairValue);
  const bidsTableRef = useRef<any>(null);

  useEffect(() => {
    let coinMoney = currentPairValue?.[0]?.split('_');
    let coin = coinMoney?.[0] ? coinMoney[0] : '-';
    let money = coinMoney?.[1] ? coinMoney[1] : '-';
    setCoinName([coin, money]);

    // scroll top of bids panel when currentPair change
    if (bidsTableRef.current?.scrollHeight) {
      bidsTableRef.current.scrollTop = 0;
    }
  }, [currentPairValue]);

  // convert data
  useEffect(() => {
    let bids: any[][] = sortArr(Object.values(dataDepth.bids));
    const avgTotal: number = dataDepth.avgSum || 0;

    let bidSumCoin: number = 0;
    let bidSumMoney: number = 0;

    for (let bid of bids) {
      const bidMoney = parseFloat(bid[0]) * parseFloat(bid[1]);
      bidSumCoin += parseFloat(bid[1]);
      bidSumMoney += bidMoney;
      bid[0] = nDecimalFormat(bid[0], currentPairValue?.[3] ?? 2);
      bid[1] = nDecimalFormat(bid[1], currentPairValue?.[2] ?? 2);
      bid[2] = nDecimalFormat(bidMoney.toString(), TOTAL_DECIMAL[currentPairValue?.[0]] ?? 2);
      bid[3] = nDecimalFormat(bidSumCoin.toString(), currentPairValue?.[2] ?? 2);
      bid[4] = nDecimalFormat(bidSumMoney.toString(), TOTAL_DECIMAL[currentPairValue?.[0]] ?? 2);
      bid[5] = Math.min(bidMoney / avgTotal, 1) * 100;
    }

    if (bids.length < MIN_ROWS) {
      const emptyBids = Array(MIN_ROWS - bids.length).fill(['--', '--', '--']);
      bids = bids.concat(emptyBids);
    }

    setBidsDataTables(bids);
  }, [dataDepth, currentPairValue]);

  const onRowClick = (index: number) => {
    const totalCoin = parseFloat(bidsDataTables[index][3]?.replace(/\,/g, ''));
    const uniquePrice = bidsDataTables[index][0]?.replace(/\,/g, '');

    dispatch(
      setOrderBookSelect({
        type: 'bids',
        price: uniquePrice,
        amount: totalCoin,
      })
    );
  };

  const onMouseEnter = useCallback((position: number) => {
    setHoverBidsIndex(position);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHoverBidsIndex(-1);
  }, []);

  const getOverlayContent = useCallback(
    (index: number) => {
      const totalCoin = bidsDataTables[index][3];
      const totalMoney = bidsDataTables[index][4];
      const coin = bidsDataTables[index][3]?.replaceAll(',', '');
      const money = bidsDataTables[index][4]?.replaceAll(',', '');
      return (
        <div className={styles.overlayContent}>
          <p>
            <span>Avg.Price</span>
            <span>
              ≈&nbsp;
              {nDecimalFormat((Number(money) / Number(coin)).toString(), currentPairValue?.[3] ?? 2)}
            </span>
          </p>
          <p>
            <span>Sum {coinName[0]}:</span>
            <span>{totalCoin}</span>
          </p>
          <p>
            <span>Sum {coinName[1]}:</span>
            <span>{totalMoney}</span>
          </p>
        </div>
      );
    },
    [bidsDataTables, coinName, currentPairValue]
  );

  return (
    <div className={styles.tableBuyWrap}>
      <div className={clsx(styles.tableBuy, 'scroll')} ref={bidsTableRef}>
        {bidsDataTables.map((item, index) =>
          item[0] === '--' ? (
            <Row key={index} index={index} className={styles.row}>
              <div className={styles.price}>{item[0]}</div>
              <div>{item[1]}</div>
              <div>{item[2]}</div>
            </Row>
          ) : (
            <Popover key={index} content={getOverlayContent(index)} placement="right">
              <Row
                index={index}
                onMouseMove={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onRowClick}
                className={clsx(styles.row, {
                  [styles.hover]: hoverBidsIndex >= index,
                  [styles.active]: hoverBidsIndex === index,
                })}
              >
                <div className={styles.price}>{item[0]}</div>
                <div>{item[1]}</div>
                <div>{item[2]}</div>
                <div className={clsx(styles.volume, styles.volumeBid)} style={{ width: `${item[5]}%` }} />
              </Row>
            </Popover>
          )
        )}
      </div>
    </div>
  );
};

export default memo(BidTable);
