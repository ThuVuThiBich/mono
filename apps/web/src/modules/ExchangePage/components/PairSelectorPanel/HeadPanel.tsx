import { FilterGroup } from '@cross/ui';
import { faAngleDown, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Menu, Row } from 'antd';
import clsx from 'clsx';
import React, { memo, useMemo } from 'react';
import { IFilterType } from './PairSelectorPanel';
import styles from './PairSelectorPanel.module.less';

interface PairSelectorPanelProps {
  filterType: IFilterType;
  onClose?: Function;
  fiat?: any;
  setFilterType: (type: any) => void;
  setFiat: (fiat: any) => void;
}

const PairSelectorPanel: React.FC<PairSelectorPanelProps> = ({ filterType, fiat, setFilterType, setFiat, onClose }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fiatList = ['USDT', 'USD'];

  const resolutionOverlay = useMemo(() => {
    return (
      <Menu selectedKeys={fiat} className={styles.menuPopup}>
        {fiatList.map((fiatItem: any) => (
          <Menu.Item
            key={fiatItem}
            onClick={() => {
              setFilterType('fiat');
              setFiat(fiatItem);
            }}
          >
            {fiatItem}
          </Menu.Item>
        ))}
      </Menu>
    );
  }, [fiat, fiatList, setFilterType, setFiat]);

  const datas = useMemo(() => {
    return [
      { label: 'ALL', value: 'all' },
      { label: 'WATCHLIST', value: 'watchlist' },
      {
        label: (
          <span>
            {fiat ?? 'FIAT'} <FontAwesomeIcon icon={faAngleDown} />
            {resolutionOverlay}
          </span>
        ),
        className: styles.fiatFilter,
        value: 'fiat',
      },
      { label: 'BTC', value: 'btc' },
      { label: 'INNOVATION', value: 'innovation' },
    ];
  }, [fiat, resolutionOverlay]);

  return (
    <Row className={styles.headPanel} wrap={false}>
      <Col flex="auto">
        <FilterGroup
          className={styles.filter}
          radioClassName={styles.filterWrapper}
          datas={datas}
          value={filterType}
          onChange={(e) => {
            let activeFiat = null;
            var filterType = e.target.value;
            if (filterType === 'fiat') {
              return;
            }
            setFiat(activeFiat);
            setFilterType(filterType);
          }}
        />
      </Col>
      <Col flex="none">
        <button
          className={clsx(styles.transButton, styles.closeDropdownButton)}
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }}
        >
          <FontAwesomeIcon icon={faTimesCircle} />
        </button>
      </Col>
    </Row>
  );
};

export default memo(PairSelectorPanel);
