import { FC, useMemo } from 'react';
import styles from './Card.module.less';
import { currencyImgs } from 'assets/images/currency';
import { Surface } from '@cross/ui';

import { Avatar } from '@cross/ui';
import { Button } from 'antd';
import { currencyColors } from 'assets/images/currencyColors';
import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import { IStakingInfo } from 'api/staking';
import { APR_COINS } from 'utils/config';

interface ICardProps {
  coin: string;
  apyRange: string;
  data: IStakingInfo;
  type: 'earn' | 'stake';
  onClick: (data: IStakingInfo, coin: string) => void;
}

const Card: FC<ICardProps> = ({ coin, apyRange, data, type, onClick, children }) => {
  const { t } = useTypeSafeTranslation();

  const handleClick = () => {
    if (onClick) {
      onClick(data, coin);
    }
  };

  const label = useMemo(() => {
    if (type === 'earn') return 'Est. APR';
    return APR_COINS.includes(coin) ? 'Est. APR' : 'Est. APY';
  }, [coin, type]);

  return (
    <Surface borderMd className={styles.root}>
      <div className={styles.wrapper}>
        <Avatar className={styles.avatar} size={50} type="secondary" src={currencyImgs[coin] || currencyImgs.GENERIC} />
        <h2>{coin}</h2>
        <p>{label}</p>
        <div className={styles.percentCard} style={{ background: currencyColors[coin] || currencyColors.GENERIC }}>
          {/* {data?.apy || 0} % */}
          {apyRange}
        </div>
        {/* <p>{apyRange}</p> */}
        {children}
      </div>
      <Button onClick={handleClick} className={styles.btnSubmit} size="large">
        {type === 'earn' ? 'Earn' : 'Stake'}
      </Button>
    </Surface>
  );
};

export default Card;
