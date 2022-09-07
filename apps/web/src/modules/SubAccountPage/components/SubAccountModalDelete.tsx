import { Button, Modal, Surface } from '@cross/ui';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message, Space } from 'antd';
import { deleteSubAccount } from 'api/sub_account';
import { useAppDispatch, useAppSelector } from 'hooks';
import { FC, memo } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  getCurrentSubAccount,
  MAIN_ACCOUNT_KEY,
  setCurrentSubAccount,
  setModalDelete
} from 'store/ducks/sub_account/slice';
import styles from './SubAccountModalDelete.module.less';

export interface ISubAccountModalDeleteProps {}

export const SubAccountModalDelete: FC<ISubAccountModalDeleteProps> = () => {
  const dispatch = useAppDispatch();
  const visibleModalDelete = useAppSelector((state) => state.subAccount.visibleModalDelete);
  const currentSubAccont = useAppSelector(getCurrentSubAccount);
  const queryClient = useQueryClient();

  const { mutateAsync: mutateDeleteSubAccount, isLoading } = useMutation(deleteSubAccount, {
    onSuccess: (_, variable) => {
      // Change to Main account if delete current subacount
      if (variable.deleteAccountId === currentSubAccont) {
        dispatch(setCurrentSubAccount(MAIN_ACCOUNT_KEY));
      }

      queryClient.invalidateQueries('/subAccount/getSubAccounts');
      message.success('Delete Successfully!');
      dispatch(setModalDelete(undefined));
    },
    onError: (error: any) => {
      if (error.data) {
        message.error('Delete Failed!');
      } else {
        message.error(error.message);
      }
    },
  });

  const handleSubmit = async () => {
    let requestDelete = {
      deleteAccountId: visibleModalDelete?.accountId as string,
    };
    await mutateDeleteSubAccount(requestDelete);
    dispatch(setModalDelete(undefined));
  };

  return (
    <Modal centered visible={!!visibleModalDelete?.accountId} onCancel={() => dispatch(setModalDelete(undefined))}>
      <div className="uppercase bold">
        <span>DELETE</span>&nbsp;
        <span>THE SUBACCOUNT</span>
      </div>

      <div className={styles.divider} />

      <Surface className={styles.alert} borderLess>
        <Space size={22}>
          <FontAwesomeIcon color="#9AA3A7" icon={faQuestionCircle} />
          <div className="text-12">
            Are you sure you want to delete the subaccount
            <span className="error">&nbsp;{visibleModalDelete?.nickName}</span>
          </div>
        </Space>
      </Surface>

      <p>
        Make sure you have no open orders in your subaccount. Any balances in the subaccount will be transferred to your
        main account.
      </p>
      <div className="f-center">
        <Button className={styles.btnSubmit} type="sell" loading={isLoading} onClick={handleSubmit}>
          Yes, Delete it
        </Button>
      </div>
    </Modal>
  );
};

export default memo(SubAccountModalDelete);
