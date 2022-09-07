import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './ConvertModal.module.less';
import { Avatar, InputNumberWithLabel, InputSlider, Modal, Option } from '@cross/ui';

import { Divider, Form, message, Spin } from 'antd';

import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import { SelectWithLabel } from '@cross/ui';
import { currencyImgs } from 'assets/images/currency';
import { useCoinConvertList, useConvertCoinInfo, useWalletQuery } from 'api/wallet';
import { ArrowDownOutlined } from '@ant-design/icons';

import { Trans } from 'next-i18next';

import { formatNumber } from 'utils/number';
import BigNumber from 'bignumber.js';
import { Button } from '@cross/ui';
import { Surface } from '@cross/ui';
import { useMutation, useQueryClient } from 'react-query';
import { convertCoinRequest } from 'api/wallet/request';
import { TError } from 'api/types';
import numeral from 'numeral';
import { RedoOutlined } from '@ant-design/icons';
import bigDecimal from 'js-big-decimal';

interface IConvertModalProps {
  visible: boolean;
  onClose: () => void;
  initCoin?: string;
}

const ConvertModal: FC<IConvertModalProps> = ({ initCoin, visible, onClose }) => {
  const { t } = useTypeSafeTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [fromCoin, setFromCoin] = useState(initCoin);
  const [toCoin, setToCoin] = useState(initCoin === 'BTC' ? 'ETH' : 'BTC');
  const [amount, setAmount] = useState<String>();
  const { data: listConvertCoin } = useCoinConvertList();

  const [showRefresh, setShowRefresh] = useState(false);

  const { mutate, isLoading } = useMutation(convertCoinRequest, {
    onSuccess: () => {
      message.success(t('walletpage.convert.success'));
      queryClient.invalidateQueries('/bb/asset/show');
      onClose();
    },
    onError: (err: TError) => {
      message.error(t(err.msg_code as any, { ns: 'error' }));
    },
  });

  const { data, isFetching, refetch } = useConvertCoinInfo(
    { fromCoin: String(fromCoin), toCoin, fromCoinNumber: amount },
    { enabled: !!fromCoin && !!toCoin && !!amount }
  );

  const { data: walletCoin, isLoading: loadingCoin } = useWalletQuery({
    select: (data) => {
      return {
        ...data,
        coins: data.coins.filter((x) => !x.coinType.includes('XCR') && x.coinType !== 'RIGHTS'),
      };
    },
  });

  const handleSubmit = () => {
    mutate({ fromCoin: String(fromCoin), toCoin, fromCoinNumber: amount });
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setShowRefresh(true);
    }, 15000);
    return () => {
      clearTimeout(timeOut);
    };
  }, [isFetching]);

  const handleRefresh = () => {
    refetch();
    setShowRefresh(false);
  };

  const handleChangeFromCoin = useCallback((value: any) => {
    setFromCoin(value);
  }, []);
  const handleChangeToCoin = useCallback((value: any) => {
    setToCoin(value);
  }, []);

  const toggleFromToCoin = useCallback(() => {
    if (fromCoin) {
      setToCoin(fromCoin);
    }
    setFromCoin(toCoin);
    form.setFields([
      { name: 'toCoin', value: fromCoin },
      { name: 'fromCoin', value: toCoin },
    ]);
  }, [fromCoin, toCoin]);

  // Data renderer
  const fromCoinInfo = useMemo(() => {
    return walletCoin?.coins.find((x) => x.coinType === fromCoin);
  }, [fromCoin, walletCoin]);

  const maxAmount = useMemo(() => {
    return new BigNumber(fromCoinInfo?.number as string).toNumber();
  }, [fromCoin, walletCoin, fromCoinInfo]);

  const datasets = useMemo(() => {
    if (!listConvertCoin) return { fromCoin: [], toCoin: [] };

    return {
      fromCoin: listConvertCoin?.filter((x) => x !== toCoin),
      toCoin: listConvertCoin?.filter((x) => x !== fromCoin),
    };
  }, [listConvertCoin, fromCoin, toCoin]);

  return (
    <>
      <Modal maskClosable={false} centered width={500} visible={!!visible} onCancel={onClose}>
        <div className={styles.header}>
          <img alt="exchange" width={24} height={24} src="/images/wallet/convert.svg" />
          <h1>
            {/* <Trans
              i18nKey="walletpage.convert.title"
              t={t as any}
              values={{
                from: fromCoin,
                to: toCoin,
              }}
              components={[<span className="blue" key="1" />]}
            /> */}
            CONVERT FROM <span className="primary">{fromCoin}</span> TO <span className="primary">{toCoin}</span>
          </h1>
        </div>
        <Divider className={styles.divider} />

        <div className={styles.body}>
          <Form
            onFinish={handleSubmit}
            name="convert_form"
            initialValues={{ fromCoin: initCoin, toCoin: toCoin }}
            form={form}
          >
            <div className="relative w-100">
              <Form.Item name="fromCoin">
                <SelectWithLabel
                  loading={loadingCoin}
                  onChange={handleChangeFromCoin}
                  value={fromCoin}
                  label="From Coin"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    return String(option?.value)?.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {datasets.fromCoin.map((item) => (
                    <Option value={item} key={item}>
                      <Avatar type="secondary" src={currencyImgs[item] || currencyImgs.GENERIC} size={22} /> {item}
                    </Option>
                  ))}
                </SelectWithLabel>
              </Form.Item>{' '}
              <div onClick={toggleFromToCoin} className={styles.btnExchange}>
                <ArrowDownOutlined />
              </div>
              <Form.Item name="toCoin">
                <SelectWithLabel
                  loading={loadingCoin}
                  onChange={handleChangeToCoin}
                  value={toCoin}
                  label="To Coin"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    return String(option?.value)?.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {datasets.toCoin.map((item) => (
                    <Option value={item} key={item}>
                      <Avatar type="secondary" src={currencyImgs[item] || currencyImgs.GENERIC} size={22} /> {item}
                    </Option>
                  ))}
                </SelectWithLabel>
              </Form.Item>
            </div>
            <div className={styles.available}>
              <div>
                <img src="/images/svgs/wallet-disabled.svg" alt="" />
                Available
              </div>
              <div>
                {formatNumber(fromCoinInfo?.number as string, 8)}
                <span>{fromCoinInfo?.coinType}</span>
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
                    if (Number(value) > Number(fromCoinInfo?.number)) {
                      return Promise.reject(new Error(t('stake.insufficient_balance')));
                    }
                    return Promise.resolve('');
                  },
                },
              ]}
              help={data?.coinSendUserSubRate === '0.00000000' ? t('walletpage.convert.amount_small') : undefined}
            >
              <InputNumberWithLabel
                id="amount"
                label="Amount"
                onValueChange={(values: any) => {
                  form.setFieldsValue({
                    amount: values.value,
                    slider: (Number(values.value) * 100) / maxAmount,
                  });
                  setAmount(values.value);
                  setShowRefresh(false);
                }}
                decimalScale={8}
                prefix={fromCoinInfo?.coinType || 'BTC'}
                // isAllowed={({ floatValue }: any) => {
                //   if (!floatValue) return true;
                //   return floatValue <= 999999999999999;
                // }}
              />
            </Form.Item>
            <Form.Item name="slider">
              <InputSlider
                handleChange={(value: number) => {
                  form.setFieldsValue({
                    slider: (value / maxAmount) * 100,
                    amount: new bigDecimal(value).getValue(),
                  });
                  setAmount(value.toString());
                }}
                handle="black"
                maxValue={maxAmount}
              />
            </Form.Item>
            {amount !== undefined && (
              <Spin spinning={isFetching}>
                <Surface borderMd className={styles.infoBox}>
                  {showRefresh && !!amount && amount !== '0' && (
                    <div onClick={handleRefresh} className={styles.refreshBox}>
                      <RedoOutlined />
                    </div>
                  )}
                  <div className="f-between">
                    <span className="disabled-4">Cost</span>
                    <span className="text-16 avenir">
                      {formatNumber(amount || 0, 8)} {fromCoin}
                    </span>
                  </div>

                  <div className="f-between">
                    <span className="disabled-4">{toCoin} Price:</span>
                    <span className="text-16 avenir">{formatNumber(data?.toCoinPrice, 8)}</span>
                  </div>

                  <div className="f-between">
                    <span className="disabled-4">Fee: </span>
                    <span className="text-16 avenir">
                      {data?.feeDisplay} {toCoin}
                    </span>
                  </div>

                  <div className="f-between">
                    <span className="disabled-4">Rate: </span>
                    <span className="text-16 avenir">
                      {numeral(Number(data?.rateConfig || 0) * 100).format('0.[00000000]')}%
                    </span>
                  </div>

                  <Divider className={styles.divider} />
                  <div className="f-between">
                    <span className="disabled-4">Proceed: </span>
                    <span className="text-16 avenir">
                      {formatNumber(data?.coinSendUserSubRate, 8)} {toCoin}
                    </span>
                  </div>
                </Surface>
              </Spin>
            )}
            <div className={styles.submitWrapper}>
              <Button onClick={onClose} disabled={isLoading} type="error">
                Cancel
              </Button>

              <Button
                disabled={showRefresh || Number(data?.coinSendUserSubRate) === 0 || !data?.coinSendUserSubRate}
                loading={isLoading}
                htmlType="submit"
                type="info"
              >
                Convert
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ConvertModal;
