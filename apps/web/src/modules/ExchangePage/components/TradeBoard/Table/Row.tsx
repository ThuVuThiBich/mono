import clsx from 'clsx';
import React, { forwardRef, memo, PropsWithChildren } from 'react';
import styles from './Row.module.less';

interface RowPropsProps {
  onMouseMove?: (index: number) => void;
  onMouseLeave?: (index: number) => void;
  onClick?: (index: number) => void;
  className?: string;
  index: any;
}

const Row = forwardRef<HTMLDivElement, PropsWithChildren<RowPropsProps>>(function RowComponent(
  { children, onClick, onMouseLeave, onMouseMove, index, className, ...props },
  ref
) {
  const handleMouseMove = () => {
    if (onMouseMove) onMouseMove(index);
  };

  const handleClick = () => {
    if (onClick) onClick(index);
  };

  const handleMouseLeave = () => {
    if (onMouseLeave) onMouseLeave(index);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={clsx(styles.row, className)}
      {...props}
    >
      {children}
    </div>
  );
});

export default memo(Row);
