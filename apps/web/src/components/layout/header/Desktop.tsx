import { DownOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Header } from '@cross/ui';
import { Menu, Space } from 'antd';
import { useUser } from 'api/account';
import AccountDropdown from 'components/accountDropdown/AccountDropdown';
import { LanguageSelect } from 'components/languageSelect';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { routes } from 'types/routes';
import { navigationRoutes } from '../routes';
import styles from './Desktop.module.less';
const getNavList = (user: any) => {
  return (
    navigationRoutes
      // filter routes which were required the user login
      .filter((route) => (user ? true : !route.auth))
      .map((route) => {
        if (route.path) {
          return {
            key: route.path,
            label: (
              <Link href={route.path}>
                <a id={route.path}>{route.title}</a>
              </Link>
            ),
          };
        }
        const subMenu = (
          <Menu
            items={route?.subs?.map((sub) => ({
              key: sub.path,
              label: (
                <Link href={sub.path}>
                  <a id={sub.path}>{sub.title}</a>
                </Link>
              ),
            }))}
          />
        );
        return {
          key: route.title,
          label: (
            <Dropdown overlay={subMenu}>
              <a className="cursor">
                <span className="default">{route.title}</span>
                <DownOutlined />
              </a>
            </Dropdown>
          ),
        };
      })
  );
};

const Desktop: FC = () => {
  const router = useRouter();
  const currentPage = router?.pathname.includes('/exchange') ? '/exchange/BTC_USDT' : router.pathname;
  const { user } = useUser();

  return (
    <Header className={styles.header}>
      <div className={styles.navbar}>
        <Link href={routes.home}>
          {/* <a>
            <img src={'/images/logo.svg'} alt="logo" className={styles.logo} />
          </a> */}
          <a>
            <Space>
              <Avatar />
              Dealing System
            </Space>
          </a>
        </Link>
        <Menu
          selectedKeys={[currentPage]}
          activeKey={currentPage}
          mode="horizontal"
          className={styles.menu}
          items={getNavList(user)}
        />
      </div>
      <Space align="center">
        {user ? (
          <AccountDropdown />
        ) : (
          <Space>
            <Button
              onClick={() => {
                router.push(`${routes.login}?redirect=` + currentPage);
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                router.push(routes.register);
              }}
            >
              Register
            </Button>
          </Space>
        )}
        <LanguageSelect />
      </Space>
    </Header>
  );
};
export default Desktop;
