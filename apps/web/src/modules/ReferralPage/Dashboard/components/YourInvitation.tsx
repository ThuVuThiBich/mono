import React, { FC, useEffect, useMemo } from 'react';
import styles from './YourInvitation.module.less';

import { Avatar, Divider, Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import Link from 'next/link';
import { routes, ReferralTab } from 'types/routes';
import { IReferralInvitation, useReferralInvitation } from 'api/referral';
import dayjs from 'dayjs';
import { ReferralCount } from 'components/referralCount';
import { useAppSelector, useTypeSafeTranslation } from 'hooks';
import { getCurrentSubAccount } from 'store/ducks/sub_account/slice';
import { Surface } from '@cross/ui';

export const STATUS_ICON: Record<string, string> = {
  REGISTRATION_ONLY: '/images/svgs/pending.svg',
  KYC_COMPLETED: '/images/svgs/check-green.svg',
  TRADE_OR_MINED: '/images/svgs/bull-circle.svg',
};

const InvitationTable: FC = () => {
  const { t } = useTypeSafeTranslation();
  const {
    data: referralHistory,
    isFetching: loadingTable,
    refetch,
  } = useReferralInvitation({
    select: (data) => {
      return {
        ...data,
        referrals: data.referrals.slice(0, 10),
      };
    },
  });

  const currentSubAccount = useAppSelector(getCurrentSubAccount);

  useEffect(() => {
    refetch();
  }, [currentSubAccount]);

  const columns = useMemo(() => {
    return [
      {
        title: 'Invitee',
        dataIndex: 'nickname',
        render: (value) => <span className="text-12">{value}</span>,
      },
      {
        title: 'Date',
        dataIndex: 'registerDate',
        render: (value) => (
          <span className="text-12 disabled-3">{dayjs(Number(value)).format('HH:mm - DD/MM/YY')}</span>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        align: 'center',
        render: (value) => <Avatar size={20} src={STATUS_ICON[value] || STATUS_ICON.REGISTRATION_ONLY} />,
      },
    ] as ColumnsType<IReferralInvitation>;
  }, [t]);

  return (
    // <TableContainer size="small" filled>
    <Table
      loading={loadingTable}
      size="small"
      scroll={{ x: true }}
      rowKey="accountId"
      columns={columns}
      dataSource={referralHistory?.referrals}
      pagination={false}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_data')} /> }}
    />
    // </TableContainer>
  );
};

const YourInvitation: FC = () => {
  const { t } = useTypeSafeTranslation();
  const { data: referralHistory } = useReferralInvitation({
    select: (data) => ({
      ...data,
      referrals: data.referrals.sort((a, b) => Number(b.registerDate) - Number(a.registerDate)),
    }),
  });
  return (
    <Surface className={styles.root}>
      <span className="bold">YOUR INVITATIONS</span>
      <Divider className="m-0" />

      <ReferralCount className={styles.referralSection} theme="dark" />

      <InvitationTable />

      <div className="f-end">
        {Number(referralHistory?.referrals.length) > 8 && (
          <Link href={`${routes.referral}?tab=${ReferralTab.referrals}`}>
            <a className="white">
              {t('common.see_all')} &nbsp;
              <img src="/images/svgs/arrow-from-bottom-solid.svg" alt="icon" />
            </a>
          </Link>
        )}
      </div>
    </Surface>
  );
};

export default YourInvitation;
