import { useCallback, useMemo } from 'react';
import { IStakingInfo, useListStakingInfo } from 'api/staking';
import { APY_STAKING_RANGE } from 'utils/config';

export const useStakingInfo = () => {
  const { data: stakeDatas, isLoading } = useListStakingInfo({
    select: (data) => {
      let newDatas = { ...data };
      Object.keys(data).forEach((key) => {
        if (data[key].findIndex((item) => item.type === 3) === -1) {
          delete newDatas[key];
        }
      });
      return newDatas;
    },
  });

  // Get stake info by time : 1 | 30 | 60 | 90
  const getStakeInfoByTime = useCallback((data: IStakingInfo[], time: number) => {
    return data.find((x) => x.time === time) || data[0] || {};
  }, []);

  // API min max for rate
  const getStakeAPYRange = useCallback((data: string) => {
    // if (data.length === 0) return `0% - 0%`;
    // const APYs = data.map((item) => Number(item.apy));
    // return `${Math.min(...APYs)}% - ${Math.max(...APYs)}%`;

    return APY_STAKING_RANGE[data] || `N/A`;
  }, []);

  const dataSource = useMemo(() => {
    return stakeDatas || {};
  }, [stakeDatas]);

  return {
    isLoading,
    data: dataSource,
    getStakeInfoByTime,
    getStakeAPYRange,
  };
};
