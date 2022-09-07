import { MainLayout } from 'components/mainLayout';
import { FC } from 'react';
import Welcome from './components/Welcome';


const DashBoardPage: FC = () => {
  return (
    <MainLayout>
      <Welcome />
    </MainLayout>
  );
};

export default DashBoardPage;
