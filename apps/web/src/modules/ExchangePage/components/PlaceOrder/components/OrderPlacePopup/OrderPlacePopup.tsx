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
    <Modal
      visible={visible}
      className={styles.root}
      title={t('exchange.review_your_stop_buy_order')}
      onCancel={onCancel}
      centered
    >
      <div className={styles.header}>
        {t('exchange.review_your')}{' '}
        <span className={styles.green}>
          {side === 'buy' ? (
            <span className={styles.green}>{t('exchange.stop_buy')} </span>
          ) : (
            <span className={styles.red}>{t('exchange.stop_sell')} </span>
          )}{' '}
        </span>{' '}
        {t('exchange.order')}
      </div>
      <div className={styles.inner}>
        <div className={styles.title}>
          {t('exchange.if_the_last_price_of')} {coin}
          {side === 'buy' ? (
            <>
              <span className={styles.green}> {t('exchange.increases')} </span> {t('exchange.above')}:{' '}
            </>
          ) : (
            <>
              <span className={styles.red}> {t('exchange.decreases')} </span> {t('exchange.below')}:{' '}
            </>
          )}
        </div>

        <div className={styles.value}>
          {nDecimalFormat('' + stop, moneyCoinDecimalAmount)} {moneyCoin}{' '}
          <span className={styles.gray}>[{t('exchange.stop')}]</span>
        </div>
        <div className={styles.title}>{t('exchange.an_order_will_be_placed')}</div>
        <div className={styles.value}>
          <span>
            {side === 'buy' ? (
              <span className={styles.green}> {t(' buy_uppercase')} </span>
            ) : (
              <span className={styles.red}> {t(' sell_uppercase')} </span>
            )}
            {fixed((amount || 0).toString(), coinDecimalAmount)} {coin}
          </span>
          <span className={clsx(styles.gray, 'uppercase')}>[{t('exchange.amount')}]</span>
        </div>
        <div className={styles.title}>{t('exchange.at_a_price_of')}</div>
        <div className={styles.value}>
          {nDecimalFormat('' + limit, moneyCoinDecimalAmount)} {moneyCoin}{' '}
          <span className={clsx(styles.gray, 'uppercase')}>[{t(' limit_uppercase')}]</span>
        </div>
      </div>
      <Button type={side} className={clsx(styles.confirmBtn, 'uppercase')} onClick={onFinish}>
        {t('common.confirm')}
      </Button>
    </Modal>
  );
};
