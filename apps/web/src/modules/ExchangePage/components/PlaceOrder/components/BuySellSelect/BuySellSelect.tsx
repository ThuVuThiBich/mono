import { FC } from 'react';
import styles from './BuySellSelect.module.css';
import { RadioGroupProps } from 'antd';
import { FilterGroup, filterValue } from '@cross/ui';
import { useTranslation } from 'next-i18next';

type BuySellSelectProps = Partial<RadioGroupProps> & {
  className?: string;
  value: string;
};

export const BuySellSelect: FC<BuySellSelectProps> = ({ value, ...props }) => {
  const { t } = useTranslation();
  const datas: filterValue[] = [
    { label: 'BUY', value: 'buy', className: styles.buySelect },
    { label: 'SELL', value: 'sell', className: styles.sellSelect },
  ];

  return <FilterGroup datas={datas} filled className={styles.filterGroup} stretch value={value} {...props} />;
};
