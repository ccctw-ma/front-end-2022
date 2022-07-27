/*
 * @Author: msc
 * @Date: 2022-07-12 20:56:30
 * @LastEditTime: 2022-07-12 21:26:06
 * @LastEditors: msc
 * @Description:
 */

import { useState } from "react";
import { useRecoilState } from "recoil";
import { textState } from "../../store";

let id: number = 0;
const getId = (): number => {
  return id++;
};

export default function Recoil() {
  const [text, setText] = useRecoilState(textState);
  const [inputValue, setInputValue] = useState<string>('');
  
  return (
    <>
      <p>{text}</p>
      <span>Hello Recoil!!!</span>
      <br />
      <button
        onClick={() => {
          setText(String(Date.now()));
        }}
      >
        click me to change text
      </button>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

    </>
  );
}
