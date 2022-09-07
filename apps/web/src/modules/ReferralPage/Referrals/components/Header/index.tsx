import { Col, Row } from 'antd';
import { FC } from 'react';
import styles from './styles.module.less';
import { MinusOutlined } from '@ant-design/icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReferralCount } from 'components/referralCount';
import { IReferralHistoryParams } from 'api/referral';
import { useTypeSafeTranslation } from 'hooks';
import { DatePicker, Option, SelectWithLabel } from '@cross/ui';

interface IHeaderProps {
  filterData: IReferralHistoryParams;
  setFilterData: React.Dispatch<React.SetStateAction<IReferralHistoryParams>>;
}

const Header: FC<IHeaderProps> = ({ filterData, setFilterData }) => {
  const { t } = useTypeSafeTranslation();
  const onChangeStartDate = (dateStart: any) => {
    let endDate = filterData.endDate;
    if (dateStart) {
      dateStart.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      if (endDate && dateStart > endDate) {
        endDate = null;
      }
    }
    setFilterData({
      ...filterData,
      page: 1,
      startDate: dateStart ?? undefined,
      endDate: endDate,
    });
  };

  const onChangeEndDate = (endDate: any) => {
    let startDate = filterData.startDate;
    if (endDate) {
      endDate.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
      if (startDate && startDate > endDate) {
        startDate = null;
      }
    }
    setFilterData({
      ...filterData,
      page: 1,
      endDate: endDate ?? undefined,
      startDate: startDate,
    });
  };

  const handleStatusChange = (value: string) => {
    setFilterData({
      ...filterData,
      page: 1,
      status: value,
    });
  };

  return (
    <Row className={styles.header} gutter={[16, 16]} align="bottom" wrap={true}>
      <Col flex={'auto'}>
        <ReferralCount theme="light" />
      </Col>
      <Col>
        <div className={styles.filterForm}>
          <DatePicker
            onChange={onChangeStartDate}
            value={filterData.startDate}
            className={styles.filterInput}
            placeholder='Start'
            size="small"
          />
          <MinusOutlined />
          <DatePicker
            onChange={onChangeEndDate}
            value={filterData.endDate}
            className={styles.filterInput}
            placeholder='End'
            size="small"
          />
          <SelectWithLabel
            value={filterData.status}
            onChange={handleStatusChange}
            className={styles.filterInput}
            placeholder='Status'
            size="small"
          >
            <Option value="">All</Option>
            <Option value="REGISTRATION_ONLY">Registered</Option>
            <Option value="KYC_COMPLETED">Verified</Option>
            <Option value="TRADE_OR_MINED">Active</Option>
          </SelectWithLabel>
          <button
            onClick={() => setFilterData({ page: 1, page_size: 10, startDate: '', endDate: '' })}
            className={styles.btnReset}
          >
            <FontAwesomeIcon color="rgba(75, 99, 107, 1)" icon={faTimes} />
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default Header;
