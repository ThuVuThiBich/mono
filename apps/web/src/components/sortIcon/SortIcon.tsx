import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import styles from './SortIcon.module.css';
import clsx from 'clsx';

interface SortIconProps {
  children?: React.ReactNode;
  level?: number /** 0: No sort, 1 : increment, 2 : decrement  */;
  onChangeOrder?: (order: number) => void;
}

const SortIcon: React.FC<SortIconProps> = ({ level, children, onChangeOrder }) => {
  const [sortLevel, setSortLevel] = useState<number>(0);

  useEffect(() => {
    if (level === 1 || level === 2) {
      setSortLevel(level);
    } else {
      setSortLevel(0);
    }
  }, [level]);

  let icon = null;
  let iconClass = null;
  switch (sortLevel) {
    case 0:
      icon = faSort;
      iconClass = styles.faSort;
      break;
    case 1:
      icon = faSortUp;
      iconClass = styles.faSortUp;
      break;
    case 2:
      icon = faSortDown;
      iconClass = styles.faSortDown;
      break;
    default:
      icon = faSort;
      iconClass = styles.faSort;
  }

  return (
    <span
      className={clsx(styles.wrapper)}
      onClick={() => {
        const newSortLevel = (sortLevel + 1) % 3;
        setSortLevel(newSortLevel);
        if (typeof onChangeOrder !== 'undefined') {
          onChangeOrder(newSortLevel);
        }
      }}
    >
      <span className={styles.text}>{children}</span>{' '}
      <span className={clsx(styles.icon, iconClass)}>
        <FontAwesomeIcon icon={icon} />
      </span>
    </span>
  );
};

export default SortIcon;
