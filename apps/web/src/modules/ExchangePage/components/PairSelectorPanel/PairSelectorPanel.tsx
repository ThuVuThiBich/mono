import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React, { memo, useState } from 'react';
import styles from './PairSelectorPanel.module.less';

import { useAppSelector } from 'hooks';

import HeadPanel from './HeadPanel';
import TablePanel from './TablePanel';
import { Input } from '@cross/ui';

export type IFilterType = 'all' | 'watchlist' | 'fiat' | 'btc' | 'innovation' | 'margin';

interface PairSelectorPanelProps {
  visible: boolean;
  onClose?: Function;
  isDropdown?: boolean;
}

const PairSelectorPanel: React.FC<PairSelectorPanelProps> = ({ visible, onClose, isDropdown }) => {
  const [filterType, setFilterType] = useState<IFilterType>('all');
  const [fiat, setFiat] = useState<any>(null);

  const { fullscreen } = useAppSelector((state) => state.system.exchange);

  const [searchText, setSearchText] = useState<any>('');
  return (
    <>
      <div
        className={clsx(
          isDropdown ? styles.dropdownPanel : styles.staticPanel,
          isDropdown && fullscreen ? styles.dropdownFullscreen : undefined
        )}
        style={{ display: visible ? 'block' : 'none' }}
      >
        <div className={styles.dropdownWrap}>
          <div className={clsx(styles.mask, styles.firstMask)} />
          <div className={clsx(styles.mask, styles.secondMask)} />
          <div className={styles.dropdownContent}>
            <HeadPanel
              filterType={filterType}
              fiat={fiat}
              onClose={onClose}
              setFiat={setFiat}
              setFilterType={setFilterType}
            />

            <div className={styles.searchWrap}>
              <Input
                autoFocus
                placeholder="Type Crypto Name"
                className={styles.searchInput}
                value={searchText}
                onChange={(e: any) => {
                  setSearchText(e.target.value);
                }}
              />
              <button className={clsx(styles.transButton, styles.searchSubmit)}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>

            <TablePanel filterType={filterType} fiat={fiat} onClose={onClose} searchText={searchText} />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(PairSelectorPanel);
