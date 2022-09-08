/* eslint-disable react/display-name */
import { Layout } from 'antd';
import clsx from 'clsx';
import { forwardRef, PropsWithChildren } from 'react';
import styles from './styles.module.css';
import { HeaderProps } from './types';

const AntdHeader = Layout.Header;

const Header = forwardRef<HTMLElement, PropsWithChildren<HeaderProps>>((props, ref) => (
  <AntdHeader className={clsx(styles.header, props.className)} {...props}>
    {props.children}
  </AntdHeader>
));

export default Header;
