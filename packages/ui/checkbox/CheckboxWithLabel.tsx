import React, { forwardRef, PropsWithChildren } from 'react';
import styles from './styles.module.css';
import { Checkbox as AntdCheckbox, CheckboxProps } from 'antd';
import clsx from 'clsx';
import { SurfaceLabel } from '@cross/ui';

export type ModifiedCheckboxProps = Partial<CheckboxProps> & {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
};

export const CheckboxWithLabel = forwardRef<HTMLInputElement, PropsWithChildren<ModifiedCheckboxProps>>(
  function Checkbox({ className, style, label, children, ...props }, ref) {
    return (
      <SurfaceLabel label={label} className={styles.checkboxContainer}>
        <AntdCheckbox ref={ref} className={clsx(styles.checkbox, className)} style={style} {...props}>
          {children}
        </AntdCheckbox>
      </SurfaceLabel>
    );
  }
);
