import { useTicker } from '@cross/hooks';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { setListPairValue } from 'store/ducks/exchange/slice';
import { getExchangeShowPairSelector, togglePairSelectorOpen } from 'store/ducks/system/slice';
import DesktopRenderer from './Desktop';
import MobileRenderer from './Mobile';
import styles from './styles.module.css';

interface Props {}

const Renderer: FC<Props> = () => {
  const { xs } = useBreakpoint();
  const dispatch = useAppDispatch();
  const showPairSelectorDropdown = useAppSelector(getExchangeShowPairSelector);

  const { listPairValue } = useTicker();

  useEffect(() => {
    dispatch(setListPairValue(listPairValue));
  }, [dispatch, listPairValue]);

  const toggleDropdownPairSelector = () => {
    dispatch(togglePairSelectorOpen());
  };

  if (xs) {
    return (
      <div>
        <MobileRenderer />
      </div>
    );
  }

  return (
    <div>
      {/* Showing blur background when pairSelector show. "TradingChart Component" */}
      {showPairSelectorDropdown && <div className={styles.blur} onClick={toggleDropdownPairSelector} />}
      <DesktopRenderer />
    </div>
  );
};

export default Renderer;
