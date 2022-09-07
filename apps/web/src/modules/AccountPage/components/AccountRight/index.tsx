import { FC } from 'react';

import AccountSetup from './AccountSetup';
import Limit from './Limit';

const AccountRightComponent: FC = () => {
  return (
    <div>
      <AccountSetup />
      <Limit />
    </div>
  );
};

export default AccountRightComponent;
