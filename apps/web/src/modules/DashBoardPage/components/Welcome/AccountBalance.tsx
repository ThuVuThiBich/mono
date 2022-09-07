import { FC, useMemo, useState } from 'react';
import styles from './AccountBalance.module.less';
import { Row, Col, Space } from 'antd';
import clsx from 'clsx';
import DepositIcon from '../../assets/icon-deposit.svg';
import WithdrawIcon from '../../assets/icon-withdraw.svg';
import { useWalletQuery } from 'api/wallet';
import { useMarketGroupQuery } from 'api/market';
import { useAppDispatch, useAppSelector, useTypeSafeTranslation } from 'hooks';
import { priceByCurrency } from 'utils/currency';
import { nDecimalFormat } from 'utils/number';
import { useRouter } from 'next/router';
import { getCurrentCurrency } from 'store/ducks/account/slice';
import DepositModal from 'modules/WalletPage/components/Deposit/DepositModal';
import WithdrawModal from 'modules/WalletPage/components/Withdraw/WithdrawModal';
import { Undefined } from 'types/util-types';
import { useGetUserInfo } from 'api/account';
import { setAuthModal } from 'store/ducks/system/slice';
import { HIDE_XEX_WALLET } from 'modules/WalletPage/constants';
// import { UserPnl } from 'components/UserPnl';
import CurrentPortfolio from './CurrentPortfolio';
import { Surface } from '@cross/ui';

interface THeadInfo {
  assessmentResult: string;
  totalNumber: string;
  coinType: string;
}

const HeadInfo: FC<THeadInfo> = ({ assessmentResult, totalNumber, coinType }) => {
  const { t } = useTypeSafeTranslation();
  return (
    <Row>
      <Col xs={24} sm={16}>
        <Space direction="vertical" size={0}>
          <span className="secondary">Account balance:</span>
          <div className={styles.balanceTextWrapper}>
            <span className="text-28 bold break-word">
              {totalNumber} <span className="medium text-26">BTC</span>
            </span>
            <p className="secondary text-20">
              {assessmentResult} <span className="text-18 secondary">{coinType}</span>
            </p>
          </div>
        </Space>
      </Col>
      <Col xs={24} sm={8}>
        {/* <UserPnl /> */}
      </Col>
    </Row>
  );
};

const DepositAndWithDraw: FC = () => {
  const { t } = useTypeSafeTranslation();
  const { data } = useGetUserInfo();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<Undefined<'withdraw' | 'deposit'>>(undefined);

  const handleClose = () => {
    setOpen(undefined);
  };

  const handleOpen = (key: 'withdraw' | 'deposit') => {
    if (!data?.use_mfa && key === 'withdraw') {
      return dispatch(setAuthModal('2fa'));
    }
    setOpen(key);
  };

  return (
    <>
      <Row gutter={32}>
        <Col span={12}>
          <div onClick={() => handleOpen('deposit')} className={clsx(styles.card, styles.cardBalance)}>
            <img alt="deposit" src={DepositIcon.src} />
            <p className="secondary">Deposit</p>
          </div>
        </Col>
        <Col span={12}>
          <div onClick={() => handleOpen('withdraw')} className={clsx(styles.card, styles.cardBalance)}>
            <img alt="widraw" src={WithdrawIcon.src} />
            <p className="secondary">Withdraw</p>
          </div>
        </Col>
      </Row>

      <DepositModal onClose={handleClose} visible={open === 'deposit'} />
      <WithdrawModal onClose={handleClose} visible={open === 'withdraw'} />
    </>
  );
};

export const DISABLE_COIN = ['KUSD', 'IUSD', 'XEX'];
export const NUMBER_ROUND = 8;

const AccountBalance: FC = () => {
  const router = useRouter();
  const currentCurrency = useAppSelector(getCurrentCurrency);
  const { data: wallet } = useWalletQuery();
  const { data: marketList } = useMarketGroupQuery({
    refetchInterval: 10000,
  });

  const convert = useMemo(() => {
    let assessmentNumber = Number(wallet?.assessment || '0') || 0;

    if (HIDE_XEX_WALLET && wallet?.coins) {
      const xexAssessment = wallet.coins.reduce((pre: number, next: any) => {
        if (next.coinType.includes('XCR') || next.coinType === 'RIGHTS') {
          return pre + Number(next.assessment);
        }
        return pre;
      }, 0);
      assessmentNumber = Math.max(assessmentNumber - xexAssessment, 0);
    }

    let btcPrice = 0;
    if ((marketList || []).length > 0) {
      btcPrice = Number((marketList || []).find((i) => i.pair.split('_')[0] === 'BTC')?.lastTradePrice || '0');
    }
    const totalBTC = btcPrice ? assessmentNumber / btcPrice : 0;

    const assessmentWithRate = priceByCurrency(assessmentNumber, Number(currentCurrency.rate || 1));

    return {
      assessmentResult: `~${currentCurrency.symbol} ${
        !assessmentWithRate ? '0.00' : nDecimalFormat(assessmentWithRate.toString(), 2)
      }`,
      totalNumber: `${!totalBTC ? '0.00' : nDecimalFormat(totalBTC.toString(), 8)}`,
    };
  }, [wallet, marketList, currentCurrency]);

  return (
    <Surface borderMd className={styles.root}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <HeadInfo
            coinType={currentCurrency.coinType}
            assessmentResult={convert.assessmentResult}
            totalNumber={convert.totalNumber}
          />
        </Col>
        <Col span={24}>
          <DepositAndWithDraw />
        </Col>
        <Col span={24}>
          <CurrentPortfolio router={router} />
        </Col>
      </Row>
    </Surface>
  );
};

export default AccountBalance;
