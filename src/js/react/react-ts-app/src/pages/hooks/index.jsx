/*
 * @Author: msc
 * @Date: 2022-06-15 22:50:53
 * @LastEditTime: 2022-06-15 23:07:16
 * @LastEditors: msc
 * @Description: 
 */


/*
 * @Author: msc
 * @Date: 2022-06-14 11:06:29
 * @LastEditTime: 2022-06-14 11:18:05
 * @LastEditors: msc
 * @Description: 
 */

import React from 'react'

import { Link, Outlet } from 'react-router-dom'

export default function Hooks() {

    return (
        <div>
            <h1>
                This is hooks Test !!!
            </h1>
            <ul>
                <li>
                    <Link to={"useEffect"}>useEffect</Link>

                </li>
            </ul>

            <Outlet></Outlet>
        </div>

    )
}