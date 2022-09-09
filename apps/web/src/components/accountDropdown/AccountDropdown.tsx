import { removeCookies } from '@cross/cookies';
import { Avatar, Dropdown } from '@cross/ui';
import { Button as ButtonAntd, Divider, Drawer, Menu, Grid } from 'antd';
import { useUser } from 'api/account';
import { logout } from 'api/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, memo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { USER_COOKIES } from 'utils/constant';
import { accountRoutes } from './routes';
import styles from './styles.module.less';

const { useBreakpoint } = Grid;

interface IDrawerMenu {
  visible: boolean;
  onClose: () => void;
}

const items = accountRoutes.map((route) => (
  <Menu.Item key={route.path}>
    <Link key={route.path} passHref href={route.path}>
      <div className={styles.uppercase}>{route.title}</div>
    </Link>
  </Menu.Item>
));
console.log('item', items);

const UserDrawer: FC<IDrawerMenu> = ({ visible, onClose }) => {
  const { pathname } = useRouter();
  const { mutateAsync: mutateLogout } = useMutation({
    onSuccess() {
      logout();
      removeCookies(USER_COOKIES.userAccessToken);
    },
  });
  return (
    <Drawer className={styles.drawer} width={360} onClose={onClose} visible={visible}>
      <Menu activeKey={pathname === '/' ? undefined : pathname} mode="inline" className={styles.menu} onClick={onClose}>
        {items}
      </Menu>

      <Divider key="divider" />
      <Menu mode="inline" className={styles.menu}>
        <Menu.Item key="logout">
          <div
            onClick={() => {
              mutateLogout();
            }}
          >
            Logout
          </div>
        </Menu.Item>
      </Menu>
    </Drawer>
  );
};

const AccountDropdown: FC = () => {
  const screen = useBreakpoint();
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleOpenDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  const { refetch } = useUser();
  const handleLogout = async () => {
    removeCookies(USER_COOKIES.userAccessToken);
    await refetch();
  };
  const accountMenu = (
    <Menu>
      {accountRoutes.map((account) => (
        <Menu.Item key={account.title}>
          <Link href={account.path}>{account.title}</Link>
        </Menu.Item>
      ))}
      <Menu.Item key="loutout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
  return screen.md ? (
    <Dropdown
      className={styles.accountDropdown}
      overlayClassName={styles.overlayDropdown}
      overlay={accountMenu}
      placement="bottomLeft"
    >
      <div className={styles.accountButton}>
        <ButtonAntd shape="circle" type="text" icon={<Avatar src={''} />} size="middle" />
      </div>
    </Dropdown>
  ) : (
    <div>
      <ButtonAntd onClick={toggleOpenDrawer} shape="circle" type="text" icon={<Avatar src={''} />} size="middle" />
      <UserDrawer visible={openDrawer} onClose={toggleOpenDrawer} />
    </div>
  );
};

export default memo(AccountDropdown);
