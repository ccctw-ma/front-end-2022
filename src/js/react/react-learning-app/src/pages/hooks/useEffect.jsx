/*
 * @Author: msc
 * @Date: 2022-06-15 22:49:23
 * @LastEditTime: 2022-06-15 22:58:31
 * @LastEditors: msc
 * @Description: 
 */


import React, { useLayoutEffect } from 'react';

import { useState, useEffect } from 'react';


function Name({ name }) {
    useEffect(() => {
        console.log(`useEffect create ${name}`);
        return () => {
            console.log(`useEffect destroy ${name}`);
        }
    }, [name])

    useLayoutEffect(() => {
        console.log(`useLayoutEffect create ${name}`);
        return () => {
            console.log(`useLayoutEffect destroy ${name}`);
        }
    }, [name])
    return <span>{name}</span>
}

export default function UseEffect() {

    const [name, setName] = useState('a')
    return (
        <div>
            <Name name={name}></Name>
            <p onClick={() => setName('b')}>Fuck you react</p>
        </div>
    )
}