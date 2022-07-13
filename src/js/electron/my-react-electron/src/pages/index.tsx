/*
 * @Author: msc
 * @Date: 2022-06-25 00:38:57
 * @LastEditTime: 2022-07-05 23:03:54
 * @LastEditors: msc
 * @Description:
 */

import React, { useEffect, useState } from "react";

interface User {
  name: string;
  age: number;
}

const Home: React.FC = () => {
  const [user, SetUser] = useState<User>({ name: "Hello", age: 12 });

  useEffect(() => {
    // console.log(window.electronAPI.desktop);
    // console.log(window.electronAPI);
  }, []);

  window.electronAPI.handleCounter((event: any, value: number) => {
    console.log(value);

    const counter: any = document.getElementById("counter");

    const oldValue = Number(counter?.innerText ?? 0);
    const newValue = oldValue + value;
    if (counter) {
      counter.innerText = newValue;
      event.sender.send("counter-value", newValue);
    }
  });

  return (
    <div>
      <div className="w-full text-blue-300 text-center text-2xl font-extrabold">
        Hello tailwindcss {user.age} + {user.name}
        fuck
        <div>
          <button
            onClick={() => {
              window.electronAPI.setTitle(new Date().toISOString());
            }}
          >
            更改标题
          </button>

          <button
            onClick={async () => {
              const filePath = await window.electronAPI.openFile();
              const filePathElement: any | null =
                document.getElementById("filePath");
              if (filePathElement) {
                filePathElement.innerText = filePath;
              }
            }}
          >
            Open a File
            <strong id="filePath"></strong>
          </button>
        </div>
      </div>
      <div>
        Current value: <strong id="counter">0</strong>
      </div>

      <div className="flex flex-column mt-4">
        <p>
          Current theme source: <strong id="theme-source">System</strong>
        </p>

        <button
          onClick={async () => {
            const isDarkMode: boolean = await window.electronAPI.toggle();
            const themeSource: any | null =
              document.getElementById("theme-source");
            themeSource.innerHTML = isDarkMode ? "Dark" : "Light";
          }}
        >
          Toggle Dark
        </button>
        <button
          onClick={async () => {
            await window.electronAPI.system();
            const themeSource: any | null =
              document.getElementById("theme-source");
            themeSource.innerHTML = "System";
          }}
        >
          Reset to System Theme
        </button>
      </div>
      <div className="flex mt-4">
        <p>Drag the boxes below to somewhere in your Os</p>
        <button
          className=" border-2 border-solid border-black rounded-[3px] p-[5px] inline-block"
          draggable={true}
          id="drag1"
          onDragStart={(e) => {
            e.preventDefault();
            window.electronAPI.startDrag("drag-and-drop-1.md");
          }}
        >
          Drag me - File1
        </button>
        <button
          className=" border-2 border-solid border-black rounded-[3px] p-[5px] inline-block"
          draggable={true}
          id="drag2"
          onDragStart={(e) => {
            e.preventDefault();
            window.electronAPI.startDrag("drag-and-drop-2.md");
          }}
        >
          Drag me - File2
        </button>
      </div>
    </div>
  );
};

export default Home;
