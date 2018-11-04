import React, { ChangeEvent } from "react";

interface SliderProps {
  min: number;
  max: number;
  value: number;
  step?: number;
  label: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
}

export const Slider = ({
  min,
  max,
  value,
  step = 0.1,
  label,
  onChange
}: SliderProps) => {
  return (
    <>
      <label>
        {label}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={onChange}
        />
      </label>
      <p>{value}</p>
    </>
  );
};
