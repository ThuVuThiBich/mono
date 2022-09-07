import React, { FC, useState } from 'react';
import styles from './TableSection.module.less';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FilterGroup, InputWithLabel } from '@cross/ui';
import { Col, Row } from 'antd';
import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import StakeTable from './StakeTable';

const TableSection: FC = () => {
  const { t } = useTypeSafeTranslation();
  const [filter, setFilter] = useState<'all' | 'popular' | 'APY'>('popular');
  const [search, setSearch] = useState('');

  return (
    <div className={styles.root}>
      <Row justify="space-between" gutter={[24, 16]} align="middle">
        <Col lg={14}>
          <InputWithLabel
            value={search}
            className={styles.searchInput}
            onChange={(e) => setSearch(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
            placeholder="Type Crypto Name"
            label="Search"
            searchForm
            suffix={<FontAwesomeIcon color="#788686" icon={faSearch} size="lg" />}
          />
        </Col>

        <Col>
          <div className={styles.filterGroup}>
            <FilterGroup
              datas={[
                { label: 'All', value: 'all' },
                { label: 'Popular', value: 'popular' },
                { label: 'Max APY/APR', value: 'APY' },
              ]}
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            />
          </div>
        </Col>
      </Row>

      <StakeTable filter={filter} search={search} />
    </div>
  );
};

export default TableSection;
