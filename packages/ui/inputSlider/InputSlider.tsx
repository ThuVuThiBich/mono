import { Slider } from "antd";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import { memo } from "react";
import styles from "./InputSlider.module.css";

interface SliderProps {
  value?: number | undefined;
  handleChange?: (value: number) => void;
  maxValue?: number;
  disabled?: boolean;
  handle?: "yellow" | "black";
}

// eslint-disable-next-line react/display-name
export const InputSlider = memo(
  ({
    value,
    handleChange,
    maxValue,
    disabled,
    handle = "yellow",
  }: SliderProps) => {
    const marks = {
      0: 0,
      25: 1,
      50: 2,
      75: 3,
      100: 4,
    };

    return (
      <div className={clsx(styles.slider, styles[handle])}>
        <Slider
          disabled={disabled}
          marks={marks}
          value={value}
          onChange={(e: number) => {
            if (handleChange)
              handleChange(
                new BigNumber(e / 100).multipliedBy(maxValue || 0).toNumber()
              );
          }}
          range={false}
          max={100}
          tipFormatter={(value: number | undefined) => {
            return `${value}%`;
          }}
        />
      </div>
    );
  }
);
