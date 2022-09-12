import { Button, InputNumber, Modal, Surface } from '@cross/ui';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, message, Space } from 'antd';
import { setShareRateRequest, useRewardRate } from 'api/referral';
import { TError } from 'api/types';
import { useTypeSafeTranslation } from 'hooks';
import { Trans } from 'next-i18next';
import { FC } from 'react';
import { useMutation } from 'react-query';
import styles from './ShareRateModal.module.less';

export interface ShareRateModalProps {
  className?: string;
  open: boolean;
  onClose: () => void;
}

export const ShareRateModal: FC<ShareRateModalProps> = ({ onClose, open }) => {
  const { t } = useTypeSafeTranslation();
  const [form] = Form.useForm();
  const { data: rewardRate, refetch } = useRewardRate();

  const { mutate, isLoading } = useMutation(setShareRateRequest, {
    onSuccess: () => {
      message.success(t('sub_account.update.update_success'));
      refetch();
      onClose();
    },
    onError: (err: TError) => {
      message.error(t(err?.msg_code as any, { ns: 'error' }));
    },
  });

  const handleSubmit = (value: any) => {
    mutate(Number(value.rate) / 100);
  };

  const maxPercent = Number(rewardRate?.mine || 0.03) * 100;
  return (
    <Modal width={360} centered visible={open} onCancel={onClose}>
      <div className="uppercase bold">
        {/* <Trans
          i18nKey="referral.card.update_commission_ref"
          t={t as any}
          components={[<span className="success" key="1" />]}
        /> */}
      </div>

      <div className={styles.divider} />

      <Surface className={styles.alert} borderLess>
        <Space size={22}>
          <FontAwesomeIcon color="#9AA3A7" icon={faQuestionCircle} />
          <div className="text-12">
            {t('referral.card.your_base_commision')} <b className="success">{maxPercent}%</b>
          </div>
        </Space>
      </Surface>

      <Form onFinish={handleSubmit} form={form}>
        {/* <div className={styles.input}>
          <label className="uppercase">{t('referral.card.mine')}</label>
          <Form.Item noStyle name="mine">
            <InputNumber
              onChange={(value) => {
                form.setFieldsValue({
                  friend: Math.max(maxPercent - value, 0),
                });
              }}
              min={0}
              max={maxPercent}
            />
          </Form.Item>
          <span>%</span>
        </div> */}

        {/* <div className={styles.input}>
          <label className="uppercase nowrap">{t('referral.card.share_rate')}</label>
          <Form.Item name="rate">
            <InputNumber
              onChange={(value) => {
                form.setFieldsValue({
                  mine: Math.max(maxPercent - value, 0),
                });
              }}
              min={0}
              max={maxPercent}
              precision={2}
            />
          </Form.Item>
          <span>%</span>
        </div> */}

        <Form.Item
          rules={[
            {
              validator: async (_, value) => {
                if (!value || Number(value) === 0) {
                  return Promise.resolve('');
                }
                if (Number(value) > maxPercent) {
                  return Promise.reject(t('e_MAXIMUM' as any, { ns: 'error', maxPercent }));
                }
                return Promise.resolve('');
              },
            },
          ]}
          name="rate"
        >
          <InputNumber label={t('referral.card.share_rate')} min={0} precision={2} prefix="%" />
        </Form.Item>

        <Button htmlType="submit" loading={isLoading} className={styles.btnSubmit} type="turqoise">
          {t('common.save')}
        </Button>
      </Form>
    </Modal>
  );
};
