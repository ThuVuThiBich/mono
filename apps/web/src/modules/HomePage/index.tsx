import { TabPane, Tabs } from '@cross/ui';
import { PriceCharts } from 'components/priceCharts';
import { FC } from 'react';
import Feature from './components/feature';
import { Hero } from './components/hero';
import StakeAndEarn from './components/stakeAndEarn';
import Why from './components/why';
import styles from './styles.module.less';

const HomePage: FC = () => {
  return (
    <div className={styles.homePage}>
      <Hero />
      <PriceCharts />
      <Why />
      <Feature />
      <StakeAndEarn />
    </div>
  );
};

export default HomePage;
