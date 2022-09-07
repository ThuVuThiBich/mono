import { MainLayout } from 'components/mainLayout';
import { FC } from 'react';
import EarningTable from './components/EarningTable';
import HeaderInfo from './components/HeaderInfo';
const EarningPortfolioPage: FC = () => {
  return (
    <MainLayout>
      <HeaderInfo />
      <EarningTable />
    </MainLayout>
  );
};

export default EarningPortfolioPage;
