import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './WithdrawModal.module.less';
import { Col, Divider, message, Row, Space } from 'antd';
import {
  Avatar,
  Button,
  InputNumberWithLabel,
  InputSlider,
  InputWithLabel,
  Modal,
  Option,
  SelectWithLabel,
  Surface,
} from '@cross/ui';
import { useSubAccountsQuery } from 'api/sub_account';
import { useChainSupport, useStableCoinInfo, useWalletQuery } from 'api/wallet';
import { ISendWithdrawEmailParams } from 'api/wallet/types';
import { currencyImgs } from 'assets/images/currency';
import BigNumber from 'bignumber.js';
import { useAppDispatch, useAppSelector } from 'hooks';
import bigDecimal from 'js-big-decimal';
import { getCurrentSubAccount, MAIN_ACCOUNT_KEY, setCurrentSubAccount } from 'store/ducks/sub_account/slice';
import { HIDE_COIN_WITHDRAW } from 'utils/config';
import { formatNumber, nDecimalFormat } from 'utils/number';
import { NUMBER_ROUND } from '../../constants';
import { ADDRESS_WARNING, getNetworkInfo, needMemoChain, WITHDRAW_COIN_NEED_ADDRESS_WARNING } from '../constants';
import MFAModal from './MFAModal';

interface IWithdrawModalProps {
  visible: boolean;
  onClose: () => void;
  initCoin?: string;
}

const COIN_PRECISION = 8;

const WithdrawModal: FC<IWithdrawModalProps> = ({ initCoin, visible, onClose }) => {
  const dispatch = useAppDispatch();
  const currentSubaccount = useAppSelector(getCurrentSubAccount);

  const { data: stableCoins } = useStableCoinInfo();

  const {
    data: walletCoin,
    isLoading: loadingCoin,
    refetch: refetchWalletData,
  } = useWalletQuery({
    select: (data) => {
      return { ...data, coins: data.coins.filter((x) => !x.coinType.includes('XCR') && x.coinType !== 'RIGHTS') };
    },
  });
  const { data: subAccounts, isLoading: loadingSubAccount } = useSubAccountsQuery({
    select: (data) => data?.filter((x) => !!x.parentAccountId),
  });

  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [memo, setMemo] = useState('');
  const [coin, setCoin] = useState((initCoin === 'USD' ? 'USDC' : initCoin) ?? 'BTC');
  const [amount, setAmount] = useState({ slider: 0, input: '' });
  const [openMFAModal, setOpenMFAModal] = useState<ISendWithdrawEmailParams | null>(null);

  const { data: chains, isLoading: loadingNetwork } = useChainSupport(coin, {
    enabled: !!coin,
  });

  useEffect(() => {
    if (!chains) return setNetwork('');
    setNetwork(Object.keys(chains)[0] || '');
  }, [chains]);

  const coinSelected = useMemo(() => {
    // Only USD coin
    if (initCoin === 'USD') {
      let USDInfo = { ...walletCoin?.coins.find((x) => x.coinType === 'USD') };
      if (USDInfo) USDInfo.coinType = coin;
      return USDInfo;
    }
    return walletCoin?.coins.find((x) => x.coinType === coin);
  }, [coin, walletCoin, initCoin]);

  const maxAmount = useMemo(() => {
    return new BigNumber(coinSelected?.number as string).toNumber();
  }, [coin, walletCoin, coinSelected]);

  const minAmount = useMemo(() => {
    if (!chains || !chains[network]) return 0;
    return chains[network].min;
  }, [chains, network]);

  const decimal = useMemo(() => {
    if (!chains || !chains[network]) return COIN_PRECISION;
    return chains[network].decimals;
  }, [chains, network]);

  const fee = useMemo(() => {
    if (!chains || !chains[network]) return 0;
    return chains[network].fee;
  }, [chains, network]);

  const handleSubAccountChange = useCallback((value: any) => {
    dispatch(setCurrentSubAccount(value));
    refetchWalletData();
  }, []);
  const handleChangeCoin = useCallback((value: any) => {
    setCoin(value);
  }, []);
  const handleChangeAddress = useCallback((e: any) => {
    setAddress(e.target.value);
  }, []);
  const handleNetworkChange = useCallback((value: any) => {
    setNetwork(value);
  }, []);
  const handleMemoChange = useCallback((e: any) => {
    setMemo(e.target.value);
  }, []);

  // Handler
  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setAddress(text);
  };

  const handleSubmit = async () => {
    // Validate stuff
    if (!coin) {
      return message.error('* Please select Coin');
    }
    if (!address) {
      return message.error("* Please enter Recipient's Address");
    }
    if (!network) {
      return message.error('* Please select Network');
    }

    if (Number(amount.input) > Number(coinSelected?.number)) {
      return message.error('* Insufficient balance');
    }

    if (Number(amount.input) < Number(fee || 0)) {
      // return message.error(t(`error:e_WITHDRAW_NUM_LESS_FEE` as any));
      return message.error('The withdrawal amount must be greater than or equal to the fee');
    }

    if (Number(amount.input) < Number(minAmount)) {
      return message.error(`* Minimum Withdrawal Amount: ${minAmount || 0} ${coin}`);
    }

    setOpenMFAModal({
      coin: coin,
      number: amount.input,
      'target-address': address,
      memo: memo,
      chain: network,
      'lang-type': 1,
      '2fa-code': '',
      'email-code': '',
    });
  };

  const networkInfo = useMemo(() => {
    return getNetworkInfo(network);
  }, [network]);

  const coinDataset = useMemo(() => {
    const filterUSDCoin =
      walletCoin?.coins
        .filter((x) => x.coinType !== 'USD' && !HIDE_COIN_WITHDRAW.includes(x.coinType))
        .map((coin) => coin.coinType) || [];

    if (stableCoins) return [...filterUSDCoin, ...stableCoins];
    return filterUSDCoin;
  }, [walletCoin, initCoin, stableCoins]);

  const receiveAmount = useMemo(() => {
    if (Number(amount.input) > 99999999999999999) {
      return Math.max(0, new BigNumber(amount.input || 0).minus(new BigNumber(fee || 0)).toNumber());
    }
    return formatNumber(Math.max(0, new BigNumber(amount.input || 0).minus(Number(fee || 0)).toNumber()), 8);
  }, [amount, fee]);

  // const isErrorAddress = useMemo(() => {
  //   if (coin !== 'AVAX') return false;
  //   const regex = /^0x[a-fA-F0-9]{40}$/;
  //   if (regex.test(address) || address === '') {
  //     return false;
  //   }
  //   return true;
  // }, [coin, address]);

  return (
    <>
      <Modal maskClosable={false} centered width={500} visible={visible && !openMFAModal} onCancel={onClose}>
        <div className={styles.header}>
          <img alt="earn" src="/images/svgs/wallet-withdraw.svg" />
          <h1 className="uppercase">WITHDRAW</h1>
        </div>
        <Divider className={styles.divider} />

        <div className={styles.body}>
          <div className={styles.form}>
            <SelectWithLabel
              loading={loadingSubAccount}
              onChange={handleSubAccountChange}
              value={currentSubaccount}
              label={
                <div className={styles.selectLabel}>
                  <img src="/images/svgs/wallet-duotone.svg" alt="" />
                  Wallet
                </div>
              }
            >
              <Option value={MAIN_ACCOUNT_KEY} key={MAIN_ACCOUNT_KEY}>
                Main Account
              </Option>
              {subAccounts?.map((sub) => (
                <Option value={sub.accountId} key={sub.accountId}>
                  {sub.nickName}
                </Option>
              ))}
            </SelectWithLabel>

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
              {coinDataset?.map((coin) => (
                <Option value={coin} key={coin}>
                  <Avatar type="secondary" src={currencyImgs[coin] || currencyImgs.GENERIC} size={22} /> {coin}
                </Option>
              ))}
            </SelectWithLabel>

            <div className={styles.available}>
              <div>
                <img src="/images/svgs/wallet-disabled.svg" alt="" />
                Available
              </div>
              <div>
                {nDecimalFormat(coinSelected?.number as string, NUMBER_ROUND)}
                <span>{coinSelected?.coinType}</span>
              </div>
            </div>

            <InputNumberWithLabel
              id="amount"
              label="Amount"
              value={amount.input}
              onValueChange={(values: any) => {
                setAmount({
                  input: values.value,
                  slider: (Number(values.value) * 100) / maxAmount,
                });
              }}
              decimalScale={decimal}
              prefix={coinSelected?.coinType || 'BTC'}
            />

            <InputSlider
              value={amount.slider}
              handleChange={(value: number) => {
                setAmount({
                  slider: (value / maxAmount) * 100,
                  input: new bigDecimal(value).getValue(),
                });
              }}
              handle="black"
              maxValue={maxAmount}
            />
          </div>

          <div className={styles.addressLabel}>
            Address &nbsp;
            {/* {isErrorAddress && <span className="primary">({t('walletpage.avax_warning')})</span>} */}
          </div>
          <div className={styles.addressWrap}>
            <InputWithLabel
              value={address}
              onChange={handleChangeAddress}
              surfaceClassName={styles.inputAddress}
              placeholder="Recipient's Address"
              suffix={
                <div className={styles.inputSuffix}>
                  <Button onClick={handlePaste} type="primary" size="small">
                    Paste
                  </Button>
                </div>
              }
            />
            <SelectWithLabel
              value={network}
              onChange={handleNetworkChange}
              className={styles.networkSelect}
              placeholder="Choose Network"
              label="Network"
              loading={loadingNetwork}
            >
              {chains &&
                Object.keys(chains)?.map((item) => (
                  <Option key={item} value={item}>
                    <span>{getNetworkInfo(item).label}</span>
                  </Option>
                ))}
            </SelectWithLabel>
            {needMemoChain.includes(network) && (
              <InputWithLabel
                value={memo}
                onChange={handleMemoChange}
                surfaceClassName={styles.memoInput}
                label="Memo"
                placeholder="Optional"
              />
            )}
          </div>

          <Surface forceDark borderMd className={styles.warningBox}>
            {network === 'avax' && WITHDRAW_COIN_NEED_ADDRESS_WARNING.includes(String(coinSelected?.coinType)) && (
              <Space className={styles.mb19} size={18}>
                <img src="/images/svgs/exclamation-error.svg" alt="exclamation" />
                <span className="text-12 disabled-4">
                  {/* <Trans
                    i18nKey="walletpage.usd_withdraw_warning"
                    components={[<span className="primary" key="0" />]}
                    values={{
                      coin: String(coinSelected?.coinType),
                      address: ADDRESS_WARNING[String(coinSelected?.coinType)],
                    }}
                  /> */}
                  Please ensure you are withdrawing <span className="primary">{String(coinSelected?.coinType)}</span>{' '}
                  tokens under the contract address ending in{' '}
                  <span className="primary">{ADDRESS_WARNING[String(coinSelected?.coinType)]}</span>.
                </span>
              </Space>
            )}

            <Space className={styles.mb19} size={18}>
              <img src="/images/svgs/exclamation-warning.svg" alt="exclamation" />
              <span className="text-12 disabled-4">
                {/* <Trans
                  i18nKey="walletpage.withdraw.warning"
                  t={t as any}
                  values={{
                    coin: coinSelected?.coinType,
                    network: networkInfo.label ?? '...',
                  }}
                  components={[<span className="primary" key="1" />, <span className="primary" key="1" />]}
                /> */}
                Make sure this is a <span className="primary">{coinSelected?.coinType}</span> address <br /> Make sure{' '}
                <span className="primary">{networkInfo.label ?? '...'}</span> Network complies
              </span>
            </Space>

            <Row>
              <Col xs={24} md={13}>
                <Row gutter={[0, 4]}>
                  <Col span={9}>
                    <span className="text-10 disabled ">Expected Arrival</span>
                  </Col>
                  <Col span={15}>
                    <span className="text-12 bolder avenir ">{networkInfo.arrive}&nbsp;</span>
                    <span className="disabled-4 text-10">Network confirmations</span>
                  </Col>

                  <Col span={9}>
                    <span className="text-10 disabled ">Expected Unlock</span>
                  </Col>
                  <Col span={15}>
                    <span className="text-12 bolder avenir ">{networkInfo.unlock}&nbsp;</span>
                    <span className="disabled-4 text-10">Network confirmations</span>
                  </Col>

                  <Col span={9}>
                    <span className="text-10 disabled ">Min. Withdraw</span>
                  </Col>
                  <Col span={15}>
                    <span className="text-12 bolder avenir">{minAmount || 0}</span>
                    <span className="disabled-4 text-10">&nbsp;{coin}</span>
                  </Col>
                </Row>
              </Col>

              <Col xs={24} md={11}>
                <Space className={styles.feeWrapper} size={0} direction="vertical">
                  <div className={styles.receiptAmountWrapper}>
                    <span className="text-10 disabled ">Received Amount:</span>
                    <div className={styles.receiptAmount}>
                      <span className="bolder text-18 avenir">{receiveAmount}</span>
                      &nbsp;
                      <span className="text-12 normal disabled-4">{coin}</span>
                    </div>
                  </div>

                  <span className="text-10 disabled ">
                    network fee included &nbsp;
                    <span className="disabled-4">
                      {fee || 0} {coin}
                    </span>
                  </span>
                </Space>
              </Col>
            </Row>
          </Surface>
        </div>
        <div className="f-center">
          <Button onClick={handleSubmit} type="primary" className={styles.btnSubmit}>
            Withdraw
          </Button>
        </div>
      </Modal>

      {!!openMFAModal && <MFAModal onFinish={onClose} payload={openMFAModal} onClose={() => setOpenMFAModal(null)} />}
    </>
  );
};

export default WithdrawModal;
