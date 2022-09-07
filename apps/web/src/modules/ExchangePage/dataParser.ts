import { parseJson } from '@cross/cookies';

export function sortArr(arr: any[]) {
  return parseJson(JSON.stringify(arr)).sort((a: any, b: any) => {
    const aPrice = parseFloat(a[0]);
    const bPrice = parseFloat(b[0]);
    return bPrice - aPrice;
  });
}
