/* eslint-disable react/display-name */
import { Footer, Layout } from '@cross/ui';
import AuthModal from 'components/authModal/AuthModal';
import dynamic from 'next/dynamic';
import * as React from 'react';
import Header from './header';
import styles from './styles.module.less';
const Moduler = dynamic(() => import('components/Moduler'), { ssr: false });

interface CustomLayoutProps {
  children: React.ReactNode;
}

export const CustomLayout = ({ children }: CustomLayoutProps) => {
  return (
    <Layout>
      {/* <Moduler /> */}
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer className={styles.footer}>Ultorex Dealing © 2022, All Rights Reserved.</Footer>
      <AuthModal />
    </Layout>
  );
};

export default CustomLayout;
