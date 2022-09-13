/* eslint-disable react/display-name */
import { Footer, Layout } from '@cross/ui';
import AuthModal from 'components/authModal/AuthModal';
import { useRouter } from 'next/router';
import * as React from 'react';
import Header from './header';
import styles from './styles.module.less';
// const Moduler = dynamic(() => import('components/Moduler'), { ssr: false });

interface CustomLayoutProps {
  children: React.ReactNode;
}

const BlankLayoutPages = ['/404', '/500', '/error', '/maintenance', '/chart/[id]'];

export const CustomLayout = ({ children }: CustomLayoutProps) => {
  const router = useRouter();

  const blankLayout = React.useMemo((): boolean => {
    return BlankLayoutPages.includes(router.pathname);
  }, [router]);

  return (
    <Layout>
      {/* <Moduler /> */}
      {!blankLayout && <Header />}
      <main className={styles.main}>{children}</main>
      {!blankLayout && <Footer className={styles.footer}>Ultorex Dealing © 2022, All Rights Reserved.</Footer>}
      <AuthModal />
    </Layout>
  );
};

export default CustomLayout;
