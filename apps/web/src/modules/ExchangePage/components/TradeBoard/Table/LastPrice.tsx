import { useTrades } from '@cross/hooks';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import clsx from 'clsx';
import { useAppSelector, useTypeSafeTranslation } from 'hooks';
import { useRouter } from 'next/router';
import { FC, memo, useEffect, useState } from 'react';
import { getCurrentPairValue } from 'store/ducks/exchange/slice';
import { nDecimalFormat } from 'utils/number';
import styles from './LastPrice.module.less';

const columns: ColumnsType<any> = [
  {
    title: 'Price',
    key: 'price',
    dataIndex: 'price',
    align: 'left',
  },
  {
    title: 'Amount',
    key: 'amount',
    dataIndex: 'amount',
    align: 'right',
  },
  {
    title: 'Total',
    key: 'total',
    dataIndex: 'total',
    align: 'right',
  },
];

const LastPrice: FC = () => {
  const { t } = useTypeSafeTranslation();
  const [lastPriceDataTables, setLastPriceDataTables] = useState<any[]>([]);
  const currentPairValue = useAppSelector(getCurrentPairValue);
  const currentPair = useRouter().query.id as string;

  const { tradesData } = useTrades(currentPair);

  useEffect(() => {
    // Last price type === 1 when new trade equal to previous trade
    // Last price type === 2 when new trade greater than previous trade
    // Last price type === 3 when new trade lower than previous trade
    setLastPriceDataTables([
      {
        id: 1,
        price: (
          <div
            className={clsx({
              default: tradesData.lastPriceType === 1,
              positive: tradesData.lastPriceType === 2,
              negative: tradesData.lastPriceType === 3,
            })}
          >
            {tradesData?.lastPrice ? nDecimalFormat(String(tradesData?.lastPrice), currentPairValue?.[3] ?? 2) : '-'}
            &nbsp;
            {tradesData.lastPriceType !== 1 && (
              <FontAwesomeIcon icon={tradesData.lastPriceType === 2 ? faCaretUp : faCaretDown} size="lg" />
            )}
          </div>
        ),
        amount: 'last price',
        total: '',
      },
    ]);
  }, [currentPair, currentPairValue, tradesData]);

  return (
    <div className={clsx(styles.tableLastPrice)}>
      <Table
        dataSource={lastPriceDataTables}
        rowKey="id"
        columns={columns}
        pagination={false}
        size="small"
        rowClassName={styles.rowLastPrice}
        showHeader={false}
      />
    </div>
  );
};

export default memo(LastPrice);
