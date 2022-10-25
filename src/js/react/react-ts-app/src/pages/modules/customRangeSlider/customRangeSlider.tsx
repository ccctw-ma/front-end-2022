/*
 * @Author: msc
 * @Date: 2022-09-14 22:26:43
 * @LastEditTime: 2022-09-14 23:01:40
 * @LastEditors: msc
 * @Description:
 */

import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";

export default function CustomRangeSlider() {
    const [value, setValue] = useState<number>(50);
    const label = useRef<HTMLLabelElement>(null);
    const range = useRef<HTMLInputElement>(null);

    const scale = (
        num: number,
        in_min: number,
        in_max: number,
        out_min: number,
        out_max: number
    ) => {
        return (
            ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
        );
    };
    useEffect(() => {
        const rangeWidth = getComputedStyle(range.current!).getPropertyValue(
            "width"
        );

        const labelWidth = getComputedStyle(label.current!).getPropertyValue(
            "width"
        );
        const range_width = +rangeWidth.substring(0, rangeWidth.length - 2);
        const label_width = +labelWidth.substring(0, labelWidth.length - 2);
        const max = 100;
        const min = 0;
        const left =
            value * (range_width / max) -
            label_width / 2 +
            scale(value, min, max, 12, -12);

        label.current!.style.left = `${left}px`;
    }, [value]);
    return (
        <div className={styles.main}>
            <h2>Custom Range Slider</h2>
            <div className={styles.container}>
                <input
                    type="range"
                    ref={range}
                    min={0}
                    max={100}
                    onInput={(e) => {
                        setValue(e.currentTarget.valueAsNumber);
                    }}
                />
                <label htmlFor="range" ref={label}>
                    {value}
                </label>
            </div>
        </div>
    );
}
