import { Slider } from "antd";
import clsx from "clsx";
import { memo } from "react";
import styles from "./InputSlider.module.css";

interface SliderProps {
  value?: number | undefined;
  handleChange?: (value: number) => void;
  maxValue: number;
  disabled?: boolean;
  handle?: "yellow" | "black";
  step?: number;
}

// eslint-disable-next-line react/display-name
export const SliderStep = memo(
  ({
    value,
    handleChange,
    step,
    maxValue,
    disabled,
    handle = "yellow",
  }: SliderProps) => {
    return (
      <div className={clsx(styles.slider, styles[handle])}>
        <Slider
          disabled={disabled}
          marks={{ 0: 0, [maxValue]: 1 }}
          value={value}
          onChange={(e: number) => {
            if (handleChange) handleChange(e);
          }}
          range={false}
          max={maxValue}
          step={step}
          tipFormatter={(value: number | undefined) => {
            if (!value) return `0%`;
            return `${Math.floor((value * 100) / maxValue)}%`;
          }}
        />
      </div>
    );
  }
);
