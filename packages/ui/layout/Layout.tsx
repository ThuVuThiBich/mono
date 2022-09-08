/* eslint-disable react/display-name */
import { Layout as AntdLayout } from 'antd';
import clsx from 'clsx';
import * as React from 'react';
import styles from './styles.module.css';
import { LayoutProps } from './types';

const Layout = React.forwardRef<HTMLElement, LayoutProps>((props, ref) => (
  <AntdLayout className={clsx(styles.layout, props.className)} {...props}>
    {props.children}
  </AntdLayout>
));

export default Layout;
