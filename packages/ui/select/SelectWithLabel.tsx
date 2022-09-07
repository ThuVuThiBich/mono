import { FC } from 'react';
import styles from './SelectWithLabel.module.css';
import clsx from 'clsx';

import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';
import { SurfaceLabel } from '@cross/ui';

export type SelectProps = Partial<AntdSelectProps<any>> & {
  id?: string;
  label?: any;
  className?: string;
  selectClassName?: string;
  dropdownClassName?: string;
  mobileLabel?: boolean;
};

const { Option } = AntdSelect;

const SelectWithLabel: FC<SelectProps> = ({
  label,
  id,
  className,
  selectClassName,
  children,
  size = 'middle',
  mobileLabel,
  dropdownClassName,
  ...props
}) => {
  const inputWithSize = styles[size];
  return (
    <SurfaceLabel
      id={id}
      label={label}
      size={size}
      labelClassName={mobileLabel ? styles.label : ''}
      className={clsx(styles.root, className)}
    >
      <AntdSelect
        dropdownClassName={clsx(styles.dropdown, dropdownClassName)}
        className={clsx(styles.input, inputWithSize, selectClassName)}
        {...props}
      >
        {children}
      </AntdSelect>
    </SurfaceLabel>
  );
};

export { SelectWithLabel, Option };
