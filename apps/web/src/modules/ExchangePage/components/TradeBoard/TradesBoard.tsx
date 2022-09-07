import { FC, memo } from 'react';
import styles from './Board.module.css';
import { Surface } from '@cross/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FilterGroup } from '@cross/ui';
import { Space } from 'antd';
import { TradesTable } from './TradesTable';
import { useAppDispatch, useTypeSafeTranslation } from 'hooks';
import { setExchange } from 'store/ducks/system/slice';

const TradesBoard: FC = () => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();

  return (
    <Surface borderMd className={styles.root}>
      <Space className={styles.header}>
        <Space size={20}>
          <FilterGroup
            filled
            className="tradeBoardFilter"
            value="trades"
            datas={[{ label: 'Trades', value: 'trades' }]}
          />
        </Space>
        <div className={styles.actionIcon}>
          <FontAwesomeIcon
            onClick={() => dispatch(setExchange({ name: 'trades', value: false }))}
            color="#788686"
            icon={faTimesCircle}
            className={styles.iconClose}
          />
          <FontAwesomeIcon color="#9AA3A7" className="drag-icon draggable" icon={faDotCircle} />
        </div>
      </Space>

      <TradesTable />
    </Surface>
  );
};

export default memo(TradesBoard);
