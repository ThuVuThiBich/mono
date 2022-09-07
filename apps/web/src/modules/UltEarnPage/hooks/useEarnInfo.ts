import { useCallback, useMemo } from 'react';
import { IListStakingInfo, IStakingInfo, useListStakingInfo } from 'api/staking';

export const useEarnInfo = () => {
  const { data: stakeDatas, isLoading } = useListStakingInfo({
    select: (data) => {
      /** Filter all data not have earning type*/
      /** Remove data with time === 1 to caculate APY range from 30 - 90*/
      const newDatas: IListStakingInfo = {};
      Object.keys(data).forEach((key) => {
        if (data[key].findIndex((item) => item.type === 2001) === -1) {
          delete newDatas[key];
        } else {
          newDatas[key] = data[key].filter((x) => x.time !== 1);
        }
      });
      return newDatas;
    },
  });

  /** Get stake info by time : 30 | 60 | 90 */
  const getStakeInfoByTime = useCallback((data: IStakingInfo[], time: number) => {
    return data?.find((x) => x.time === time) || data?.[0] || {};
  }, []);

  const getStakeInfoByMaxAPY = useCallback((data: IStakingInfo[]) => {
    return (
      data?.reduce((pre, next) => {
        return Number(pre.apy) < Number(next.apy) ? next : pre;
      }, data[0]) || data[0]
    );
  }, []);

  // API min max for rate
  const getStakeAPYRange = useCallback((data: IStakingInfo[]) => {
    if (data.length === 0) return `0% - 0%`;
    const APYs = data?.map((item) => Number(item.apy));
    return `${Math.min(...APYs)}% - ${Math.max(...APYs)}%`;
  }, []);

  const dataSource = useMemo(() => {
    return stakeDatas || {};
  }, [stakeDatas]);

  return {
    isLoading,
    data: dataSource,
    getStakeInfoByTime,
    getStakeAPYRange,
    getStakeInfoByMaxAPY,
  };
};
