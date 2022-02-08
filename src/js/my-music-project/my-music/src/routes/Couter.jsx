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
import {
  infoActions,
  initInfo,
  drivedInfo,
  infoAsyncActions,
} from "../stores/infoSlice";
import { useGetHotQuery, useGetMusicQuery } from "../stores/netEaseSlice";
import styles from "./Counter.module.css";

export function Counter() {
  const count = useSelector(selectCount);
  const info = useSelector(drivedInfo);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState("2");
  const { data, isLoading, isSuccess, isError } = useGetHotQuery();
  const { _data, _isLoading, _isSuccess, _isError } = useGetMusicQuery();

  let content;
  if (isLoading) {
    content = <div>isLoading</div>;
  } else if (isSuccess) {
    console.log(data);
    content = (
      <ul>
        {data.data.map((e) => (
          <li key={e.score}>
            {e.searchWord} + {e.score}{" "}
          </li>
        ))}
      </ul>
    );
  } else if (isError) {
    content = <div>isError</div>;
  }

  let music;

  music = (
    <div style={{ width: "200px", height:"200px" }}>
      music
      <audio src="https://sveltejs.github.io/assets/music/holst.mp3" id="music" controls ></audio>
      <audio src="http://m7.music.126.net/20220208005734/285b6c3f095271e4e98b89ca083bb7b7/ymusic/0fd6/4f65/43ed/a8772889f38dfcb91c04da915b301617.mp3" id="music" controls ></audio>
      <audio src="https://sveltejs.github.io/assets/music/mozart.mp3" id="music" controls ></audio>
      
    </div>

    
  );

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
        <button onClick={() => dispatch(infoActions.setInfo("Hello"))}>
          setInfoHello
        </button>
        <button onClick={() => dispatch(infoAsyncActions.initInfo())}>
          initInfo
        </button>
      </div>
      <div className={styles.row}>{content}</div>
      <div className={styles.row}>{music}</div>
    </div>
  );
}
