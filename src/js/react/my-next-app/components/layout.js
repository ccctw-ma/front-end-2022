/**
 * @Author: msc
 * @Date: 2022-04-12 22:18:59
 * @LastEditTime: 2022-04-12 22:21:05
 * @LastEditors: msc
 * @Description: 
 */

import styles from './layout.module.css'

export default function Layout({ children }) {
    return <div className={styles.container}>{children}</div>
}
