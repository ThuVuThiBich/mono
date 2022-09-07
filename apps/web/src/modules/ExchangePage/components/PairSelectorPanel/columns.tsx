import React from 'react';
import styles from './PairSelectorPanel.module.less';
import clsx from 'clsx';
import { Button, Col, Row } from 'antd';
import { Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Avatar } from '@cross/ui';
import { currencyImgs } from 'assets/images/currency';
import { TFunction } from 'next-i18next';
import { IPairData } from './TablePanel';
import { nDecimalFormat } from 'utils/number';
import { ICurrentCurrency } from 'types/local';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faSortDown, faSortUp, faStar } from '@fortawesome/free-solid-svg-icons';

export const getColumn = (
  t: TFunction,
  fnWatchPair: any,
  watchPairs: any,
  currency: ICurrentCurrency,
  getUsdUnit: (pairData: IPairData) => string | number
): ColumnsType<IPairData> => {
  return [
    {
      key: 'active',
      render(record) {
        return (
          <Button
            className={styles.btnWatch}
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              fnWatchPair(record);
            }}
            icon={
              <FontAwesomeIcon
                className={clsx(styles.faEye, (watchPairs || []).includes(record.pair) ? styles.faEyeActive : null)}
                icon={faStar}
              />
            }
          />
        );
      },
    },
    {
      title: 'Pair',
      key: 'pair',
      dataIndex: 'pair',
      showSorterTooltip: false,
      sorter: (a: any, b: any) => {
        return a.pair.localeCompare(b.pair);
      },
      render(pairStr) {
        const pairSplit = pairStr.split('_');
        return (
          <Space>
            <Space>
              <Avatar size={20} type="secondary" src={currencyImgs[pairSplit[0]] || currencyImgs.GENERIC} />
              <span className="bold default">{pairSplit[0]}</span>
            </Space>
            <span className="bold default">/</span>
            <Space>
              <Avatar size={20} type="secondary" src={currencyImgs[pairSplit[1]] || currencyImgs.GENERIC} />
              <span className="bold default">{pairSplit[1]}</span>
            </Space>
          </Space>
        );
      },
    },
    {
      title: 'Price',
      key: 'last',
      dataIndex: 'last',
      showSorterTooltip: false,
      sorter: (a: any, b: any) => {
        return parseFloat(a.last) - parseFloat(b.last);
      },

      render(value, record) {
        return (
          <>
            <p className={parseFloat(record.dchange_pec) >= 0 ? styles.paraSuccess : styles.paraDanger}>
              {nDecimalFormat(value, Number(record?.decimal ?? 2))}
            </p>
            <p className={styles.paraDark}>{`${currency.symbol} ${nDecimalFormat(
              getUsdUnit(record).toString(),
              2
            )}`}</p>
          </>
        );
      },
    },
    {
      title: 'Change',
      key: 'dchange_pec',
      dataIndex: 'dchange_pec',
      showSorterTooltip: false,
      sorter: (a: any, b: any) => {
        return parseFloat(a.dchange_pec) - parseFloat(b.dchange_pec);
      },
      render(dchange_pec) {
        return (
          <Row wrap={false}>
            <Col flex="auto">
              <p className={dchange_pec >= 0 ? styles.paraSuccess : styles.paraDanger}>
                <span className={styles.percentage}>
                  <FontAwesomeIcon
                    className={clsx(styles.sortIcon, dchange_pec >= 0 ? styles.sortUp : styles.sortDown)}
                    icon={dchange_pec >= 0 ? faSortUp : faSortDown}
                  />{' '}
                  {Math.abs(dchange_pec).toFixed(2)} %
                </span>
              </p>
              <p className={styles.paraDark}>24h</p>
            </Col>
            <Col flex="none" className={styles.detailIconCol}>
              <button className={clsx(styles.transButton, styles.detailIcon)}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </Col>
          </Row>
        );
      },
    },
  ];
};
