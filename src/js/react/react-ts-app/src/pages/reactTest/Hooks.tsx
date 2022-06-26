/*
 * @Author: msc
 * @Date: 2022-06-24 11:13:07
 * @LastEditTime: 2022-06-24 15:37:45
 * @LastEditors: msc
 * @Description:
 */

import React, { useEffect, useLayoutEffect, useState } from "react";

interface User {
  name: string;
  id: number;
}

export default function Hooks() {
  const [count, setCount] = useState<number>(0);

  let c = 1;

  useLayoutEffect(() => {
    c += 1;
    console.log("useLayoutEffect", c);
  });

  useEffect(() => {
    console.log("useEffect", c);
    setCount(2);
  }, []);
  return <div>{c}</div>;
}
