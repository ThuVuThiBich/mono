import { FC, useMemo } from 'react';
import { Col, Row, Space, Typography } from 'antd';
import styles from './Header.module.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { HIDE_XEX_WALLET } from '../constants';
import { nDecimalFormat } from 'utils/number';
import { priceByCurrency } from 'utils/currency';
import { useAppSelector } from 'hooks';
import { useMarketGroupQuery } from 'api/market';
import { useWalletQuery } from 'api/wallet';
import { getCurrentCurrency } from 'store/ducks/account/slice';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';

const Header: FC = () => {
  const { t } = useTranslation();
  const { data: wallet } = useWalletQuery();
  const { data: marketList } = useMarketGroupQuery();
  const router = useRouter();

  const currentCurrency = useAppSelector(getCurrentCurrency);

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
      assessmentResult: !assessmentWithRate ? '0.00' : nDecimalFormat(assessmentWithRate.toString(), 2),
      totalNumber: `${!totalBTC ? '0.00' : nDecimalFormat(totalBTC.toString(), 8)}`,
    };
  }, [wallet, marketList, currentCurrency]);

  return (
    <Row gutter={[0, 24]} justify="space-between" className={styles.root}>
      <Col xs={24}>
        <Row justify="space-between" wrap gutter={[12, 24]}>
          <div className="text-22 weight-900">Your Wallet</div>

          <Space className="cursor" onClick={() => router.push(`${routes.history}?tab=assets`)} size={10}>
            <Typography.Text>
              <b>Wallet History</b>
            </Typography.Text>
            <FontAwesomeIcon icon={faArrowRight} />
          </Space>
        </Row>
      </Col>
      <Col xs={24}>
        <Row justify="space-between" wrap gutter={[12, 24]}>
          <div>
            <div className="secondary">Account balance</div>
            <Space size={0} direction="vertical" align="end">
              <div id="total-balance-btc" className={styles.lockedBalance}>
                {convert.totalNumber} <span className="nowrap">BTC</span>
              </div>
              <div suppressHydrationWarning className={styles.lockedBalanceExchange}>
                ~{currentCurrency.symbol} {convert.assessmentResult} {currentCurrency.coinType}
              </div>
            </Space>
          </div>
        </Row>
      </Col>
    </Row>
  );
};

export default Header;
