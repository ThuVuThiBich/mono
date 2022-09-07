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
import styles from './Ask.module.less';
import Row from './Row';

const MIN_ROWS = 15;

const AskTable: FC = () => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const [asksDataTables, setAsksDataTables] = useState<any[]>([]);
  const [coinName, setCoinName] = useState<string[]>(['Coin', 'Money']);
  const [hoverAsksIndex, setHoverAsksIndex] = useState<any>(9999999999);
  const currentPairValue = useAppSelector(getCurrentPairValue);
  const asksTableRef = useRef<any>(null);
  const isScrollDown = useRef(false);

  const currentPair = useRouter().query.id as string;
  const { depthData: dataDepth } = useDepth(currentPair);

  useEffect(() => {
    let coinMoney = currentPairValue?.[0]?.split('_');
    let coin = coinMoney?.[0] ? coinMoney[0] : '-';
    let money = coinMoney?.[1] ? coinMoney[1] : '-';
    setCoinName([coin, money]);

    // scroll bottom of asks panel when currentPair change
    if (asksTableRef.current?.scrollHeight) {
      setTimeout(() => {
        asksTableRef.current.scrollTop = asksTableRef.current.scrollHeight;
      }, 300);
    }
  }, [currentPairValue]);

  useEffect(() => {
    if (asksDataTables.length > 0 && !isScrollDown.current && asksTableRef.current?.scrollHeight) {
      setTimeout(() => {
        asksTableRef.current.scrollTop = asksTableRef.current.scrollHeight;
      }, 300);
      if (asksTableRef.current.scrollHeight > 300) {
        isScrollDown.current = true;
      }
    }
  }, [asksDataTables]);

  // convert data
  useEffect(() => {
    let asks: any[][] = sortArr(Object.values(dataDepth.asks));
    const avgTotal: number = dataDepth.avgSum || 0;

    let askSumCoin: number = 0;
    let askSumMoney: number = 0;

    for (let i = asks.length - 1; i >= 0; i--) {
      const absPrice = Math.abs(parseFloat(asks[i][0]));
      const askMoney = absPrice * parseFloat(asks[i][1]);
      askSumCoin += parseFloat(asks[i][1]);
      askSumMoney += askMoney;
      asks[i][0] = nDecimalFormat(asks[i][0], currentPairValue?.[3] ?? 2);
      asks[i][1] = nDecimalFormat(asks[i][1], currentPairValue?.[2] ?? 2);
      asks[i][2] = nDecimalFormat(askMoney.toString(), TOTAL_DECIMAL[currentPairValue?.[0]] ?? 2);
      asks[i][3] = nDecimalFormat(askSumCoin.toString(), currentPairValue?.[2] ?? 2);
      asks[i][4] = nDecimalFormat(askSumMoney.toString(), TOTAL_DECIMAL[currentPairValue?.[0]] ?? 2);
      asks[i][5] = Math.min(askMoney / avgTotal, 1) * 100;
    }

    if (asks.length < MIN_ROWS) {
      const emptyAsks = Array(MIN_ROWS - asks.length).fill(['--', '--', '--']);
      asks = emptyAsks.concat(asks);
    }
    setAsksDataTables(asks);
  }, [dataDepth, currentPairValue]);

  const onRowClick = (index: number) => {
    const totalCoin = parseFloat(asksDataTables[index][3]?.replace(/\,/g, ''));
    const uniquePrice = asksDataTables[index][0]?.replace(/\,/g, '');

    dispatch(
      setOrderBookSelect({
        type: 'asks',
        price: uniquePrice,
        amount: totalCoin,
      })
    );
  };

  const onMouseEnter = useCallback((position: number) => {
    setHoverAsksIndex(position);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHoverAsksIndex(9999999999);
  }, []);

  const getOverlayContent = useCallback(
    (index: number) => {
      const totalCoin = asksDataTables[index][3];
      const totalMoney = asksDataTables[index][4];
      const coin = asksDataTables[index][3]?.replaceAll(',', '');
      const money = asksDataTables[index][4]?.replaceAll(',', '');
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
    [asksDataTables, coinName, currentPairValue]
  );

  return (
    <div className={styles.tableSellWrap}>
      <div className={clsx(styles.tableSell, styles.scroll)} ref={asksTableRef}>
        {asksDataTables.map((item, index) =>
          item[0] === '--' ? (
            <Row index={index} className={styles.row} key={index}>
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
                  [styles.hover]: hoverAsksIndex <= index,
                  [styles.active]: hoverAsksIndex === index,
                })}
              >
                <div className={styles.price}>{item[0]}</div>
                <div>{item[1]}</div>
                <div>{item[2]}</div>
                <div className={clsx(styles.volume, styles.volumeAsk)} style={{ width: `${item[5]}%` }} />
              </Row>
            </Popover>
          )
        )}
      </div>
      <div id="bo"></div>
    </div>
  );
};

export default memo(AskTable);
