"use client";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import styles from "./total.module.scss";

const monitor = [
  {
    icon: "/images/index/煤.png",
    label: "煤矿区",
    value: 79,
  },
  {
    icon: "/images/index/电.png",
    label: "电厂",
    value: 79,
  },
  {
    icon: "/images/index/化.png",
    label: "化工厂",
    value: 35,
  },
  {
    icon: "/images/index/运.png",
    label: "运输站",
    value: 22,
  },
];

const location = [
  {
    label: "总人数",
    value: 69,
  },
  {
    label: "在线人数",
    value: 28,
  },
  {
    label: "终端设备",
    value: 382,
  },
  {
    label: "在线设备",
    value: 168,
  },
];

const options: echarts.EChartsOption = {
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "right",
    top: "center",
    textStyle: {
      color: "#fff",
    },
  },
  series: [
    {
      type: "pie",
      radius: "50%",
      label: {
        color: "#fff",
      },
      data: [
        { value: 300, name: "铁路" },
        { value: 500, name: "公路" },
        { value: 300, name: "皮带" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};

const Total = () => {
  const renderIndicators = () => {
    return (
      <>
        <div className={styles.indicators}>
          {monitor.map((m) => {
            return (
              <div className={styles.indicator} key={m.label}>
                <img src={m.icon} alt="" className={styles.icon} />
                <span className={styles.label}>{m.label}</span>
                <span className={styles.value}>{m.value}</span>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderRoadNetwork = () => {
    return (
      <div className={styles.chart}>
        <ReactECharts option={options} style={{ width: "100%", height: 250 }} />
      </div>
    );
  };

  const renderLocation = () => {
    return (
      <>
        <div className={styles.indicators}>
          {location.map((m) => {
            return (
              <div className={styles.indicator} key={m.label}>
                <span className={styles.label}>{m.label}</span>
                <span className={styles.value}>{m.value}</span>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <Card title="生态监测" className={styles.card}>
        {renderIndicators()}
      </Card>
      <Card title="路网管理" className={styles.card}>
        {renderRoadNetwork()}
      </Card>
      <Card title="北斗定位" className={styles.card}>
        {renderLocation()}
      </Card>
    </>
  );
};

export default Total;
