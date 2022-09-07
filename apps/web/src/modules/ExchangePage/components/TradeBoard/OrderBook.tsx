import { FilterGroup, Surface } from '@cross/ui';
import { faDotCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Space } from 'antd';
import { useAppDispatch } from 'hooks';
import { FC, memo } from 'react';
import { setExchange } from 'store/ducks/system/slice';
import styles from './Board.module.css';
import OrderBookTable from './OrderBookTable';

const OrderBook: FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Surface borderMd className={styles.root}>
      <Space className={styles.header}>
        <Space size={20}>
          <FilterGroup
            filled
            className="tradeBoardFilter"
            value="orderBook"
            datas={[{ label: 'Order Book', value: 'orderBook' }]}
          />
        </Space>
        <div className={styles.actionIcon}>
          <FontAwesomeIcon
            onClick={() => dispatch(setExchange({ name: 'orderBook', value: false }))}
            color="#788686"
            icon={faTimesCircle}
            className={styles.iconClose}
          />
          <FontAwesomeIcon color="#9AA3A7" className="drag-icon draggable" icon={faDotCircle} />
        </div>
      </Space>

      <OrderBookTable />
    </Surface>
  );
};

export default memo(OrderBook);
