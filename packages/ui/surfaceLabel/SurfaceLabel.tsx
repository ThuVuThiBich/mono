import { FC } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
export interface SurfaceLabelProps {
  id?: string;
  label?: any;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  labelClassName?: string;
}

export const SurfaceLabel: FC<SurfaceLabelProps> = ({
  label,
  id,
  children,
  size = 'middle',
  labelClassName,
  className,
}) => {
  const inputSize = styles[size];
  const inputLabel = styles[`label__${size}`];
  return (
    <div className={clsx(styles.inputContainer, inputSize, className)}>
      <label className={clsx(styles.label, inputLabel, labelClassName)} htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
};
