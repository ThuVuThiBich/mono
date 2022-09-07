import { Avatar, Button, Header } from '@cross/ui';
import { Divider, Menu, Space, Drawer } from 'antd';
import AccountDropdown from 'components/accountDropdown/AccountDropdown';
import { LanguageSelect } from 'components/languageSelect';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { routes } from 'types/routes';
import { navigationRoutes } from '../routes';
import styles from './Mobile.module.less';

interface IDrawerMenu {
  visible: boolean;
  onClose: () => void;
}

const { SubMenu } = Menu;

const NavigatorDrawer: FC<IDrawerMenu> = ({ visible, onClose }) => {
  const { pathname } = useRouter();

  const items = navigationRoutes.map((route) => {
    if (route.path) {
      return {
        key: route.path,
        label: (
          <Link key={route.path} passHref href={route.path}>
            {route.title}
          </Link>
        ),
      };
    }

    return (
      // <SubMenu key={route.title} title={route.title}>
      {
        key: route.title,
        label: (
          <Link key={route.title} passHref href={route.title}>
            {route.title}
          </Link>
        ),
        children: route?.subs?.map((sub) => ({
          key: sub.path,
          label: (
            <Link key={sub.path} passHref href={sub.path}>
              <div className={styles.uppercase}>{sub.title}</div>
            </Link>
          ),
        })),
      }
      // </SubMenu>
    );
  });

  return (
    <Drawer className={styles.drawer} width={360} onClose={onClose} visible={visible}>
      <Space direction="vertical" className={styles.authWrap}>
        <Button onClick={() => {}} block>
          Login
        </Button>
        <Button onClick={() => {}} block>
          Register
        </Button>
      </Space>

      <Menu
        activeKey={pathname === '/' ? undefined : pathname}
        mode="inline"
        className={styles.menu}
        onClick={onClose}
        items={items}
      />
      <Divider />
      <div className={styles.menuStandalone}>
        <LanguageSelect desktop={false} />
      </div>
    </Drawer>
  );
};

const Mobile = () => {
  const [openNavigator, setOpenNavigator] = useState(false);

  const user = false;

  const toggleOpenNavigator = () => {
    setOpenNavigator(!openNavigator);
  };

  return (
    <>
      <Header className={styles.header}>
        <Link href={routes.home} passHref>
          {/* <a>
            <img src="/images/logo.svg" alt="logo" className={styles.logo} />
          </a> */}
          <a>
            <Space>
              <Avatar />
              Dealing System
            </Space>
          </a>
        </Link>

        <Space align="center">
          {!user && <AccountDropdown />}
          <Button
            onClick={toggleOpenNavigator}
            className={styles.menuButton}
            type="text"
            icon={<div className={styles.burgerMenu} />}
          />
        </Space>
      </Header>
      <NavigatorDrawer visible={openNavigator} onClose={toggleOpenNavigator} />
    </>
  );
};

export default Mobile;
