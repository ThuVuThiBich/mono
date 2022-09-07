import { useTranslation } from 'next-i18next';

import { Paths } from 'types/util-types';
import translations from '../../public/locales/en/common.json';

export type TranslationKeys = Paths<typeof translations>;
export type TFunctionCustom = (s: TranslationKeys, p?: any) => string;

export const useTypeSafeTranslation = () => {
  const { t } = useTranslation();

  return {
    t: (s: TranslationKeys, p?: any) => t(s, p),
  };
};
