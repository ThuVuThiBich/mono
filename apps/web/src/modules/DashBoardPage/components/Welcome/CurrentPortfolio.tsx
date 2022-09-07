import { FC, useCallback, useMemo } from 'react';
import styles from './CurrentPortfolio.module.less';
import { Space, Button, Tooltip, Empty } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ApexOptions } from 'apexcharts';
import { useWalletQuery } from 'api/wallet';
import { useTypeSafeTranslation } from 'hooks';
import { routes } from 'types/routes';
import { NextRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { currencyImgs } from 'assets/images/currency';
import { currencyColors } from 'assets/images/currencyColors';
import { formatNumber } from 'utils/number';
import { Avatar } from '@cross/ui';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TCurrentPortfolio {
  router: NextRouter;
}

interface IDataset {
  labels: string[];
  colors: string[];
  datas: number[];
}

interface ILegendProps {
  coin: string;
  amount: string;
  percent: string;
}

const Legends: FC<ILegendProps> = ({ amount, coin, percent }) => {
  return (
    <Tooltip placement="topLeft" title={coin === 'other' ? 'Other' : coin}>
      <div className={styles.chartLabel}>
        <Avatar type="secondary" size={27} src={currencyImgs[coin] || currencyImgs.GENERIC} />
        <div className="avenir bolder text-12">{formatNumber(amount)} </div>
        <div className="avenir text-12">{percent}</div>
      </div>
    </Tooltip>
  );
};

const CurrentPortfolio: FC<TCurrentPortfolio> = ({ router }) => {
  const { t } = useTypeSafeTranslation();
  const { data: wallet } = useWalletQuery();

  const dataSet = useMemo(() => {
    return wallet?.pieInfoList.reduce(
      (pre, next) => {
        return {
          labels: [...pre.labels, next.coinName],
          colors: [...pre.colors, currencyColors[next.coinName] ?? '#ffba00'],
          datas: [...pre.datas, Number(next.proportion.replace('%', ''))],
        };
      },
      { labels: [], colors: [], datas: [] } as IDataset
    );
  }, [wallet]);

  const options = useMemo(() => {
    return {
      chart: {
        type: 'pie',
      },
      colors: dataSet?.colors,
      fill: {
        opacity: 1,
      },
      labels: dataSet?.labels,
      dataLabels: {
        enabled: false,
        style: {
          fontSize: '12px',
          fontFamily: 'Avenir, sans-serif',
          fontWeight: '400',
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} %`,
        },
        style: {
          fontSize: '12px',
          fontFamily: 'Avenir, sans-serif',
          fontWeight: '400',
        },
      },
      yaxis: {
        show: false,
      },
      legend: {
        show: false,
      },
      stroke: {
        width: 0,
      },
      plotOptions: {
        pie: {},
      },
    } as ApexOptions;
  }, [dataSet]);

  const getAvailableAmount = useCallback(
    (coin: string) => {
      return String(wallet?.coins.find((x) => x.coinType === coin)?.totalNumber ?? 0);
    },
    [wallet?.coins]
  );

  return (
    <div>
      <p className="secondary">Current portfolio:</p>
      <div className={styles.cardPortfolio}>
        {Number(wallet?.pieInfoList?.length) > 0 ? (
          <>
            <ReactApexChart options={options} series={dataSet?.datas || []} type="pie" height={240} />
            <div className={styles.legendWrap}>
              <div>
                {wallet?.pieInfoList?.map((item) => (
                  <Legends
                    key={item.coinName}
                    coin={item.coinName}
                    amount={item.coinName === 'other' ? item.usdtName : getAvailableAmount(item.coinName)}
                    percent={item.proportion}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="w-100 f-center">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" />
          </div>
        )}
      </div>
      <div className="f-end -mr-15">
        <Button type="text" className="right" onClick={() => router.push(routes.wallet)}>
          <Space>
            Wallet <FontAwesomeIcon icon={faArrowRight} />
          </Space>
        </Button>
      </div>
    </div>
  );
};

export default CurrentPortfolio;
