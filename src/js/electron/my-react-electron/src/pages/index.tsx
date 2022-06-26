/*
 * @Author: msc
 * @Date: 2022-06-25 00:38:57
 * @LastEditTime: 2022-06-25 01:16:47
 * @LastEditors: msc
 * @Description:
 */

import React, { useState } from "react";

interface User {
  name: string;
  age: number;
}

const Home: React.FC = () => {
  const [user, SetUser] = useState<User>({ name: "Hello", age: 12 });
  return (
    <div className="w-full text-blue-300 text-center text-2xl font-extrabold">
      Hello tailwindcss {user.age} + {user.name}
    </div>
  );
};

export default Home;
