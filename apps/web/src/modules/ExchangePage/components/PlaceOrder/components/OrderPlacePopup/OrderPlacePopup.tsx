import { FC } from 'react';
import { Modal } from 'antd';
import styles from './OrderPlacePopup.module.css';
import { Button } from '@cross/ui';
import { fixed, nDecimalFormat } from 'utils/number';
import { useTypeSafeTranslation } from 'hooks';
import clsx from 'clsx';

interface OrderPlacePopupProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  stop: number | undefined;
  limit: number | undefined;
  amount: number | undefined;
  side: 'buy' | 'sell';
  moneyCoin: string;
  coin: string;
  coinDecimalAmount: number;
  moneyCoinDecimalAmount: number;
}

export const OrderPlacePopup: FC<OrderPlacePopupProps> = ({
  visible,
  onCancel,
  stop,
  limit,
  amount,
  side,
  moneyCoin,
  coin,
  onConfirm,
  coinDecimalAmount,
  moneyCoinDecimalAmount,
}) => {
  const { t } = useTypeSafeTranslation();

  const onFinish = () => {
    onConfirm();
    onCancel();
  };

  return (
    <Modal visible={visible} className={styles.root} onCancel={onCancel} centered>
      <div className={styles.header}>
        REVIEW YOUR
        <span className={styles.green}>
          {side === 'buy' ? (
            <span className={styles.green}> STOP BUY </span>
          ) : (
            <span className={styles.red}> STOP SELL </span>
          )}{' '}
        </span>{' '}
        ORDER
      </div>
      <div className={styles.inner}>
        <div className={styles.title}>
          If the last price of {coin}
          {side === 'buy' ? (
            <>
              <span className={styles.green}> increases </span> above:{' '}
            </>
          ) : (
            <>
              <span className={styles.red}> decreases </span> below:{' '}
            </>
          )}
        </div>

        <div className={styles.value}>
          {nDecimalFormat('' + stop, moneyCoinDecimalAmount)} {moneyCoin} <span className={styles.gray}>[STOP]</span>
        </div>
        <div className={styles.title}>an order will be placed:</div>
        <div className={styles.value}>
          <span>
            {side === 'buy' ? <span className={styles.green}> BUY </span> : <span className={styles.red}> SELL </span>}
            {fixed((amount || 0).toString(), coinDecimalAmount)} {coin}
          </span>
          <span className={clsx(styles.gray, 'uppercase')}>[AMOUNT]</span>
        </div>
        <div className={styles.title}>at a price of:</div>
        <div className={styles.value}>
          {nDecimalFormat('' + limit, moneyCoinDecimalAmount)} {moneyCoin}{' '}
          <span className={clsx(styles.gray, 'uppercase')}>[LIMIT]</span>
        </div>
      </div>
      <div className="f-center">
        <Button type={side} className={clsx(styles.confirmBtn, 'uppercase')} onClick={onFinish}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
