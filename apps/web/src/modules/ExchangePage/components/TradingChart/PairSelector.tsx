import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { currencyImgs } from 'assets/images/currency';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { getExchangeShowPairSelector, togglePairSelectorOpen } from 'store/ducks/system/slice';
import { PairSelectorPanel } from '../PairSelectorPanel';
import styles from './PairSelector.module.css';

interface PairSelectorProps {}

const PairSelector: React.FC<PairSelectorProps> = () => {
  const dispatch = useAppDispatch();
  const showDropdown = useAppSelector(getExchangeShowPairSelector);
  const currentPair = useRouter().query.id as string;

  const toggleDropdownPairSelector = useCallback(() => {
    dispatch(togglePairSelectorOpen());
  }, [dispatch]);

  const pair = useMemo(() => {
    if (!currentPair) {
      return {
        name: '__/__',
        image: currencyImgs.GENERIC,
      };
    }

    const pairSplit = currentPair.split('_');

    return {
      name: pairSplit.join('/'),
      image: currencyImgs[pairSplit[0]] || currencyImgs.GENERIC,
    };
  }, [currentPair]);


  return (
    <>
      <div className={styles.wrapper}>
        {showDropdown && <div className={styles.blur} onClick={toggleDropdownPairSelector} />}
        <div className={styles.symbolWrap}>
          <div className={styles.symbol} onClick={toggleDropdownPairSelector} id="pair-dropdown">
            <img alt="coin" className={styles.coinImage} src={pair.image} />
            <label className={styles.symbolLabel}>{pair.name}</label>
            <button type="button" className={styles.iconChevronDown}>
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </div>

          {showDropdown && (
            <PairSelectorPanel
              visible={showDropdown}
              isDropdown
              onClose={toggleDropdownPairSelector}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PairSelector;
