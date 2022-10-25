/*
 * @Author: msc
 * @Date: 2022-08-31 21:11:08
 * @LastEditTime: 2022-08-31 21:25:45
 * @LastEditors: msc
 * @Description:
 */

import styles from "./index.module.css";

export default function HoverBoard() {
    const SQUARES = 1000;
    const colors = ["#e74c3c", "#8e44ad", "#3498db", "#e67e22", "#2ecc71"];
    return (
        <div className={styles.main}>
            <div className={styles.container}>
                {new Array(SQUARES).fill(0).map((_, i) => {
                    return (
                        <div
                            className={styles.square}
                            key={i}
                            onMouseOver={(e) => {
                                const color =
                                    colors[~~(Math.random() * colors.length)];
                                e.currentTarget.style.background = color;
                                e.currentTarget.style.boxShadow = `0 0 2px ${color}, 0 0 10px ${color}`;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#1d1d1d";
                                e.currentTarget.style.boxShadow =
                                    "0 0 2px #000";
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
