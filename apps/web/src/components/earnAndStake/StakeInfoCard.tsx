import { FC, memo, useMemo } from 'react';
import styles from './StakeInfoCard.module.less';
import { Col, Divider, Row } from 'antd';
import dayjs from 'dayjs';
import { useTypeSafeTranslation } from 'hooks';
import { ISelectedStakeInfo } from 'store/ducks/stake/slice';
import { currencyColors } from 'assets/images/currencyColors';
import Hide from 'components/Hide';
import { APR_COINS, APY_STAKING_RANGE } from 'utils/config';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm';

interface StakeInfoCardProps {
  stakeInfo?: ISelectedStakeInfo;
  stakedDate?: any;
}

const COIN_CANT_UNSTAKE = ['ETH', 'AVAX', 'IOTX'];

const StakeInfoCard: FC<StakeInfoCardProps> = ({ stakeInfo, stakedDate }) => {
  const { t } = useTypeSafeTranslation();

  const data = useMemo(() => {
    const type = stakeInfo?.type === 3 ? 'stake' : 'earn';
    const hideRedemptionDateCoin = ['XCR', 'ADA', 'SOL', 'IOST', 'ORBS', 'ATOM'];

    // If stake. Using periodBonusTime. If earning 30 / 60 / 90
    const interestPeriod = type === 'stake' ? Number(stakeInfo?.periodBonusTime) / 1440 : Number(stakeInfo?.time);

    // If stake: Using startBonusTime. If earning: Today
    const valueDate = type === 'stake' ? Number(stakeInfo?.startBonusTime || 0) / 1440 : 0;

    // Default payload for all coin
    let payload = {
      type,
      stake_date: dayjs().format(DATE_FORMAT),
      value_date: dayjs().add(valueDate, 'days').format(DATE_FORMAT),
      interest_period: `${interestPeriod} ${interestPeriod > 1 ? t('common.days') : t('common.day')}`,
      interest_end_date: dayjs().add(Number(stakeInfo?.time), 'days').format(DATE_FORMAT),
      redemption_period: `1 ${t('common.day')}`,
      redemption_date: dayjs()
        .add(stakeInfo?.timeUnstakeReward as number, 'minutes')
        .add(1, 'days')
        .format(DATE_FORMAT),
      apy: stakeInfo?.apy,
      hideRedemptionDate:
        (type === 'stake' && hideRedemptionDateCoin.includes(String(stakeInfo?.coin))) || type === 'earn', // hide if earning
      isCantUnstakeCoin: type === 'stake' && COIN_CANT_UNSTAKE.includes(String(stakeInfo?.coin)),
    };

    /*Special coin formated */
    if (type === 'stake') {
      switch (stakeInfo?.coin) {
        case 'ADA':
          payload.redemption_period = t('common.immediately');
          break;

        case 'SOL':
          payload.redemption_period = `2 ${t('common.days')}`;
          break;

        case 'XCR':
          payload.redemption_period = t('common.immediately');
          break;

        case 'ETH':
          payload.redemption_period = t('stake.can_not_unstake');
          payload.redemption_date = 'N/A';
          break;

        case 'AVAX':
          payload.value_date = dayjs().add(Number(stakedDate), 'days').format(DATE_FORMAT);
          payload.interest_period = `${stakedDate || 0} ${Number(stakedDate) > 1 ? t('common.days') : t('common.day')}`;
          payload.redemption_period = t('stake.can_not_unstake');
          payload.redemption_date = dayjs().add(Number(stakedDate), 'days').format(DATE_FORMAT);

          break;

        case 'IOTX':
          payload.value_date = dayjs().add(Number(stakedDate), 'days').format(DATE_FORMAT);
          payload.interest_period = `${stakedDate || 0} ${Number(stakedDate) > 1 ? t('common.days') : t('common.day')}`;
          payload.redemption_period = t('stake.can_not_unstake');
          payload.redemption_date = dayjs().add(Number(stakedDate), 'days').format(DATE_FORMAT);

          break;

        case 'IOST':
          payload.redemption_period = `3 ${t('common.days')}`;

          break;

        case 'ORBS':
          payload.redemption_period = `14 ${t('common.days')}`;
          break;

        case 'ATOM':
          payload.redemption_period = `21 ${t('common.days')}`;
          break;
        default:
          break;
      }
    }

    return payload;
  }, [stakeInfo, stakedDate, t]);

  const apyLabel = useMemo(() => {
    if (!stakeInfo) return 'Est. APY';
    const type = stakeInfo?.type === 3 ? 'stake' : 'earn';
    if (type === 'earn') return 'Est. APR';
    return APR_COINS.includes(stakeInfo?.coin) ? 'Est. APR' : 'Est. APY';
  }, [stakeInfo, t]);

  return (
    <div className={styles.root}>
      <Row gutter={[0, 8]}>
        <Col span={14}>
          <span className="text-10 disabled ">Stake Date:</span>
        </Col>
        <Col span={10} className="right">
          <span className="text-12 bolder avenir ">{data.stake_date}</span>
        </Col>

        <Col span={14}>
          <span className="text-10 disabled">Value Date:</span>
        </Col>
        <Col span={10} className="right">
          <span className="text-12 bolder avenir">{data.value_date}</span>
        </Col>

        <Col span={14}>
          <span className="text-10 disabled">Interest Period:</span>
        </Col>
        <Col span={10} className="right">
          <span className="text-12 bolder avenir ">{data.interest_period}</span>
        </Col>

        {data.type === 'earn' && (
          <>
            <Col span={14}>
              <span className="text-10 disabled">Interest End Date:</span>
            </Col>
            <Col span={10} className="right">
              <span className="text-12 bolder avenir">Interest End Date:</span>
            </Col>
          </>
        )}

        <Col span={14}>
          <span className="text-10 disabled">{data.isCantUnstakeCoin ? 'Unstake Period:' : 'Redemption Period:'}</span>
        </Col>

        <Col span={10} className="right">
          <span className="text-12 bolder avenir ">{data?.redemption_period}</span>
        </Col>

        <Hide if={data.hideRedemptionDate}>
          <Col span={14}>
            <span className="text-10 disabled">{data.isCantUnstakeCoin ? 'Unstake Date:' : 'Redemption Period:'}</span>
          </Col>
          <Col span={10} className="right">
            <span className="text-12 bolder avenir ">{data.redemption_date}</span>
          </Col>
        </Hide>

        <Divider className="m-0" />

        <Col span={14}>
          <span className="text-10 disabled">{apyLabel}:</span>
        </Col>
        <Col span={10} className="f-end">
          <div
            className={styles.apyCard}
            style={{ background: currencyColors[stakeInfo?.coin as string] || currencyColors.GENERIC }}
          >
            {/* <b className="bolder avenir">{data.apy}</b> <span>%</span> */}
            <b className="bolder avenir">
              {data.type === 'earn' ? `${data.apy} %` : APY_STAKING_RANGE[String(stakeInfo?.coin)] || 'N/A'}
            </b>
          </div>
        </Col>

        <Col span={14}>
          <span className="text-10 disabled">Est. Interests:</span>
        </Col>
        <Col span={10} className="f-end">
          <span className="text-12 bolder avenir">-</span>
        </Col>
      </Row>
    </div>
  );
};

export default memo(StakeInfoCard);
