import { ILockedInfo } from 'api/staking';
import dayjs from 'dayjs';

const convertMilliSecondToDay = (milliSecond: number) => {
  return milliSecond / (24 * 3600 * 1000);
};

export const day = (period: string, type: number) => {
  if (type === 10 || type === 11 || type === 12) {
    return '∞';
  }
  const day = convertMilliSecondToDay(Number(period));
  if (day === 1) {
    return 'Staking';
  }
  return `Earn ${day}`;
};

export const convertTime = (item: ILockedInfo['lockOrders'][0], isStartType: boolean) => {
  // if (
  //   parseFloat(item.unlockTime) === 0 ||
  //   (!isStartType && (item.type === 10 || item.type === 11 || item.type === 12))
  // ) {
  //   return '- -';
  // }

  let time = isStartType ? Number(item.unlockTime) - Number(item.period) : Number(item.unlockTime);
  if (item.type === 3) time = isStartType ? Number(item.orderTime) : Number(item.unlockTime);

  return dayjs(time + (item.type !== 3 ? 18000000 : 0));
};
