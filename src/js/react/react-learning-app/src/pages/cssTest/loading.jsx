/*
 * @Author: msc
 * @Date: 2022-06-14 11:03:50
 * @LastEditTime: 2022-06-15 18:32:05
 * @LastEditors: msc
 * @Description: 
 */
import React, { useState, useRef } from 'react';

export default function Loading() {

    const myButton = useRef(null);

    const [time, setTime] = useState("");

    return (
        <div>
            {/* I am loading now !!! */}
            <div>
            </div>
            <button ref={myButton}
                onMouseDown={() => {
                    let time = new Date().getTime();
                    setTime(time);
                }}
                onMouseUp={() => {
                    console.log((new Date().getTime() - time) / 1000);

                }}
            >
                click me

            </button>
        </div>
    )
}