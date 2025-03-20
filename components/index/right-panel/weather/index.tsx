"use client";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import styles from "./weather.module.scss";

const options: echarts.EChartsOption = {
  grid: {
    left: 50,
  },
  xAxis: {
    type: "category",
    data: ["00:00", "06:00", "12:00", "18:00", "24:00"],
    axisLabel: {
      color: "#fff",
    },
    axisLine: {
      lineStyle: {
        color: "#fff",
      },
    },
  },
  yAxis: {
    type: "value",
    name: "24小时气温变化",
    axisLabel: {
      color: "#fff",
    },
    axisLine: {
      lineStyle: {
        color: "#fff",
      },
    },
  },
  series: [
    {
      data: [20, 18, 24, 22, 20],
      type: "line",
      smooth: true,
      label: {
        color: "#fff",
      },
    },
  ],
};

const Weather = () => {
  return (
    <>
      <Card title="气温变化" className={styles.card}>
        <div className={styles.weather}>
          <div className={styles.left}>
            <span style={{ color: "#29a7f0", fontSize: 22 }}>黑岱沟煤矿</span>
            <span>当日温度</span>
            <span>
              <strong style={{ color: "#f40", marginRight: 5, fontSize: 16 }}>
                15
              </strong>
              摄氏度
            </span>
          </div>
          <div className={styles.right}>
            <span>当前温度</span>
            <span style={{ color: "#f59a23", fontSize: 22 }}>8-20摄氏度</span>
            <span>
              较昨日
              <strong style={{ color: "#f40", marginRight: 5, fontSize: 16 }}>
                +5
              </strong>
              摄氏度
            </span>
          </div>
        </div>
        <ReactECharts option={options} />
      </Card>
    </>
  );
};

export default Weather;
