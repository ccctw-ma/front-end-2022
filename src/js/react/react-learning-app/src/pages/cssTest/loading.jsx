/*
 * @Author: msc
 * @Date: 2022-06-14 11:03:50
 * @LastEditTime: 2022-06-21 11:55:05
 * @LastEditors: msc
 * @Description: 
 */
import React, { useState, useEffect, useCallback } from 'react';

export default function Loading() {

    const [a, setA] = useState(1);
    const [b, setB] = useState('b');


    useEffect(() => {
    }, [a, b])

    console.log('render');
    function handleClickWithPromise() {
        Promise.resolve().then(() => {
            console.log(a);
            setA(a => a + 1);
            console.log(a);
            setB('bb');
        })
    }

    function handleClickWithoutPromise() {
        console.log(a);
        setA(a => a + 1);
        console.log(a);
        setB('bb');
    }

    return (
        <div>

            <button onClick={handleClickWithPromise}>
                异步
            </button>

            <button onClick={handleClickWithoutPromise}>
                同步
            </button>
        </div>
    )
}