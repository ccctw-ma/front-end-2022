/**
 * @Author: msc
 * @Date: 2022-01-28 16:59:34
 * @LastEditTime: 2022-01-28 16:59:35
 * @LastEditors: msc
 * @Description:
 */
import React, { useState } from "react";

// useSelector 拿数据 useDispath是改变数据
import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from "../stores/couterSlice";
import { infoActions, initInfo, drivedInfo,infoAsyncActions } from "../stores/infoSlice";
import styles from "./Counter.module.css";

export function Counter() {
  const count = useSelector(selectCount);
  const info = useSelector(drivedInfo);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState("2");
  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() =>
            dispatch(incrementByAmount(Number(incrementAmount) || 0))
          }
        >
          Add Amount
        </button>
        <button
          className={styles.asyncButton}
          onClick={() => dispatch(incrementAsync(Number(incrementAmount) || 0))}
        >
          Add Async
        </button>
      </div>
      <div className={styles.row}>
        <span>{info}</span>
        <button onClick={() => dispatch(infoActions.setInfo("Hello"))}>setInfoHello</button>
        <button onClick={() => dispatch(infoAsyncActions.initInfo())}>initInfo</button>
      </div>
    </div>
  );
}
