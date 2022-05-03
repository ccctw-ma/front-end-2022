import Head from "next/head";
import Image from "next/image";
import styles from "../styles/App.module.css";
import Link from "next/link";
import Header from "../components/Header";
import MusicPlay from "../components/MusicPlay.jsx";
import HomeMusicPlay from "../components/HomeMusicPlay";
import MainContent from "../components/MainContent.jsx";

export default function Home() {
  return (
    <div className="container h-screen">
      <div className="absolute top-0 left-0 w-full h-12 py-2">
        <Header />
      </div>

      <div className={`${styles.content} flex flex-col`}>
        <MainContent />
      </div>

      <div className="absolute bottom-0 left-0 h-14 w-full border-t-[1px] border-gray-200 border-solid">
        <HomeMusicPlay />
      </div>
    </div>
  );
}
