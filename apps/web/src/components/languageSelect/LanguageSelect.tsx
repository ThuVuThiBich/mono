import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from '@cross/ui';
import { Menu, Space } from 'antd';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { LANGUAGE } from 'utils/constant';
import type { MenuProps } from 'antd';
interface LanguageSelectProps {
  desktop?: boolean;
}

export const LanguageSelect: FC<LanguageSelectProps> = ({ desktop = true }) => {
  const router = useRouter();
  const { locale } = router;

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  const items = LANGUAGE.map((lang) => ({
    label: desktop ? lang.value : lang.label,
    key: lang.value,
  }));

  const languageMenu = (
    <Menu>
      {LANGUAGE.map((lang) => (
        <Menu.Item key={lang.value} onClick={() => {}}>
          {desktop ? lang.value : lang.label}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={languageMenu}>
      <Space size={8} align="baseline">
        {desktop ? locale : LANGUAGE.find((lang) => lang.value === locale)?.label || 'English'}
        {desktop && <DownOutlined />}
      </Space>
    </Dropdown>
  );
};
