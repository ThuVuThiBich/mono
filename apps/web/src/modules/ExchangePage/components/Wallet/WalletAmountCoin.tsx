import { FC, useMemo } from 'react';
import { currencyImgs } from 'assets/images/currency';
import { Avatar } from '@cross/ui';
import styles from './Wallet.module.less';
import { formatNumber } from 'utils/number';
import { useAppSelector } from 'hooks';
import { getCurrentCurrency } from 'store/ducks/account/slice';

interface WalletAmountCoinProps {
  coin: string;
  value: string;
  assessment: string;
  id?: any;
  decimalSeparator?: number;
}

const WalletAmountCoin: FC<WalletAmountCoinProps> = ({ coin, value, decimalSeparator, assessment, id }) => {
  const currency = useAppSelector(getCurrentCurrency);

  const usdText = useMemo(() => {
    const price = Number(value) * Number(assessment) * Number(currency.rate);
    return assessment ? `${currency.symbol}${formatNumber(price.toString(), 2)}` : '-';
  }, [assessment, currency, value]);

  return (
    <div className={styles.walletCoin}>
      <Avatar
        size={22}
        type="secondary"
        src={currencyImgs[coin] || currencyImgs.GENERIC}
        className={styles.currencyIcon}
      />
      <div className={styles.walletAmount}>
        <div>
          <span id={id}>{formatNumber(value, decimalSeparator)}</span>
        </div>
        <div className={styles.usdAmount} suppressHydrationWarning title={usdText}>
          {usdText}
        </div>
      </div>
    </div>
  );
};

export default WalletAmountCoin;
