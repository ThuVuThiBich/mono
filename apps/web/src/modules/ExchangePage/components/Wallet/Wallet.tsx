import { useWallet } from '@cross/hooks';
import { Surface } from '@cross/ui';
import { faDotCircle, faTimesCircle, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Space } from 'antd';
import { useGetUserInfo } from 'api/account';
import { useAppDispatch } from 'hooks';
import { useAppSelector } from 'hooks/reduxHook';
import DepositModal from 'modules/WalletPage/components/Deposit/DepositModal';
import WithdrawModal from 'modules/WalletPage/components/Withdraw/WithdrawModal';
import { useTranslation } from 'next-i18next';
import { FC, memo, useMemo, useState } from 'react';
import { getCurrentPairValue } from 'store/ducks/exchange/slice';
import { setAuthModal, setExchange } from 'store/ducks/system/slice';
import { Undefined } from 'types/util-types';
import styles from './Wallet.module.less';
import WalletAmountCoin from './WalletAmountCoin';

interface WalletProps {}

const Wallet: FC<WalletProps> = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const user = true;

  // const { user } = useUser();
  const { data: userInfo } = useGetUserInfo({ enabled: !!user });
  const [open, setOpen] = useState<Undefined<'withdraw' | 'deposit' | 'repay' | 'borrow'>>(undefined);

  const { walletFree: availableWallet } = useWallet();

  const handleClose = () => {
    setOpen(undefined);
  };

  const currentPairValue = useAppSelector(getCurrentPairValue);

  const handleOpen = (key: 'withdraw' | 'deposit' | 'repay' | 'borrow') => {
    if (!user) return dispatch(setAuthModal('auth'));
    if (!userInfo?.use_mfa && key === 'withdraw') {
      return dispatch(setAuthModal('2fa'));
    }
    setOpen(key);
  };

  const pairData = useMemo(() => {
    if (!currentPairValue) return {};
    const [coin, money] = currentPairValue[0].split('_');
    return {
      [coin]: currentPairValue[2] ?? 2,
      [money]: currentPairValue[3] ?? 2,
    };
  }, [currentPairValue]);

  const pair = useMemo(() => {
    if (!currentPairValue) return {};
    const [coin, money] = currentPairValue[0].split('_');
    return {
      coin,
      money,
    };
  }, [currentPairValue]);

  return (
    <>
      <Surface borderMd filled className={styles.wallet}>
        <Space className={styles.item}>
          <Space size={8} align="center">
            <FontAwesomeIcon icon={faWallet} color="#788686" className={styles.icon} />
            <span className={styles.title}>Wallet</span>
          </Space>
          <div>
            <FontAwesomeIcon
              onClick={() => dispatch(setExchange({ name: 'walletSnap', value: false }))}
              color="#788686"
              icon={faTimesCircle}
              className={styles.iconClose}
            />
            <FontAwesomeIcon color="#9AA3A7" className="drag-icon draggable" icon={faDotCircle} />
          </div>
        </Space>
        <div className={styles.amountWrapper}>
          <WalletAmountCoin
            id={`wallet-${pair.coin}`}
            coin={pair.coin}
            value={availableWallet[pair.coin]?.number || '0'}
            assessment={availableWallet[pair.coin]?.assessment || '0'}
            decimalSeparator={pairData[pair.coin]}
          />

          <WalletAmountCoin
            id={`wallet-${pair.money}`}
            coin={pair.money}
            value={availableWallet[pair.money]?.number || '0'}
            assessment={availableWallet[pair.money]?.assessment || '0'}
            decimalSeparator={pairData[pair.money]}
          />
        </div>

        <Space className={styles.bottomContainer}>
          <div onClick={() => handleOpen('deposit')} className={styles.iconWrap}>
            {/* <FontAwesomeIcon icon={faUpload} color="#788686" className={styles.icon} /> */}
            <img src="/images/svgs/deposit-duotone.svg" alt="deposit" />
          </div>
          <div onClick={() => handleOpen('withdraw')} className={styles.iconWrap}>
            {/* <FontAwesomeIcon icon={faDownload} color="#788686" className={styles.icon} /> */}
            <img src="/images/svgs/withdraw-duotone.svg" alt="withdraw" />
          </div>
        </Space>
      </Surface>

      {open && <DepositModal initCoin={pair.coin} onClose={handleClose} visible={open === 'deposit'} />}
      {open && <WithdrawModal initCoin={pair.coin} onClose={handleClose} visible={open === 'withdraw'} />}
    </>
  );
};

export default memo(Wallet);
