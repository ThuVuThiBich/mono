import { FC, useEffect, useMemo, useState } from 'react';
import styles from './EarnTable.module.less';
import { Empty, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useAppDispatch } from 'hooks';
import { currencyImgs } from 'assets/images/currency';
import { coinName } from 'utils/currency';
import { currencyColors } from 'assets/images/currencyColors';
import { setEarnModal, setSelectedStakeInfo } from 'store/ducks/stake/slice';
import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import { useEarnInfo } from '../hooks/useEarnInfo';
import { setAuthModal } from 'store/ducks/system/slice';
import SortIcon from 'components/sortIcon';
import { Avatar, Button } from '@cross/ui';
import { RadioDuration } from 'components/earnAndStake';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';
import { useUser } from 'api/account';

interface ISortInfo {
  column: 'token' | 'apy' | 'minAmount';
  direction: number;
}

export interface IEarnInfo {
  coin: string;
  apy: string;
  rate: string;
  amount: string;
}

type Duration = 30 | 60 | 90;

interface EarnTableProps {
  search: string;
  filter: 'all' | 'popular' | 'APY';
}

const EarnTable: FC<EarnTableProps> = ({ search }) => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const [sortInfo, setSortInfo] = useState<ISortInfo>({ column: 'token', direction: 0 });
  const { data: stakeDatas, isLoading, getStakeInfoByTime } = useEarnInfo();
  const [durations, setDurations] = useState<Record<string, Duration>>({});
  const router = useRouter();

  useEffect(() => {
    let initDuration: Record<string, Duration> = {};
    Object.keys(stakeDatas).forEach((item) => {
      initDuration[item] = 30;
    });
    setDurations(initDuration);
  }, [stakeDatas]);

  const dataSource = useMemo(() => {
    let datas = Object.keys(stakeDatas);

    if (search) {
      datas = datas.filter((item) => item.includes(search.toUpperCase()));
    }

    // Sort
    if ((datas || [])?.length > 0 && sortInfo.direction !== 0) {
      let direction = sortInfo.direction;
      if (direction === 2) direction = -1;
      switch (sortInfo.column) {
        case 'token':
          datas = datas.sort((a: string, b: string) => {
            const sortNum = a.localeCompare(b);
            return sortNum > 0 ? direction : sortNum < 0 ? -direction : 0;
          });
          break;
        case 'apy':
          datas = datas.sort((a: string, b: string) => {
            const aAPYs = stakeDatas[a].map((item) => Number(item.apy));
            const bAPYs = stakeDatas[b].map((item) => Number(item.apy));

            let aAPY = Math.max(...aAPYs);
            let bAPY = Math.max(...bAPYs);
            const sortNum = aAPY - bAPY;

            return sortNum > 0 ? direction : sortNum < 0 ? -direction : 0;
          });
          break;
        case 'minAmount':
          datas = datas.sort((a: string, b: string) => {
            const aMins = stakeDatas[a].map((item) => Number(item.min));
            const bMins = stakeDatas[b].map((item) => Number(item.min));

            let aMin = Math.max(...aMins);
            let bMin = Math.max(...bMins);
            const sortNum = aMin - bMin;

            return sortNum > 0 ? direction : sortNum < 0 ? -direction : 0;
          });
          break;
        default:
          break;
      }
    }
    return datas;
  }, [sortInfo, stakeDatas, search]);

  const columns = useMemo(() => {
    return [
      {
        title: (
          <SortIcon
            level={sortInfo.column === 'token' ? sortInfo.direction : 0}
            onChangeOrder={(newOrder: any) => {
              setSortInfo({
                column: 'token',
                direction: newOrder,
              });
            }}
          >
            Token
          </SortIcon>
        ),
        render: (value) => {
          return (
            <Space>
              <Avatar
                className={styles.avatar}
                size={18}
                type="secondary"
                src={currencyImgs[value] || currencyImgs.GENERIC}
              />
              <b className="white"> {value}</b>

              <span className="text-14 disabled">{coinName[value] ? coinName[value] : value}</span>
            </Space>
          );
        },
      },
      {
        title: (
          <SortIcon
            level={sortInfo.column === 'apy' ? sortInfo.direction : 0}
            onChangeOrder={(newOrder) => {
              setSortInfo({
                column: 'apy',
                direction: newOrder,
              });
            }}
          >
            Est. APY/APR
          </SortIcon>
        ),
        render: (coin) => {
          return (
            <div className={styles.apyBox} style={{ background: currencyColors[coin] }}>
              {getStakeInfoByTime(stakeDatas[coin], durations[coin])?.apy || 0} %
            </div>
          );
        },
      },
      {
        title: (
          <SortIcon
            level={sortInfo.column === 'minAmount' ? sortInfo.direction : 0}
            onChangeOrder={(newOrder: any) => {
              setSortInfo({
                column: 'minAmount',
                direction: newOrder,
              });
            }}
          >
            Min Amount
          </SortIcon>
        ),
        render: (coin) => {
          return (
            <div>
              <b> {getStakeInfoByTime(stakeDatas[coin], durations[coin])?.min || 0}</b>
              &nbsp;
              <span className="text-12 disabled">{coin}</span>
            </div>
          );
        },
      },
      {
        title: 'Duration (days)',
        render: (coin) => {
          return (
            <RadioDuration
              onChange={(e) => {
                const nDuration = { ...durations };
                nDuration[coin] = e.target.value;
                setDurations(nDuration);
              }}
              value={durations[coin]}
              defaultValue={30}
            />
          );
        },
      },
      {
        width: 100,
        render: (coin) => {
          return (
            <Button
              onClick={() => {
                if (!user) {
                  router.push(`${routes.login}?redirect=stake`);
                  return;
                }
                dispatch(
                  setSelectedStakeInfo({
                    ...getStakeInfoByTime(stakeDatas[coin], durations[coin]),
                    coin,
                  })
                );
                dispatch(setEarnModal(true));
              }}
              size="small"
              type="info"
            >
              Earn
            </Button>
          );
        },
      },
    ] as ColumnsType<any>;
  }, [dataSource, stakeDatas, durations, user]);

  return (
    <div className={styles.table}>
      <Table
        loading={isLoading}
        pagination={{
          hideOnSinglePage: true,
        }}
        columns={columns}
        dataSource={dataSource}
        rowKey={(x) => x}
        scroll={{ x: true }}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" /> }}
      />
    </div>
  );
};

export default EarnTable;
