/*
 * @Author: msc
 * @Date: 2022-02-07 22:31:43
 * @LastEditTime: 2022-02-21 22:35:25
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
import { useSearchMusicByMiGuMutation } from "../stores/miGuSlice";
import { setMusicList, setCurrrentKeyWords } from "../stores/musicSlice";
const { Search } = Input;
export default function Header() {
  const [login, { isLoading }] = useLoginMutation();
  const [searchMusic, { isSearchMusic }] = useSearchMusicMutation();
  const [searchMusicByMiGu] = useSearchMusicByMiGuMutation();
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
    // const netEaseRes = await searchMusic(keywords);
    dispatch(setCurrrentKeyWords(keywords));
    const miGuRes = await searchMusicByMiGu({ keywords, page: 1 });
    console.log(miGuRes);
    dispatch(
      setMusicList({
        type: "migu",
        songs: miGuRes.data.data,
        total: miGuRes.data.total,
      })
    );
  };
  return (
    <div className={styles.main}>
      <div>
        <Search placeholder="" onSearch={handleSearchMusics} enterButton />
      </div>

      <div>
        <Avatar src={<Image src={profile.avatarUrl} style={{ width: 32 }} />} />
      </div>

      <div>
        <Link to="/invoices">Invoices</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/home">Home</Link>
        <Button onClick={handleLogin}>登录</Button>
      </div>
    </div>
  );
}
