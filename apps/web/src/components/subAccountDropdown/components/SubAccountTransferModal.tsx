import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './SubAccountTransferModal.module.less';

import { Divider, Form, message } from 'antd';

import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';

import { useAppDispatch, useAppSelector } from 'hooks';
import { transferBetweenSub, useSubAccountsQuery } from 'api/sub_account';

import { getCurrentSubAccount, MAIN_ACCOUNT_KEY, setModalTransfer } from 'store/ducks/sub_account/slice';
import { Trans } from 'next-i18next';
import { formatNumber } from 'utils/number';
import { useSubAccountWallet } from 'api/wallet';
import BigNumber from 'bignumber.js';
import { currencyImgs } from 'assets/images/currency';
import { useMutation } from 'react-query';
import { Undefined } from 'types/util-types';
import { TError } from 'api/types';
import { STABLE_COIN } from 'modules/WalletPage/constants';
import { Avatar, Button, InputNumberWithLabel, InputSlider, Modal, Option, SelectWithLabel } from '@cross/ui';

const SubAccountTransferModal: FC = () => {
  const { t } = useTypeSafeTranslation();
  const [form] = Form.useForm();
  const visible = useAppSelector((state) => state.subAccount.visibleModalTransfer);
  const dispatch = useAppDispatch();
  const [sourceAccount, setSourceAccount] = useState<Undefined<string>>();

  const { data: subAccounts, isLoading } = useSubAccountsQuery();

  const currentSubAccount = useAppSelector(getCurrentSubAccount);

  useEffect(() => {
    const mainAcc = currentSubAccount === MAIN_ACCOUNT_KEY ? subAccounts?.find((x) => !x.parentAccountId) : null;
    const currentSubAccountId = mainAcc ? mainAcc?.accountId : currentSubAccount;
    setSourceAccount(currentSubAccountId);
    form.setFieldsValue({ source: currentSubAccountId });
  }, [currentSubAccount, subAccounts, visible]);

  const {
    data: walletCoin,
    isLoading: loadingCoin,
    refetch: refetchWalletData,
  } = useSubAccountWallet(String(sourceAccount), {
    enabled: !!sourceAccount,
    select: (data) => {
      return {
        ...data,
        coins: data.coins.filter((x) => x.coinType !== 'XCR_BURN' && !STABLE_COIN.includes(x.coinType)),
      };
    },
  });

  const [coin, setCoin] = useState('BTC');

  const { mutate: mutateTransferSub, isLoading: transferLoading } = useMutation(transferBetweenSub, {
    onSuccess: () => {
      message.success(t('sub_account.transfer.success'));
      handleCloseModal();
    },
    onError: (error: TError) => {
      message.error(t(error.msg_code as any, { ns: 'error' }));
    },
  });

  // Reset form State
  useEffect(() => {
    if (!visible) {
      form.resetFields();
    } else {
      form.setFieldsValue({ coin: visible.coin || 'BTC' });
      setCoin(visible.coin || 'BTC');
    }
  }, [visible]);
  useEffect(() => {
    refetchWalletData();
  }, [coin]);
  // Handler
  const handleCloseModal = () => dispatch(setModalTransfer(false));
  const handleChangeCoin = useCallback((value: any) => {
    setCoin(value);
  }, []);

  const handleChangeSourceAccount = useCallback((value) => {
    setSourceAccount(value);
  }, []);

  const handleSubmit = async (formData: any) => {
    const payload = {
      coin: formData.coin,
      sourceAccount: formData.source,
      targetAccount: formData.target,
      amount: formData.amount,
    };
    mutateTransferSub(payload);
  };

  // Data renderer
  const coinSelected = useMemo(() => {
    return walletCoin?.coins.find((x) => x.coinType === coin);
  }, [coin, walletCoin]);

  const maxAmount = useMemo(() => {
    return new BigNumber(coinSelected?.number as string).toNumber();
  }, [coin, walletCoin, coinSelected]);

  return (
    <>
      <Modal maskClosable={false} centered width={500} visible={!!visible} onCancel={handleCloseModal}>
        <div className={styles.header}>
          <img alt="exchange" src="/images/svgs/exchange-duotone.svg" />
          <h1 className="uppercase">
            {/* <Trans i18nKey="sub_account.transfer.title" t={t as any} components={[<span className="blue" key="1" />]} /> */}
            TRANSFER <span className="primary">BETWEEN</span> WALLETS
          </h1>
        </div>
        <Divider className={styles.divider} />

        <div className={styles.body}>
          <Form onFinish={handleSubmit} name="transfer_subaccount" form={form}>
            <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.target !== curValues.target}>
              {() => (
                <Form.Item name="source" rules={[{ required: true }]}>
                  <SelectWithLabel
                    onChange={handleChangeSourceAccount}
                    loading={isLoading}
                    label={<SelectLabel label="From" />}
                  >
                    {subAccounts
                      ?.filter((x) => x.accountId !== form.getFieldValue('target'))
                      ?.map((acc) => (
                        <Option key={acc.accountId} value={acc.accountId}>
                          {!!acc.parentAccountId ? acc.nickName : 'Main Account'}
                        </Option>
                      ))}
                  </SelectWithLabel>
                </Form.Item>
              )}
            </Form.Item>

            <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.source !== curValues.source}>
              {() => (
                <Form.Item name="target" rules={[{ required: true }]}>
                  <SelectWithLabel loading={isLoading} label={<SelectLabel label="To" />}>
                    {subAccounts
                      ?.filter((x) => x.accountId !== form.getFieldValue('source'))
                      ?.map((acc) => (
                        <Option key={acc.accountId} value={acc.accountId}>
                          {!!acc.parentAccountId ? acc.nickName : 'Main Account'}
                        </Option>
                      ))}
                  </SelectWithLabel>
                </Form.Item>
              )}
            </Form.Item>

            <Form.Item name="coin" noStyle>
              <SelectWithLabel
                loading={loadingCoin}
                onChange={handleChangeCoin}
                value={coin}
                label="Coin"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  return String(option?.value)?.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {walletCoin?.coins?.map((item) => (
                  <Option value={item.coinType} key={item.coinType}>
                    <Avatar type="secondary" src={currencyImgs[item.coinType] || currencyImgs.GENERIC} size={22} />{' '}
                    {item.coinType}
                  </Option>
                ))}
              </SelectWithLabel>
            </Form.Item>

            <div className={styles.available}>
              <div>
                <img src="/images/svgs/wallet-disabled.svg" alt="" />
                Available
              </div>
              <div>
                {formatNumber(coinSelected?.number as string, 8)}
                <span>{coinSelected?.coinType}</span>
              </div>
            </div>

            <Form.Item
              name="amount"
              rules={[
                {
                  required: true,
                  validator: async (_: any, value: number) => {
                    if (!value) {
                      return Promise.reject(new Error(t('sub_account.transfer.amount_required')));
                    }
                    if (Number(value) === 0) {
                      return Promise.reject(new Error(t('sub_account.transfer.greate_zero')));
                    }
                    if (Number(value) > Number(coinSelected?.number)) {
                      return Promise.reject(new Error(t('stake.insufficient_balance')));
                    }
                    return Promise.resolve('');
                  },
                },
              ]}
            >
              <InputNumberWithLabel
                id="amount"
                label="Amount"
                onValueChange={(values) => {
                  form.setFieldsValue({
                    amount: values.value,
                    slider: (Number(values.value) * 100) / maxAmount,
                  });
                }}
                decimalScale={8}
                prefix={coinSelected?.coinType ?? coin ?? 'BTC'}
              />
            </Form.Item>
            <Form.Item name="slider" noStyle>
              <InputSlider
                handleChange={(value: number) => {
                  form.setFieldsValue({
                    slider: (value / maxAmount) * 100,
                    amount: value.toString(),
                  });
                }}
                handle="black"
                maxValue={maxAmount}
              />
            </Form.Item>
            <Form.Item className='f-center'>
              <Button loading={transferLoading} htmlType="submit" type="info" className={styles.btnSubmit}>
                Transfer
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

const SelectLabel: FC<{ label: string }> = ({ label }) => (
  <div className={styles.selectLabel}>
    <img src="/images/svgs/wallet-duotone.svg" alt="wallet" />
    {label}
  </div>
);

export default memo(SubAccountTransferModal);
