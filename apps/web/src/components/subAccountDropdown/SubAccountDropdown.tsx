import { FC, memo, useMemo } from 'react';
import styles from './styles.module.less';

import { Button } from '@cross/ui/button';
import { Dropdown } from '@cross/ui/dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faExchangeAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSubAccountsQuery } from 'api/sub_account';
import { Divider, Spin } from 'antd';
import { useAppDispatch, useAppSelector, useTypeSafeTranslation } from 'hooks';
import {
  getCurrentSubAccount,
  MAIN_ACCOUNT_KEY,
  setCurrentSubAccount,
  setModalCreate,
  setModalTransfer,
} from 'store/ducks/sub_account/slice';

import clsx from 'clsx';

const SubAccountDropdown: FC = () => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const currentSubAccount = useAppSelector(getCurrentSubAccount);

  const { data: subAccounts, isLoading } = useSubAccountsQuery({
    select: (data) => {
      return data?.filter((x) => !!x.parentAccountId);
    },
  });

  const nickName = useMemo(() => {
    if (!subAccounts) return t('sub_account.main_account');

    if (currentSubAccount === MAIN_ACCOUNT_KEY) return t('sub_account.main_account');

    return subAccounts.find((x) => x.accountId === currentSubAccount)?.nickName || 'unkown';
  }, [currentSubAccount, subAccounts, t]);

  const menu = useMemo(() => {
    return (
      <div className={styles.overlay}>
        <div className={clsx(styles.box, styles.switchSubaccount)}>
          <div className={styles.title}>
            <img src="/images/svgs/sync-alt-solid.svg" alt="rotate" />
            <span>{t('navbar.switch_subaccount')}</span>
          </div>
          <Divider className={styles.divider} />
          <Spin spinning={isLoading} className="h-100">
            <div className={styles.accountScroller}>
              <Button
                className={styles.subAccount}
                onClick={() => dispatch(setCurrentSubAccount(MAIN_ACCOUNT_KEY))}
                type="text"
              >
                {t('sub_account.main_account')}
                <span className={styles.checkIcon}>
                  {currentSubAccount === MAIN_ACCOUNT_KEY && <img src="/images/svgs/check-mark.svg" alt="check-mark" />}
                </span>
              </Button>
              {subAccounts?.map((item) => (
                <Button
                  className={styles.subAccount}
                  onClick={() => dispatch(setCurrentSubAccount(item.accountId))}
                  type="text"
                  key={item.accountId}
                >
                  {item.nickName}
                  <span className={styles.checkIcon}>
                    {item.accountId === currentSubAccount && <img src="/images/svgs/check-mark.svg" alt="check-mark" />}
                  </span>
                </Button>
              ))}
            </div>
          </Spin>
          <a onClick={() => dispatch(setModalCreate(true))} className={styles.btnCreate}>
            {t('navbar.create_new')} <FontAwesomeIcon icon={faPlus} />
          </a>
          {(subAccounts || [])?.length > 0 && (
            <a onClick={() => dispatch(setModalTransfer(true))} className={styles.btnTransfer}>
              {t('navbar.transfer_fund')}
              <FontAwesomeIcon icon={faExchangeAlt} />
            </a>
          )}
        </div>
      </div>
    );
  }, [subAccounts, currentSubAccount]);

  return (
    <Dropdown className={styles.root} overlay={menu}>
      <div className="h-100">
        <a className={styles.button}>
          <img src="/images/svgs/wallet-duotone.svg" alt="wallet" className={styles.walletImg} />
          <span className="default medium">{nickName}</span>
          <FontAwesomeIcon size="lg" icon={faChevronDown} />
        </a>
      </div>
    </Dropdown>
  );
};

export default memo(SubAccountDropdown);
