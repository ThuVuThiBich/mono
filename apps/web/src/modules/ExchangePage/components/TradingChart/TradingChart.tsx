import dynamic from 'next/dynamic';
import React, { FC, useMemo } from 'react';

import { useTrades } from '@cross/hooks';
import { Surface } from '@cross/ui';
import { faDotCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import clsx from 'clsx';
import { Triangle } from 'components/triangle';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import { getCurrentCurrency } from 'store/ducks/account/slice';
import {
  getCurrentPairValue,
  getLastPriceType,
  getLastTradePrice,
  getListPairValue,
  getTradesData,
} from 'store/ducks/exchange/slice';
import { setExchange, setFullscreen } from 'store/ducks/system/slice';
import { nDecimalFormat, nDecimalFormatAdvance } from 'utils/number';
import PairSelector from './PairSelector';
import styles from './TradingChart.module.less';

const TVChartContainer = dynamic(() => import('TVChartContainer'), { ssr: false });

const TradingChange: FC<{ headerData: any }> = ({ headerData }) => {
  const { t } = useTranslation();

  const currentPairValue = useAppSelector(getCurrentPairValue);

  const dayChangePec = useMemo(() => {
    return (headerData?.dchange_pec ? Math.abs(headerData?.dchange_pec).toFixed(2) : '__') + ' %';
  }, [headerData]);
  const dayChange = useMemo(() => {
    return headerData?.dchange ? nDecimalFormat(headerData.dchange, currentPairValue?.[3] ?? 2) : '__';
  }, [currentPairValue, headerData?.dchange]);
  const dayHigh = useMemo(() => {
    return headerData?.high ? nDecimalFormat(headerData.high, currentPairValue?.[3] ?? 2) : '__';
  }, [currentPairValue, headerData?.high]);
  const dayLow = useMemo(() => {
    return headerData?.low ? nDecimalFormat(headerData.low, currentPairValue?.[3] ?? 2) : '__';
  }, [currentPairValue, headerData?.low]);

  const dayVolume = useMemo(() => {
    let rs = '';
    if (headerData?.vol) {
      let vol = Number(headerData.vol);
      if (vol > 1000000) {
        vol = vol / 1000000;
        rs += ' M';
      }
      rs =
        nDecimalFormatAdvance(vol, currentPairValue?.[3] ?? 2, {
          isNoZero: true,
          minPrecision: 2,
        }) + rs;
    } else {
      rs = '__';
    }
    return rs;
  }, [currentPairValue, headerData?.vol]);

  return (
    <>
      <div className={styles.changeArea}>
        <span className={clsx(styles.textBlock, styles.textSmall, styles.textDark)}>24h Change</span>
        <span
          className={clsx(
            styles.textBlock,
            !headerData || headerData.dchange_pec < 0 ? styles.textDanger : styles.textSuccess,
            !headerData || headerData.dchange_pec < 0 ? styles._24_change_negative : styles._24_change_positive
          )}
        >
          <span>{dayChange.replace('-', '')}</span>
          <span
            className={clsx(
              styles.percentage,
              !headerData || headerData.dchange_pec >= 0 ? styles.percentagePositive : styles.percentageNegative
            )}
          >
            <Triangle width={10} active={!headerData || headerData.dchange_pec >= 0} />
            {/* <FontAwesomeIcon
              className={!headerData || headerData.dchange_pec < 0 ? styles.sortDown : styles.sortUp}
              icon={!headerData || headerData.dchange_pec < 0 ? faSortDown : faSortUp}
            /> */}
            {dayChangePec}
          </span>
        </span>
      </div>

      <div className={styles.highArea}>
        <span className={clsx(styles.textBlock, styles.textSmall, styles.textDark)}>24h High</span>
        <span className={clsx(styles.textBlock)}>{dayHigh}</span>
      </div>

      <div className={styles.lowArea}>
        <span className={clsx(styles.textBlock, styles.textSmall, styles.textDark)}>24h Low</span>
        <span className={clsx(styles.textBlock)}>{dayLow}</span>
      </div>

      <div className={styles.volumeArea}>
        <span className={clsx(styles.textBlock, styles.textSmall, styles.textDark)}>24h Volume</span>
        <span className={clsx(styles.textBlock)}>{dayVolume}</span>
      </div>
    </>
  );
};

const TradingChart: React.FC = () => {
  const dispatch = useAppDispatch();
  const currency = useAppSelector(getCurrentCurrency);
  const screen = useBreakpoint();
  const { fullscreen, language } = useAppSelector((state) => state.system.exchange);
  const currentPair = useRouter().query.id as string;

  const currentPairValue = useAppSelector(getCurrentPairValue);

  const listPairValue = useAppSelector(getListPairValue);

  const { tradesData } = useTrades(currentPair);

  const headerData = useMemo(() => {
    let temp = null;
    if (listPairValue.length > 0) {
      temp = listPairValue.find((item: any) => item.pair === currentPair);
    }
    return temp;
  }, [listPairValue, currentPair]);

  const coinCurrency = useMemo(() => {
    if (!listPairValue) return { BTC: 0, ETH: 0 };

    return listPairValue.reduce(
      (pre: { BTC: number; ETH: number }, next: any) => {
        if (next.pair === 'BTC_USDT') {
          return { ...pre, BTC: next.last };
        }
        if (next.pair === 'ETH_USDT') {
          return { ...pre, ETH: next.last };
        }
        return pre;
      },
      { BTC: 0, ETH: 0 }
    );
  }, [listPairValue]);

  const lastPrice = useMemo(() => {
    return headerData?.last ? nDecimalFormat(headerData.last, currentPairValue?.[3] ?? 2) : '__';
  }, [currentPairValue, headerData?.last]);

  const lastPriceUsd = useMemo(() => {
    let prices = headerData?.last || 0;
    prices *= Number(currency.rate);
    if (headerData) {
      const bbType = headerData.pair.split('_')[1];
      if (bbType !== 'USDT' && bbType !== 'USD') {
        prices = Number(coinCurrency[bbType]) * Number(prices);
      }
    }
    return headerData?.last ? currency.symbol + numeral(prices).format(`0,0.00`) : '__';
  }, [headerData, currency.rate, currency.symbol, coinCurrency]);

  return (
    <Surface borderMd className={clsx(styles.root, fullscreen ? styles.fullscreen : null)}>
      <div className={styles.header}>
        <div className={styles.pairArea}>
          <PairSelector />
        </div>

        <div className={styles.lastPriceArea}>
          <span
            className={clsx(styles.textBlock, styles.textStrong, {
              positive: tradesData.lastPriceType === 2,
              negative: tradesData.lastPriceType === 3,
            })}
          >
            {tradesData.lastPrice}
            {/* {lastPrice} */}
          </span>
          <span className={clsx(styles.textBlock)}>{lastPriceUsd}</span>
        </div>
        <TradingChange headerData={headerData} />

        {/* {!lg ? (
          <TradingChange headerData={headerData} />
        ) : (
          <div className={styles.scroller}>
            <TradingChange headerData={headerData} />
          </div>
        )} */}

        <div className={styles.chartOptionArea}>
          {/* <button type="button" className={styles.fullChartButton}>
            <img src={ChartImg.src} alt="chart" />
          </button> */}
          <div className={styles.actionWrap}>
            <div className="f-start">
              <a onClick={() => dispatch(setFullscreen(!fullscreen))}>
                <img src="/images/svgs/expand-twotone.svg" alt="expand" width="13.58px" />
              </a>
              <FontAwesomeIcon
                onClick={() => {
                  dispatch(setExchange({ name: 'chart', value: false }));
                  dispatch(setFullscreen(false));
                }}
                className={styles.actionIcon}
                icon={faTimesCircle}
              />
              {!fullscreen && <FontAwesomeIcon color="#9AA3A7" className="drag-icon draggable" icon={faDotCircle} />}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartWrap}>
        <TVChartContainer isMobile={!screen.md} symbol={currentPair} locale={language} />
      </div>
    </Surface>
  );
};

export default TradingChart;
