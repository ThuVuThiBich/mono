import { FC } from 'react';
import dynamic from 'next/dynamic';

const AccountInformation = dynamic(() => import('./AccountInformation'), { ssr: false });

const AccountLeftComponent: FC = () => {
  return (
    <div>
      <AccountInformation />
    </div>
  );
};

export default AccountLeftComponent;
