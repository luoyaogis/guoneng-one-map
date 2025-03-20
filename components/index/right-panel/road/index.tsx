"use client";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import styles from "./road.module.scss";

const pieOptions: echarts.EChartsOption = {
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "horizontal",
    left: "center",
    top: "top",
    textStyle: {
      color: "fff",
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
        { value: 227, name: "铁路" },
        { value: 161, name: "公路" },
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

const barOptions: echarts.EChartsOption = {
  grid: {
    left: 40,
  },
  xAxis: {
    type: "category",
    data: ["G351", "G241", "G242", "G364", "G476", "G255"],
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
    name: "单位（公里）",
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
      data: [120, 200, 150, 120, 200, 170],
      barWidth: 20,
      type: "bar",
    },
  ],
};

const Road = () => {
  const renderPieChart = () => {
    return (
      <div className={styles.chart} style={{ height: 300 }}>
        <ReactECharts
          option={pieOptions}
          style={{ width: "100%", height: 250 }}
        />
      </div>
    );
  };

  const renderBarChart = () => {
    return (
      <div className={styles.chart} style={{ height: 300 }}>
        <ReactECharts
          option={barOptions}
          style={{ width: "100%", height: 300 }}
        />
      </div>
    );
  };

  return (
    <>
      <Card title="路网统计" className={styles.card}>
        {renderPieChart()}
      </Card>
      <Card title="铁路干线统计" className={styles.card}>
        {renderBarChart()}
      </Card>
    </>
  );
};

export default Road;
