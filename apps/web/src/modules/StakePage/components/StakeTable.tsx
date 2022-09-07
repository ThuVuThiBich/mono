import { FC, useMemo, useState } from 'react';
import styles from './StakeTable.module.less';
import { Empty, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Button } from '@cross/ui';
import { useAppDispatch } from 'hooks';
import { Avatar } from '@cross/ui';
import { currencyImgs } from 'assets/images/currency';
import { coinName } from 'utils/currency';
import { currencyColors } from 'assets/images/currencyColors';
import { setSelectedStakeInfo, setStakeModal } from 'store/ducks/stake/slice';
import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import { useStakingInfo } from '../hooks/useStakingInfo';
import { setAuthModal } from 'store/ducks/system/slice';
import ToggleCompound from './ToggleCompound';
import { COIN_AUTO_COMPOUND } from 'utils/config';
import SortIcon from 'components/sortIcon';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';
import { useUser } from 'api/account';

interface ISortInfo {
  column: 'token' | 'apy' | 'minAmount';
  direction: number;
}

interface StakeTableProps {
  search: string;
  filter: 'all' | 'popular' | 'APY';
}

const StakeTable: FC<StakeTableProps> = ({ search }) => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const [sortInfo, setSortInfo] = useState<ISortInfo>({ column: 'token', direction: 0 });
  const { data: stakeDatas, isLoading, getStakeInfoByTime, getStakeAPYRange } = useStakingInfo();
  const router = useRouter();

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
            const aAPYs = stakeDatas[a].find((x) => x.type === 3)?.apy;
            const bAPYs = stakeDatas[b].find((x) => x.type === 3)?.apy;

            const sortNum = Number(aAPYs) - Number(bAPYs);

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
        render: (coin) => {
          return (
            <Space>
              <Avatar
                className={styles.avatar}
                size={18}
                type="secondary"
                src={currencyImgs[coin] || currencyImgs.GENERIC}
              />
              <b className="white"> {coin}</b>

              <span className="text-14 disabled">{coinName[coin] ? coinName[coin] : coin}</span>
            </Space>
          );
        },
      },
      {
        title: 'Est. APY/APR',
        // <SortIcon
        //   level={sortInfo.column === 'apy' ? sortInfo.direction : 0}
        //   onChangeOrder={(newOrder: any) => {
        //     setSortInfo({
        //       column: 'apy',
        //       direction: newOrder,
        //     });
        //   }}
        // >
        //   {t('stake.est_apy_apr')}
        // </SortIcon>
        render: (coin) => {
          return (
            <div className={styles.apyBox} style={{ background: currencyColors[coin] }}>
              {getStakeAPYRange(coin)}
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
              <b> {getStakeInfoByTime(stakeDatas[coin], 1)?.min || 0}</b>
              &nbsp;
              <span className="text-12 disabled">{coin}</span>
            </div>
          );
        },
      },
      {
        title: 'Auto Compound',
        width: 80,
        render: (coin) => {
          return <div>{COIN_AUTO_COMPOUND.includes(coin) && <ToggleCompound coin={coin} />}</div>;
        },
      },
      {
        width: 80,
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
                    ...getStakeInfoByTime(stakeDatas[coin], 1),
                    coin,
                  })
                );
                dispatch(setStakeModal(true));
              }}
              size="small"
              type="info"
            >
              Stake
            </Button>
          );
        },
      },
    ] as ColumnsType<any>;
  }, [stakeDatas, dataSource, user]);

  return (
    <div className={styles.table}>
      <Table
        loading={isLoading}
        pagination={{
          hideOnSinglePage: true,
        }}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: true }}
        rowKey={(x) => x}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_data')} /> }}
      />
    </div>
  );
};

export default StakeTable;
