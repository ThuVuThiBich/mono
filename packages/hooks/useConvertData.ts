import { useCallback, useEffect, useState } from "react";

export const useConvertData = (pairList: any[]) => {
  const [convertData, setConvertData] = useState<any[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let groupPairs: any = [];

  const formLeverFun = useCallback(
    (item: any) => {
      if (parseFloat(item[9]) === 3) {
        return;
      }

      const coinType = item[0].split("_")[1];

      if (groupPairs.length === 0) {
        const obj: any = {};
        obj.type = item[5];
        obj.list_m = [
          {
            pair: item[0],
            searchPair: coinType,
            // star: item[10],
            pairType: item[9],
            decimal: item[3],
            data: [...pairList.find((i: any) => i[0] === item[0])],
          },
        ];
        obj.list_s = [coinType];
        obj.searchValue = coinType;
        obj.searchIndex = 0;
        groupPairs.push(obj);
      } else {
        let n = 0;

        groupPairs.forEach((groupPair: any) => {
          if (parseFloat(groupPair.type) === parseFloat(item[5])) {
            n++;

            groupPair.list_m.push({
              pair: item[0],
              searchPair: coinType,
              // star: item[10],
              pairType: item[9],
              decimal: item[3],
              data: [...pairList.find((i: any) => i[0] === item[0])],
            });

            let xx = 0;
            groupPair.list_s.forEach((xxx: any) => {
              if (xxx === coinType) {
                xx++;
              }
            });

            if (xx === 0) {
              groupPair.list_s.push(coinType);
            }
          }
        });

        if (n === 0) {
          let obj: any = {};
          obj.type = item[5];
          obj.list_m = [
            {
              pair: item[0],
              searchPair: coinType,
              star: item[10],
              pairType: item[9],
              decimal: item[3],
              data: [...pairList.find((i: any) => i[0] === item[0])],
            },
          ];
          obj.list_s = [coinType];
          obj.searchValue = coinType;
          obj.searchIndex = 0;
          groupPairs.push(obj);
        }
      }

      if (parseFloat(item[9]) === 2) {
        let newItem = Object.assign({}, item);
        newItem[9] = 4;
        newItem[5] = 4;
        formLeverFun(newItem);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pairList]
  );

  // convert pairList data
  useEffect(() => {
    if (pairList && pairList.length > 0) {
      for (const item of pairList) {
        formLeverFun(item);
      }
      setConvertData(groupPairs);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairList]);

  return {
    convertData,
  };
};
