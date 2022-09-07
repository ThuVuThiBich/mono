import { FC } from 'react';
import { useCurrencyGroupItem } from 'api/account';
import { initialCurrentCurrency, USER_COOKIES } from 'utils/constant';
import { useAppDispatch } from 'hooks';
import { setCurrentCurrency } from 'store/ducks/account/slice';
import { getCookies, parseJson } from '@cross/cookies';
import { coinSymbol } from 'modules/AccountPage/constant';
import SubAccountModalCreate from './subAccountDropdown/components/SubAccountModalCreate';
import SubAccountTransferModal from './subAccountDropdown/components/SubAccountTransferModal';

const Moduler: FC = () => {
  const dispatch = useAppDispatch();

  useCurrencyGroupItem({
    onSettled: (data) => {
      const cookieCurrency = getCookies(USER_COOKIES.currentCurrency);
      const type = parseJson(cookieCurrency)?.coinType || initialCurrentCurrency.coinType;
      const currency: any = data?.find((item) => item.coinType === type);
      if (currency) {
        currency.symbol = coinSymbol[type].type;
        dispatch(setCurrentCurrency(currency));
      }
    },
  });

  return (
    <>
      <SubAccountModalCreate />
      <SubAccountTransferModal />
    </>
  );
};

export default Moduler;
