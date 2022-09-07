import { CSSProperties, FC, useMemo } from 'react';
import styles from './styles.module.css';
import { Space, Tooltip } from 'antd';
import { Triangle } from 'components/triangle';
import clsx from 'clsx';

enum priceStatus {
  up = 'up',
  down = 'down',
  stable = 'stable',
}
const getStatus = (rate: number) => {
  if (rate > 0) {
    return priceStatus.up;
  } else if (rate < 0) {
    return priceStatus.down;
  }
  return priceStatus.stable;
};
interface PercentIndicatorProps {
  value: string; // with percent
  transparent?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const PercentIndicator: FC<PercentIndicatorProps> = ({ value, transparent, className, style }) => {
  const formattedVal = useMemo(() => {
    return value.slice(0, -1); // remove "%"
  }, [value]);

  const isPositive = useMemo(() => {
    return formattedVal[0] !== '-';
  }, [formattedVal]);

  const status = useMemo(() => {
    return getStatus(parseFloat(formattedVal));
  }, [formattedVal]);

  const withToolTip = useMemo(() => {
    return value.length > 10;
  }, [value]);

  return (
    <Space
      style={style}
      className={clsx(
        styles.root,
        styles.priceWrapper,
        isPositive ? styles.priceUp : styles.priceDown,
        status === priceStatus.stable && styles.priceStable,
        transparent && styles.transparent,
        className
      )}
    >
      <Triangle size="middle" active={status === priceStatus.up} stable={status === priceStatus.stable} />

      {withToolTip ? (
        <Tooltip
          title={
            <>
              {isPositive ? formattedVal : formattedVal.replace('-', '')} <span className={styles.percent}>%</span>
            </>
          }
        >
          <div className="f-center">
            <div className={styles.value}>
              {isPositive
                ? formattedVal.substring(0, 9)
                : Number(formattedVal).toFixed(2).replace('-', '').substring(0, 9)}
            </div>
            <span className={styles.percent}>%</span>
          </div>
        </Tooltip>
      ) : (
        <div className={styles.value}>
          {isPositive ? formattedVal : formattedVal.replace('-', '')} <span className={styles.percent}>%</span>
        </div>
      )}
    </Space>
  );
};
