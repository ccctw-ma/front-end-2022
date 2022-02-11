/*
 * @Author: msc
 * @Date: 2022-02-07 22:31:43
 * @LastEditTime: 2022-02-11 23:19:27
 * @LastEditors: msc
 * @Description: 界面的header
 */

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, Link } from "react-router-dom";
import { Avatar, Image, Input, Row, Col, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./Header.module.scss";
import {
  useLoginMutation,
  useSearchMusicMutation,
} from "../stores/netEaseSlice";
import { setMusicList } from "../stores/musicSlice";
const { Search } = Input;
export default function Header() {
  const [login, { isLoading }] = useLoginMutation();
  const [searchMusic, { isSearchMusic }] = useSearchMusicMutation();
  const [profile, setProfile] = useState({});
  const dispatch = useDispatch();
  const handleLogin = async () => {
    const res = await login({ phone: "13633767977", password: "M.a.6397609" });
    console.log(res);
  };

  useEffect(() => {
    const init = async () => {
      const res = await login({
        phone: "13633767977",
        password: "M.a.6397609",
      });
      console.log(res);
      setProfile(res.data.profile);
      // dispatch(setMusicList([1,2,3,4]))
    };
    init();
  }, []);

  const handleSearchMusics = async (keywords) => {
    const res = await searchMusic(keywords);
    console.log(res);
    dispatch(setMusicList(res.data.result.songs))
  };
  return (
    <div className={styles.main}>
      <Row justify="space-around">
        <Col span={8}>
          <Search placeholder="" onSearch={handleSearchMusics} enterButton />
        </Col>
        <Col span={8}>
          <Avatar
            src={<Image src={profile.avatarUrl} style={{ width: 32 }} />}
          />

          {profile.nickname}
        </Col>
        <Col span={8}>
          <Link to="/invoices">Invoices</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/home">Home</Link>
          <Button onClick={handleLogin}>登陆</Button>
        </Col>
      </Row>
    </div>
  );
}
