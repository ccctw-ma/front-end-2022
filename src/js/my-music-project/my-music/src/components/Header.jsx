/*
 * @Author: msc
 * @Date: 2022-02-07 22:31:43
 * @LastEditTime: 2022-02-07 23:35:39
 * @LastEditors: msc
 * @Description: 界面的header
 */

import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Avatar, Image, Input, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./Header.module.css";
const { Search } = Input;
export default function Header() {
  return (
    <Row justify="space-around" >
      <Col span={8}>
        <Search
          placeholder=""
          onSearch={() => {}}
          enterButton
        />
      </Col>
      <Col span={8}>
        <Avatar
          src={
            <Image
              src="https://joeschmoe.io/api/v1/random"
              style={{ width: 32 }}
            />
          }
        />
      </Col>
    </Row>
  );
}
