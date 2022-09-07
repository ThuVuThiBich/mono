import React, { forwardRef, PropsWithChildren } from 'react';
import styles from './styles.module.css';
import { Checkbox as AntdCheckbox, CheckboxProps } from 'antd';
import clsx from 'clsx';

export type ModifiedCheckboxProps = Partial<CheckboxProps> & {
  className?: string;
  style?: React.CSSProperties;
};

export const Checkbox = forwardRef<
  HTMLInputElement,
  PropsWithChildren<ModifiedCheckboxProps>
>(function Checkbox({ className, style, children, ...props }, ref) {
  return (
    <AntdCheckbox
      ref={ref}
      className={clsx(styles.checkbox, className)}
      style={style}
      {...props}
    >
      {children}
    </AntdCheckbox>
  );
});
