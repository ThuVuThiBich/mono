import { FC, ReactNode } from 'react';
import styles from './styles.module.less';
import clsx from 'clsx';
import { Space, Typography, Divider } from 'antd';

import Link from 'next/link';
import { routes } from 'types/routes';
import { useRouter } from 'next/router';
import { Avatar } from '@cross/ui';
import { Surface } from '@cross/ui';
import { useMutation, useQueryClient } from 'react-query';
import { logout } from 'api/auth';

const { Text } = Typography;

interface ItemSelectionProps {
  title: ReactNode | 'string';
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
}

const ItemSelection: FC<ItemSelectionProps> = ({ disabled, onClick, title, icon, active }) => (
  <Space
    onClick={() => onClick && onClick()}
    className={clsx(styles.item, styles.itemHover, {
      ['icon-hover']: !disabled,
      ['icon-active']: active,
      [styles.disabled]: disabled,
    })}
    size={16}
    align="center"
  >
    <Text className={clsx(active && 'primary', disabled && 'disabled-3')}>{title}</Text>
    {icon}
  </Space>
);

const items = [
  {
    title: 'Account Management',
    path: routes.accountManagement,
  },
  {
    title: 'Earn Portfolio',
    path: routes.earnings,
  },
  {
    title: 'History',
    path: routes.history,
  },
  {
    title: 'Sub Accounts',
    path: routes.subAccount,
  },
];

const UserSelection: FC = () => {
  const router = useRouter();

  const isActive = (path: string = '') => {
    if (path === router.pathname) {
      return true;
    }
    return false;
  };
  const queryClient = useQueryClient();
  const { mutateAsync: mutateLogout } = useMutation(logout, {
    onSuccess() {
      queryClient.setQueryData('me', undefined);
      router.push(routes.home);
    },
  });
  return (
    <Surface borderMd className={styles.root}>
      <Avatar className={styles.avatar} size={52} />
      <Divider />
      {items.map((item, index) => (
        <Link href={item.path} key={index}>
          <a>
            <ItemSelection active={isActive(item.path)} {...item} title={item.title} />
          </a>
        </Link>
      ))}
      <a onClick={() => mutateLogout()}>
        <ItemSelection active={false} title={<Text type="secondary">Logout</Text>} />
      </a>
    </Surface>
  );
};

export default UserSelection;
