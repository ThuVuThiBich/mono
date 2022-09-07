import React, { FC } from 'react';
import SubAccountTable from './components/SubAccountTable';
import HeaderInfo from './components/HeaderInfo';
import SubAccountModalDelete from './components/SubAccountModalDelete';
import SubAccountModalEdit from './components/SubAccountModalEdit';
import { MainLayout } from 'components/mainLayout';

const SubAccountPage: FC = () => {
  return (
    <>
      <MainLayout>
        <HeaderInfo />
        <SubAccountTable />
      </MainLayout>
      <SubAccountModalDelete />
      <SubAccountModalEdit />
    </>
  );
};

export default SubAccountPage;
