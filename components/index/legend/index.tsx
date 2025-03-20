"use client";
import styles from "./legend.module.scss";

const legends = [
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
  {
    title: "铁路",
    img: "/images/index/铁路.png",
  },
  {
    title: "公路",
    img: "/images/index/公路.png",
  },
  {
    title: "人员",
    img: "/images/index/human.png",
  },
  {
    title: "车辆",
    img: "/images/index/car.png",
  },
];

export default () => {
  const renderLegend = () => {
    return legends.map((legend) => {
      return (
        <div className={styles.legend}>
          <img src={legend.img} alt="" className={styles.icon} />
          <span className={styles.name}>{legend.title}</span>
        </div>
      );
    });
  };

  return <div className={styles.legends}>{renderLegend()}</div>;
};
