import { FC } from 'react';
import styles from './styles.module.less';
import { MinusOutlined } from '@ant-design/icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row, Space } from 'antd';
import { IEarningHistoryParams, useEarningReferralHistory } from 'api/referral';
import { useAppSelector, useTypeSafeTranslation } from 'hooks';
import { getCurrentCurrency } from 'store/ducks/account/slice';
import { formatNumber } from 'utils/number';
import { DatePicker, Option, SelectWithLabel } from '@cross/ui';

interface IHeaderProps {
  filterData: IEarningHistoryParams;
  setFilterData: React.Dispatch<React.SetStateAction<IEarningHistoryParams>>;
}

const Header: FC<IHeaderProps> = ({ filterData, setFilterData }) => {
  const { t } = useTypeSafeTranslation();
  const currency = useAppSelector(getCurrentCurrency);

  const { data: refHistory } = useEarningReferralHistory(filterData);

  const onChangeStartDate = (dateStart: any) => {
    let endDate = filterData.start_time;
    if (dateStart) {
      dateStart.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      if (endDate && dateStart > endDate) {
        endDate = null;
      }
    }
    setFilterData({
      ...filterData,
      page: 1,
      start_time: dateStart ?? undefined,
      end_time: endDate,
    });
  };

  const onChangeEndDate = (endDate: any) => {
    let startDate = filterData.start_time;
    if (endDate) {
      endDate.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
      if (startDate && startDate > endDate) {
        startDate = null;
      }
    }
    setFilterData({
      ...filterData,
      page: 1,
      end_time: endDate ?? undefined,
      start_time: startDate,
    });
  };

  const handleTypeChange = (value: number) => {
    setFilterData({ ...filterData, type: value });
  };

  return (
    <Row className={styles.header} gutter={[16, 16]} align="bottom" wrap={true}>
      <Col flex={'auto'}>
        <div className={styles.earning}>
          <div className={styles.earningTitle}>Total Earnings:</div>
          <Space size={0} direction="vertical" align="end">
            <div className={styles.lockedBalance}>
              {formatNumber(Number(refHistory?.totalEarningBTC), 8)} <span>BTC</span>
            </div>
            <div className={styles.lockedBalanceExchange}>
              ~{currency.symbol} {formatNumber(Number(refHistory?.totalEarning) * Number(currency.rate), 2)}{' '}
              {currency.coinType}
            </div>
          </Space>
        </div>
      </Col>
      <Col>
        <div className={styles.filterForm}>
          <DatePicker
            onChange={onChangeStartDate}
            value={filterData.start_time}
            className={styles.filterInput}
            placeholder="Start"
            size="small"
          />
          <MinusOutlined />
          <DatePicker
            onChange={onChangeEndDate}
            value={filterData.end_time}
            className={styles.filterInput}
            placeholder="End"
            size="small"
          />
          <SelectWithLabel
            onChange={handleTypeChange}
            value={filterData.type}
            className={styles.filterInput}
            placeholder="Type"
            size="small"
          >
            <Option value="">All</Option>
            <Option value={1}>Commission History</Option>
            <Option value={2}>Commission Share with You</Option>
            {/* <Option value="friend">{t('referral.other.friend_list')}</Option> */}
          </SelectWithLabel>
          <button
            onClick={() => setFilterData({ page: 1, page_size: 10, start_time: '', end_time: '' })}
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
