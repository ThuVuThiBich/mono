import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';
import clsx from 'clsx';
import { FC } from 'react';
import styles from './styles.module.css';

export type SelectProps = Pick<
  AntdSelectProps<any>,
  'className' | 'defaultValue' | 'loading' | 'onChange' | 'value' | 'showSearch' | 'placeholder' | 'filterOption'
>;

export const Select: FC<SelectProps> & { Option: typeof AntdSelect.Option } = ({ children, className, ...props }) => {
  return (
    <AntdSelect dropdownClassName={styles.dropdown} className={clsx(styles.root, className)} {...props}>
      {children}
    </AntdSelect>
  );
};

Select.Option = AntdSelect.Option;
