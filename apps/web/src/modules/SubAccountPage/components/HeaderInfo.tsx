import { Button } from '@cross/ui';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Space } from 'antd';
import { useSubAccountsQuery } from 'api/sub_account';
import { useAppDispatch } from 'hooks';
import { FC } from 'react';
import { setModalCreate, setModalTransfer } from 'store/ducks/sub_account/slice';
import styles from './HeaderInfo.module.less';

const HeaderInfo: FC = () => {
  const dispatch = useAppDispatch();
  const { data: subAccounts } = useSubAccountsQuery();

  const handleTransfer = () => {
    dispatch(setModalTransfer(true));
  };
  const handleCreate = () => {
    dispatch(setModalCreate(true));
  };

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <h1>Sub Accounts</h1>
        <div>
          <img src="/images/svgs/asterisk-solid.svg" alt="asterisk" />
          <span className="text-12 disabled-3">
            You can separate your Wallets and Orders under different Subaccounts.
          </span>
        </div>
      </div>

      <Space size={12} className={styles.actions}>
        {(subAccounts || [])?.length > 1 && (
          <Button onClick={handleTransfer} className={styles.btnTransfer}>
            Transfer <img src="/images/svgs/exchange-duotone.svg" alt="exchanges" />
          </Button>
        )}
        <Button onClick={handleCreate} type="primary" className={styles.btnCreate}>
          Create New <FontAwesomeIcon icon={faPlus} />
        </Button>
      </Space>
    </div>
  );
};

export default HeaderInfo;
