"use client";
import styles from "./legend.module.scss";
const monitors = [
  {
    title: "煤矿",
    img: "/images/index/煤.png",
  },
  {
    title: "电厂",
    img: "/images/index/电.png",
  },
  {
    title: "化工",
    img: "/images/index/化.png",
  },
  {
    title: "运输场站",
    img: "/images/index/运.png",
  },
];

const weathers = [
  {
    title: "铁路",
    img: "/images/index/铁路.png",
  },
  {
    title: "公路",
    img: "/images/index/公路.png",
  },
];

const locations = [
  {
    title: "人员",
    img: "/images/index/human.png",
  },
  {
    title: "车辆",
    img: "/images/index/car.png",
  },
];

export default ({ module }: { module: string }) => {
  const renderMonitor = () => {
    return monitors.map((legend) => {
      return (
        <div className={styles.legend}>
          <img src={legend.img} alt="" className={styles.icon} />
          <span className={styles.name}>{legend.title}</span>
        </div>
      );
    });
  };

  const renderRoad = () => {
    return weathers.map((legend) => {
      return (
        <div className={styles.legend}>
          <img
            src={legend.img}
            alt=""
            className={styles.icon}
            style={{ width: 50, height: 10 }}
          />
          <span className={styles.name}>{legend.title}</span>
        </div>
      );
    });
  };

  const renderCompany = () => {
    return (
      <div className={styles.legend}>
        <img src="/images/index/company.png" alt="" className={styles.icon} />
        <span className={styles.name}>公司</span>
      </div>
    );
  };

  const renderLocation = () => {
    return locations.map((legend) => {
      return (
        <div className={styles.legend}>
          <img src={legend.img} alt="" className={styles.icon} />
          <span className={styles.name}>{legend.title}</span>
        </div>
      );
    });
  };

  return (
    <div
      className={styles.legends}
      style={{
        display: ["total", "weather"].includes(module) ? "none" : "block",
      }}
    >
      {module === "monitor" ? renderMonitor() : null}
      {module === "road" ? renderRoad() : null}
      {module === "location" ? renderLocation() : null}
      {module === "company" ? renderCompany() : null}
    </div>
  );
};
