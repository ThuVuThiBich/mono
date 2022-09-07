import { Button, InputWithLabel, Modal } from '@cross/ui';
import { Form, message } from 'antd';
import { changeNameSubAcc, useSubAccountsQuery } from 'api/sub_account';
import { useAppDispatch, useAppSelector, useTypeSafeTranslation } from 'hooks';
import { FC, memo, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { setModalEdit } from 'store/ducks/sub_account/slice';
import { subAccountNameRule } from 'utils/validator';
import styles from './SubAccountModalEdit.module.less';

interface ISubAccountModalEditProps {}

const SubAccountModalEdit: FC<ISubAccountModalEditProps> = ({}) => {
  const { t } = useTypeSafeTranslation();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { data: subAccounts } = useSubAccountsQuery();
  const visibleData = useAppSelector((state) => state.subAccount.visibleModalEdit);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!visibleData) return;
    form.setFieldsValue({
      name: visibleData.nickName,
    });
  }, [visibleData]);

  const { mutate: mutateChangeName, isLoading } = useMutation(changeNameSubAcc, {
    onSuccess: () => {
      message.success('Update Successfully!');
      queryClient.invalidateQueries('/subAccount/getSubAccounts');
      dispatch(setModalEdit(undefined));
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const handleSubmit = (formData: any) => {
    if (visibleData?.nickName === formData.name) {
      dispatch(setModalEdit(undefined));
      return;
    }
    mutateChangeName({ subAccountId: visibleData?.accountId as string, subAccountName: formData.name });
  };

  return (
    <Modal centered visible={!!visibleData?.accountId} onCancel={() => dispatch(setModalEdit(undefined))} maskClosable>
      <div className="uppercase bold">
        {/* <Trans
          i18nKey="sub_account.update.title"
          t={t as any}
          values={{ name: visibleData?.nickName }}
          components={[<span className="success" key={1} />]}
        /> */}
        UPDATE <span className="primary">{visibleData?.nickName}</span>
      </div>

      <div className={styles.divider} />

      <Form name="update_sub_account" onFinish={handleSubmit} form={form}>
        <div className={styles.body}>
          <Form.Item
            name="name"
            rules={[
              { required: true, whitespace: true },
              {
                async validator(_, value) {
                  if (value === visibleData?.nickName) return Promise.resolve('');
                  return await subAccountNameRule(value, subAccounts as any[], t as any);
                },
              },
            ]}
          >
            <InputWithLabel label="Name" />
          </Form.Item>
        </div>
        <div className="f-center">
          <Button htmlType="submit" className={styles.btnSubmit} type="secondary" loading={isLoading}>
            Update
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default memo(SubAccountModalEdit);
