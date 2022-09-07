import { Carousel } from '@cross/ui';
import { FC, useState } from 'react';
import Banner from '../banner';
import styles from './styles.module.less';

export const Hero: FC = () => {
  const [index, setIndex] = useState(0);
  const handleChange = (i: number) => setIndex(i);

  return (
    <section className="container">
      <Carousel
        // onChange={() => {}}
        arrows={true}
        autoplay
        autoplaySpeed={8000}
        effect="fade"
        dots
        className={styles.carousel}
      >
        <div className={styles.bannerWrapper}>
          <Banner />
        </div>
        <div className={styles.bannerWrapper}>
          <Banner />
        </div>
        <div className={styles.bannerWrapper}>
          <Banner />
        </div>
      </Carousel>
    </section>
  );
};
