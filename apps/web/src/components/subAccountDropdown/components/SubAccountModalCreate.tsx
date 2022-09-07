import { Button, InputWithLabel, Modal, Surface } from '@cross/ui';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, message, Space } from 'antd';
import { createSubAccount, TRequestCreateSub, useSubAccountsQuery } from 'api/sub_account';
import { TError } from 'api/types';
import { useAppDispatch, useAppSelector } from 'hooks';
import { FC, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { setModalCreate } from 'store/ducks/sub_account/slice';
import { subAccountNameRule } from 'utils/validator';
import styles from './SubAccountModalCreate.module.less';

const SubAccountModalCreate: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { visibleModalCreate } = useAppSelector((state) => state.subAccount);
  const [form] = Form.useForm();

  const { data: subAccounts, refetch } = useSubAccountsQuery({ enabled: false });

  useEffect(() => {
    form.resetFields();
  }, [visibleModalCreate]);

  const onCreateSubAccount = (formData: TRequestCreateSub) => {
    mutateCreateSubAccount(formData);
  };

  const { mutate: mutateCreateSubAccount, isLoading } = useMutation(createSubAccount, {
    onSuccess: () => {
      message.success('Create Successfully');
      form.resetFields();
      dispatch(setModalCreate(false));
      refetch();
    },
    onError: (error: TError) => {
      message.error(t(error.msg_code, { ns: 'error' }));
    },
  });

  return (
    <Modal
      centered
      visible={visibleModalCreate}
      onCancel={() => dispatch(setModalCreate(false))}
      maskClosable
      width={403}
    >
      <div className="uppercase bold">
        {/* <span>{t('sub_account.create.title_1')}</span>&nbsp;
        <span className="success">{t('sub_account.create.title_2')}</span>&nbsp;
        <span>{t('sub_account.create.title_3')}</span> */}
        CREATE NEW SUBACCOUNT
      </div>

      <div className={styles.divider} />

      <Surface className={styles.alert} borderLess>
        <Space size={22}>
          <FontAwesomeIcon color="#9AA3A7" icon={faInfoCircle} />
          <small className="text-9">You can separate your Wallets and Orders under different Subaccounts.</small>
        </Space>
      </Surface>

      <Form autoComplete="off" name="create_sub_account" onFinish={onCreateSubAccount} form={form}>
        <Form.Item
          validateFirst
          name="subAccountName"
          rules={[
            { required: true, whitespace: true },
            {
              async validator(_, value) {
                return await subAccountNameRule(value, subAccounts || [], t);
              },
            },
          ]}
        >
          <InputWithLabel id="name" autoFocus placeholder="Subaccount Name" label="Name" />
        </Form.Item>
        <div className="f-center">
          <Button className={styles.btnSubmit} type="buy" loading={isLoading} htmlType="submit">
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default memo(SubAccountModalCreate);
