/* eslint-disable react/display-name */
import { Input as AntdInput } from 'antd';
import clsx from 'clsx';
import { forwardRef, PropsWithChildren } from 'react';
import styles from './styles.module.css';
import { InputProps } from './types';

const Input = forwardRef<any, PropsWithChildren<InputProps>>((props, ref) => {
  return <AntdInput className={clsx(styles.input, props.className)} {...props} />;
});

export default Input;
