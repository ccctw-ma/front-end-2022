/*
 * @Author: msc
 * @Date: 2022-06-14 11:06:29
 * @LastEditTime: 2022-06-14 11:18:05
 * @LastEditors: msc
 * @Description: 
 */

import React from 'react'

import { Link, Outlet } from 'react-router-dom'

export default function CssTest() {

    return (
        <div>
            <h1>
                This is cssTest!!!
            </h1>
            <ul>
                <li>
                    <Link to={"loading"}>loading</Link>

                </li>
                <li>
                    <Link to={"angle"}>angle</Link>
                </li>
            </ul>

            <Outlet></Outlet>
        </div>

    )
}