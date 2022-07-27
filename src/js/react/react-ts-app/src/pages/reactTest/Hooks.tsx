/*
 * @Author: msc
 * @Date: 2022-06-24 11:13:07
 * @LastEditTime: 2022-07-08 22:58:49
 * @LastEditors: msc
 * @Description:
 */

import React, { useEffect, useLayoutEffect, useState } from "react";

interface User {
  name: string;
  id: number;
}

export default function Hooks() {
  const [count, setCount] = useState<number>(10);

  let c = 1;

  useLayoutEffect(() => {
    c += 1;
    console.log("useLayoutEffect", c);
  });

  useEffect(() => {
    console.log("useEffect", c);
    setTimeout(() => {
      setCount(2);
    }, 2000);
  }, []);
  return (
    <div>
      <span>{c}</span>
      <br />
      <span>{count}</span>
    </div>
  );
}

// console.log(Hooks);
