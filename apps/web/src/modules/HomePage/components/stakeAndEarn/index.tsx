import { FilterGroup } from '@cross/ui';
import { Col, Row } from 'antd';
import clsx from 'clsx';
import React, { FC, useState } from 'react';
import StakingTable from './StakingTable';
import styles from './styles.module.less';

const StakeAndEarn: FC = () => {
  const [type, setType] = useState<'earn' | 'stake'>('earn');

  return (
    <div className={clsx(styles.root, 'container')}>
      <Row justify="center">
        <Col xs={23} lg={24}>
          <h1>Dealing Earn</h1>
          <p className="center">Simple & Secure. Search popular coins and start earning.</p>

          <div className={styles.tabs}>
            <FilterGroup
              datas={[
                { label: 'Earn', value: 'earn' },
                { label: 'Staking', value: 'stake' },
              ]}
              value={type}
              filled
              stretch
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className={styles.tables}>{type === 'earn' ? <StakingTable /> : <StakingTable />}</div>
        </Col>
      </Row>
    </div>
  );
};

export default StakeAndEarn;
