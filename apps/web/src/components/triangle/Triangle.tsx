import clsx from 'clsx';
import { CSSProperties, FC } from 'react';
import styles from './Triangle.module.css';

interface TriangleProps {
  active?: boolean;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  style?: CSSProperties;
  stable?: boolean;
  width?: number;
}

export const Triangle: FC<TriangleProps> = ({ width = 17, active = true, className, stable = false }) => {
  if (stable)
    return (
      <img className={clsx(styles.root, className)} width={width} src="/images/svgs/stable.svg" alt="stable-icon" />
    );
  if (active)
    return (
      <img
        className={clsx(styles.root, className)}
        width={width + 3}
        src="/images/svgs/triangle-active.svg"
        alt="triangle-icon"
      />
    );
  return (
    <img
      className={clsx(styles.root, className)}
      width={width}
      src="/images/svgs/triangle-error.svg"
      alt="triangle-icon"
    />
  );
};
