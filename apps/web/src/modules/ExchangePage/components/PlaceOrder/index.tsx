import { Surface } from '@cross/ui';
import { faDotCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch } from 'hooks';
import { FC } from 'react';
import { setExchange } from 'store/ducks/system/slice';
import SpotTrade from './Spot';
import styles from './styles.module.less';

const PlaceOrder: FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.wrapper}>
      <Surface borderMd className={styles.root}>
        <div className={styles.actionIcon}>
          <FontAwesomeIcon
            onClick={() => dispatch(setExchange({ name: 'market', value: false }))}
            icon={faTimesCircle}
          />
          <FontAwesomeIcon color="#9AA3A7" className="drag-icon draggable" icon={faDotCircle} />
        </div>
        <SpotTrade />
      </Surface>
    </div>
  );
};

export default PlaceOrder;
