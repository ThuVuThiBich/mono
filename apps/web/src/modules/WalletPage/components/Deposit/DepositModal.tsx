import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './DepositModal.module.less';
import { Avatar, InputWithLabel, Modal } from '@cross/ui';

import { Col, Divider, Popover, Row, Space } from 'antd';

import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import { Option, SelectWithLabel } from '@cross/ui';
import { currencyImgs } from 'assets/images/currency';
import { useChainSupport, useDepositAddress, useStableCoinInfo, useWalletQuery } from 'api/wallet';

import { Trans } from 'next-i18next';
import { getCurrentSubAccount, MAIN_ACCOUNT_KEY, setCurrentSubAccount } from 'store/ducks/sub_account/slice';
import { useAppDispatch, useAppSelector } from 'hooks';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
// import Qrcode from 'qrcode.react';
import { ADDRESS_WARNING, DEPOSIT_COIN_NEED_ADDRESS_WARNING, getNetworkInfo } from '../constants';
import { HIDE_COIN_DEPOSIT } from 'utils/config';
import { Surface } from '@cross/ui';
import { useSubAccountsQuery } from 'api/sub_account';

interface IDepositModalProps {
  visible: boolean;
  onClose: () => void;
  initCoin?: string;
}

const COIN_WITH_MIN_DEPOSIT = ['DOT'];
const CHAIN_WITH_MIN_DEPOSIT = ['polkadot'];

const DepositModal: FC<IDepositModalProps> = ({ initCoin, visible, onClose }) => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const currentSubaccount = useAppSelector(getCurrentSubAccount);
  const [copy] = useCopyToClipboard();

  const { data: stableCoins } = useStableCoinInfo();

  const { data: walletCoin, isLoading: loadingCoin } = useWalletQuery({
    select: (data) => {
      return {
        ...data,
        coins: data.coins.filter((x) => !x.coinType.includes('XCR') && x.coinType !== 'RIGHTS'),
      };
    },
  });
  const { data: subAccounts, isLoading: loadingSubaccount } = useSubAccountsQuery({
    select: (data) => data?.filter((x) => !!x.parentAccountId),
  });

  const [network, setNetwork] = useState('');
  const [coin, setCoin] = useState((initCoin === 'USD' ? 'USDC' : initCoin) ?? 'BTC');
  const { data: chains, isLoading: loadingNetwork } = useChainSupport(coin, {
    enabled: !!coin,
  });

  useEffect(() => {
    if (!chains) return setNetwork('');
    setNetwork(Object.keys(chains)[0]);
  }, [chains]);

  const { data: depositData } = useDepositAddress({ chain: network, coin }, { enabled: !!coin && !!network });

  const coinSelected = useMemo(() => {
    // Only USD coin
    if (initCoin === 'USD') {
      let USDInfo = { ...walletCoin?.coins.find((x) => x.coinType === 'USD') };
      if (USDInfo) USDInfo.coinType = coin;
      return USDInfo;
    }
    return walletCoin?.coins.find((x) => x.coinType === coin);
  }, [coin, walletCoin, initCoin]);

  // Form field change handler
  const handleSubAccountChange = useCallback((value: any) => {
    dispatch(setCurrentSubAccount(value));
  }, []);
  const handleChangeCoin = useCallback((value: any) => {
    setCoin(value);
  }, []);
  const handleNetworkChange = useCallback((value: any) => {
    setNetwork(value);
  }, []);

  const networkInfo = useMemo(() => {
    return getNetworkInfo(network);
  }, [network]);

  const coinDataset = useMemo(() => {
    const filterUSDCoin =
      walletCoin?.coins
        .filter((x) => x.coinType !== 'USD' && !HIDE_COIN_DEPOSIT.includes(x.coinType))
        .map((coin) => coin.coinType) || [];
    if (stableCoins) return [...filterUSDCoin, ...stableCoins];
    return filterUSDCoin;
  }, [walletCoin, initCoin, stableCoins]);

  return (
    <>
      <Modal maskClosable={false} centered width={500} visible={visible} onCancel={onClose}>
        <div className={styles.header}>
          <img alt="earn" src="/images/svgs/wallet-deposit.svg" />
          <h1 className="uppercase">Deposit</h1>
        </div>
        <Divider className={styles.divider} />
        <div className={styles.body}>
          <div className={styles.form}>
            <SelectWithLabel
              loading={loadingSubaccount}
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
              // filterOption={(input, option) => {
              //   return (option?.value).toLowerCase().includes(input.toLowerCase());
              // }}
            >
              {coinDataset?.map((coin) => (
                <Option value={coin} key={coin}>
                  <Avatar type="secondary" src={currencyImgs[coin] || currencyImgs.GENERIC} size={22} /> {coin}
                </Option>
              ))}
            </SelectWithLabel>
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
          </div>
          <div className={styles.addressLabel}>
            Address
            {/* {coin === 'AVAX' && <span className="primary">({t('walletpage.avax_warning')})</span>} */}
          </div>
          <div className={styles.addressWrap}>
            <InputWithLabel
              value={depositData?.address}
              surfaceClassName={styles.inputAddress}
              disabled
              suffix={
                <div className={styles.inputSuffix}>
                  <a onClick={() => copy(depositData?.address as string)}>
                    <img src="/images/svgs/copy-duotone.svg" alt="cpy" />
                  </a>
                  {depositData?.address && (
                    <>
                      <div className={styles.verticalDivider} />
                      <Popover
                        overlayClassName={styles.popover}
                        // content={<Qrcode value={depositData?.address as any} type="text" />}
                      >
                        <a>
                          <img src="/images/svgs/qrcode-duotone.svg" alt="qrcode" />
                        </a>
                      </Popover>
                    </>
                  )}
                </div>
              }
            />
            {depositData?.['special-chain-nom'] && (
              <InputWithLabel
                surfaceClassName={styles.memoInput}
                label="Memo"
                readOnly
                value={depositData?.['special-chain-nom']}
                suffix={
                  <>
                    <div className={styles.verticalDivider} />
                    <div className={styles.inputSuffix}>
                      <a onClick={() => copy(depositData?.['special-chain-nom'] as string)}>
                        <img src="/images/svgs/copy-duotone.svg" alt="cpy" />
                      </a>
                    </div>
                  </>
                }
              />
            )}
          </div>
          <Surface forceDark borderMd className={styles.warningBox}>
            {network === 'avax' && DEPOSIT_COIN_NEED_ADDRESS_WARNING.includes(String(coinSelected?.coinType)) && (
              <Space className={styles.mb19} size={18}>
                <img src="/images/svgs/exclamation-error.svg" alt="exclamation" />
                <span className="text-12 disabled-4">
                  {/* <Trans
                    i18nKey="walletpage.usd_deposit_warning"
                    components={[<span className="primary" key="0" />]}
                    values={{
                      coin: String(coinSelected?.coinType),
                      address: ADDRESS_WARNING[String(coinSelected?.coinType)],
                    }}
                  /> */}
                  Please ensure you are depositing <span className="primary">{String(coinSelected?.coinType)}</span>{' '}
                  tokens under the contract address ending in{' '}
                  <span className="primary">{ADDRESS_WARNING[String(coinSelected?.coinType)]}</span>.
                </span>
              </Space>
            )}

            <Space className={styles.mb19} size={18}>
              <img src="/images/svgs/exclamation-warning.svg" alt="exclamation" />
              <span className="text-12  disabled-4">
                {/* <Trans
                  i18nKey="walletpage.deposit.warning"
                  t={t as any}
                  values={{
                    coin: coinSelected?.coinType,
                    network: networkInfo.label,
                  }}
                  components={[<span className="primary" key="1" />, <span className="primary" key="1" />]}
                /> */}
                Send only <span className="primary">{coinSelected?.coinType}</span> to this address <br /> Make sure you
                send over <span className="primary">{networkInfo.label}</span>
              </span>
            </Space>

            <Row gutter={[0, 4]}>
              <Col span={5}>
                <span className="text-10 disabled ">Expected Arrival</span>
              </Col>
              <Col span={18}>
                <span className="text-12 bolder avenir ">{networkInfo.arrive}&nbsp;</span>
                <span className="disabled-4 text-10">Network confirmations</span>
              </Col>

              <Col span={5}>
                <span className="text-10 disabled ">Expected Unlock</span>
              </Col>
              <Col span={18}>
                <span className="text-12 bolder avenir ">{networkInfo.unlock}&nbsp;</span>
                <span className="disabled-4 text-10">Network confirmations</span>
              </Col>

              {COIN_WITH_MIN_DEPOSIT.includes(String(coinSelected?.coinType)) &&
                CHAIN_WITH_MIN_DEPOSIT.includes(network) && (
                  <>
                    <Col span={5}>
                      <span className="text-10 disabled ">Min. Deposit</span>
                    </Col>
                    <Col span={18}>
                      <span className="text-12 bolder avenir ">1&nbsp;</span>
                      <span className="disabled-4 text-10">{coinSelected?.coinType}</span>
                    </Col>
                  </>
                )}
            </Row>
          </Surface>
        </div>
      </Modal>
    </>
  );
};

export default DepositModal;
