"use client";
import TotalComponent from "./total";
import MonitorComponent from "./monitor";
import RoadComponent from "./road";
import WeatherComponent from "./weather";
import LocationComponent from "./location";
import styles from "./right-panel.module.scss";

const RightPanel = ({ module }: { module: string }) => {
  return (
    <div className={styles.rightPanel}>
      {module === "total" ? <TotalComponent /> : null}
      {module === "monitor" ? <MonitorComponent /> : null}
      {module === "road" ? <RoadComponent /> : null}
      {module === "weather" ? <WeatherComponent /> : null}
      {module === "location" ? <LocationComponent /> : null}
    </div>
  );
};

export default RightPanel;
