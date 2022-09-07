import { FC, memo, useRef } from 'react';
import { Input, Surface } from '@cross/ui';
import styles from './InputTrade.module.css';
import { Row, Col } from 'antd';
import NumberFormat from 'react-number-format';
import clsx from 'clsx';

type InputTradeProps = {
  value?: string | number | null;
  coin: string;
  title: string;
  disabled?: boolean;
  onChange?: (value: any) => void;
  type?: string;
  text?: string;
  precision?: number;
  id?: any;
};

// eslint-disable-next-line react/display-name
export const InputTrade: FC<InputTradeProps> = memo(
  ({ coin, value, title, disabled, onChange, type, text, precision, id }: InputTradeProps) => {
    const isFocus = useRef(false);
    return (
      <Surface className={styles.root}>
        <Row align="middle" justify="space-between">
          <Col span={5} className={styles.title}>
            {title}
          </Col>
          <Col span={19} className={styles.value}>
            {type === 'text' ? (
              <Input value={text} className={styles.input} disabled={disabled} />
            ) : (
              <NumberFormat
                onFocus={() => {
                  isFocus.current = true;
                }}
                onBlur={() => {
                  isFocus.current = false;
                }}
                value={value || ''}
                onValueChange={(values) => {
                  // Event is fired whenever the input value change => cause revalidate onChange function.
                  if (onChange && isFocus.current) onChange(values.value);
                }}
                decimalScale={precision}
                allowNegative={false}
                thousandSeparator
                allowEmptyFormatting
                disabled={disabled}
                className={clsx('ant-input', styles.input)}
                id={id}
              />
            )}
            <span className={styles.coin}>{coin}</span>
          </Col>
        </Row>
      </Surface>
    );
  }
);
