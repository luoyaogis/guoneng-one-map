"use client";
import styles from "./index.module.scss";
import MapContainer from "@/components/index/map";
import Legend from "@/components/index/legend";
import LeftPanel from "@/components/index/left-panel";
import RightPanel from "@/components/index/right-panel";
import Popup from "@/components/index/popup";
import AIChat from "@/components/index/chat";
import History from "@/components/index/history";
import { useState } from "react";

export default function Home() {
  const [module, setModule] = useState("total");
  return (
    <div className={styles.container}>
      <LeftPanel changeModule={(value) => setModule(value)} />
      <Legend />
      <Popup />
      {/* <AIChat />
      <History /> */}
      <MapContainer />
      <RightPanel module={module} />
    </div>
  );
}
