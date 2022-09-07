import { FC, memo, useState } from 'react';
import styles from './Board.module.css';
import { Surface } from '@cross/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FilterGroup } from '@cross/ui';
import { Space } from 'antd';
import OrderBookTable from './OrderBookTable';
import { TradesTable } from './TradesTable';
import { useAppDispatch, useTypeSafeTranslation } from 'hooks';
import { setExchange } from 'store/ducks/system/slice';

type IFilterType = 'orderBook' | 'trades';

interface BoardProps {}

const Board: FC<BoardProps> = () => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const [filterType, setFilterType] = useState<string>('orderBook');
  return (
    <Surface borderMd className={styles.root}>
      <Space className={styles.header}>
        <Space size={20}>
          <FilterGroup
            filled
            className="tradeBoardFilter"
            datas={[
              { label: 'Order Book', value: 'orderBook' },
              { label: 'Trades', value: 'trades' },
            ]}
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
            }}
          />
        </Space>
        <div className={styles.actionIcon}>
          <FontAwesomeIcon
            onClick={() => dispatch(setExchange({ name: 'board', value: false }))}
            color="#788686"
            icon={faTimesCircle}
            className={styles.iconClose}
          />
          <FontAwesomeIcon color="#9AA3A7" className="drag-icon draggable" icon={faDotCircle} />
        </div>
      </Space>

      {filterType === 'orderBook' ? <OrderBookTable /> : <TradesTable />}
    </Surface>
  );
};

export default memo(Board);
