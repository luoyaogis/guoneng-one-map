"use client";
import { Card, ConfigProvider, Select, Table, Tabs } from "antd";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import styles from "./monitor.module.scss";
import { useEffect, useState } from "react";
import { eventEmitter } from "@/utils/events";

const barOptions: echarts.EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    bottom: "10%",
  },
  legend: {
    data: ["排土场", "排矸场", "林草地"],
    textStyle: {
      color: "#fff",
    },
  },
  xAxis: [
    {
      type: "category",
      axisTick: { show: false },
      axisLabel: {
        color: "#fff",
      },
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      data: ["2023", "2024", "2025"],
    },
  ],
  yAxis: [
    {
      type: "value",
      axisLabel: {
        color: "#fff",
      },
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#d9d9d9",
        },
      },
    },
  ],
  series: [
    {
      name: "排土场",
      type: "bar",
      emphasis: {
        focus: "series",
      },
      color: "#36cfc9",
      barWidth: 20,
      barGap: "20%",
      data: [320, 332, 301],
    },
    {
      name: "排矸场",
      type: "bar",
      emphasis: {
        focus: "series",
      },
      color: "#40a9ff",
      barWidth: 20,
      barGap: "20%",
      data: [220, 182, 191],
    },
    {
      name: "林草地",
      type: "bar",
      emphasis: {
        focus: "series",
      },
      color: "#73d13d",
      barWidth: 20,
      barGap: "20%",
      data: [150, 232, 201],
    },
  ],
};

const Bendi = () => {
  const columns = [
    {
      title: "公司",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "数量",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "排土场复垦率",
      dataIndex: "column1",
      key: "column1",
    },
    {
      title: "占地面积(公顷)",
      dataIndex: "column2",
      key: "column2",
    },
    {
      title: "到界面积(公顷)",
      dataIndex: "column3",
      key: "column3",
    },
  ];
  const renderTable = () => {
    return (
      <ConfigProvider
        theme={{
          components: {
            Table: {
              colorBgContainer: "transparent", // 默认状态背景
              rowHoverBg: "transparent",
              headerBg: "transparent",
              headerColor: "#fff",
              colorText: "#fff",
              fixedHeaderSortActiveBg: "#fff",
            },
          },
        }}
      >
        <Table
          columns={columns}
          scroll={{ x: 500 }}
          pagination={false}
          size="small"
          dataSource={[
            {
              company: "神华新疆能源有限责任公司",
              count: 3,
              column1: "98.39%",
              column2: "897.19",
              column3: "242.86",
            },
            {
              company: "神华准能集团有限责任公司",
              count: 1,
              column1: "99.36%",
              column2: "1143.97",
              column3: "635.98",
            },
          ]}
        />
      </ConfigProvider>
    );
  };
  const renderChart = () => {
    return (
      <div className={styles.chart} style={{ height: 300 }}>
        <ReactECharts
          option={{
            grid: {
              left: 40,
            },
            xAxis: {
              type: "category",
              data: ["占地面积", "到界面积", "已复垦面积"],
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
              name: "单位（公倾）",
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
                data: [120, 200, 150],
                type: "bar",
                barWidth: 30,
              },
            ],
          }}
        />
      </div>
    );
  };
  return (
    <>
      <Card title="2024年露天矿生态本底" className={styles.card}>
        {renderTable()}
      </Card>
      <Card title="指标趋势分析" className={styles.card}>
        {renderChart()}
      </Card>
    </>
  );
};

const Jiance = () => {
  const columns = [
    {
      title: "公司",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "数量",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "排土场复垦率差值",
      dataIndex: "column1",
      key: "column1",
    },
    {
      title: "占地面积差值(公顷)",
      dataIndex: "column2",
      key: "column2",
    },
    {
      title: "到界面积差值(公顷)",
      dataIndex: "column3",
      key: "column3",
    },
  ];
  const renderTable = () => {
    return (
      <ConfigProvider
        theme={{
          components: {
            Table: {
              colorBgContainer: "transparent", // 默认状态背景
              rowHoverBg: "transparent",
              headerBg: "transparent",
              headerColor: "#fff",
              colorText: "#fff",
              fixedHeaderSortActiveBg: "#fff",
            },
          },
        }}
      >
        <Table
          columns={columns}
          scroll={{ x: 500 }}
          pagination={false}
          size="small"
          dataSource={[
            {
              company: "神华北电胜利能源有限责任公司",
              count: 1,
              column1: "96.44%",
              column2: "54.46",
              column3: "45.73",
            },
            {
              company: "神华准能集团有限责任公司",
              count: 1,
              column1: "97.72%",
              column2: "55.28",
              column3: "59.39",
            },
          ]}
        />
      </ConfigProvider>
    );
  };
  const renderChart = () => {
    return (
      <div className={styles.chart} style={{ height: 300 }}>
        <ReactECharts
          option={{
            grid: {
              left: 40,
            },
            xAxis: {
              type: "category",
              data: ["占地面积差值", "到界面积差值", "已复垦面积差值"],
              axisLabel: {
                color: "#fff",
                interval: 0,
                rotate: 30,
              },
              axisLine: {
                lineStyle: {
                  color: "#fff",
                },
              },
            },
            yAxis: {
              type: "value",
              name: "单位（公倾）",
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
                data: [120, 200, 150],
                type: "bar",
                barWidth: 30,
              },
            ],
          }}
        />
      </div>
    );
  };
  return (
    <>
      <Card title="2022年与2021年变化监测情况" className={styles.card}>
        {renderTable()}
      </Card>
      <Card title="指标趋势分析" className={styles.card}>
        {renderChart()}
      </Card>
    </>
  );
};

const Tongji = () => {
  const columns = [
    {
      title: "年份",
      dataIndex: "year",
      key: "year",
      width: 70,
    },
    {
      title: "数量",
      dataIndex: "count",
      key: "count",
      width: 70,
    },
    {
      title: "排矸场绿化率",
      dataIndex: "column1",
      key: "column1",
      width: 140,
    },
    {
      title: "排土场复垦率",
      dataIndex: "column1",
      key: "column1",
      width: 140,
    },
    {
      title: "塌陷土地治理率",
      dataIndex: "column1",
      key: "column1",
      width: 160,
    },
    {
      title: "林地覆盖率",
      dataIndex: "column1",
      key: "column1",
      width: 120,
    },
    {
      title: "植被恢复率",
      dataIndex: "column1",
      key: "column1",
      width: 120,
    },
  ];

  const renderIndicatorTable = () => {
    return (
      <div className={styles.indicatorTable}>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                colorBgContainer: "transparent", // 默认状态背景
                rowHoverBg: "transparent",
                headerBg: "transparent",
                headerColor: "#fff",
                colorText: "#fff",
                fixedHeaderSortActiveBg: "#fff",
              },
            },
          }}
        >
          <Table
            dataSource={[
              {
                key: 1,
                year: "2025",
                count: 50,
                type: "井工矿",
                company: "神东煤矿",
                column1: 85,
                column2: 85,
                column3: 85,
                column4: 85,
                column5: 85,
              },
              {
                key: 2,
                year: "2025",
                count: 50,
                type: "井工矿",
                company: "神东煤矿",
                column1: 85,
                column2: 85,
                column3: 85,
                column4: 85,
                column5: 85,
              },
              {
                key: 3,
                year: "2025",
                count: 50,
                type: "露天矿",
                company: "神东煤矿",
                column1: 85,
                column2: 85,
                column3: 85,
                column4: 85,
                column5: 85,
              },
            ]}
            columns={columns}
            pagination={false}
            scroll={{ x: 800 }}
            size="small"
            rowKey="key"
          />
        </ConfigProvider>
      </div>
    );
  };

  const renderAreaAnalysis = () => {
    return (
      <div className={styles.chart} style={{ height: 300 }}>
        <ReactECharts option={barOptions} />
      </div>
    );
  };
  return (
    <>
      <Card title="历史生态指标情况" className={styles.card}>
        {renderIndicatorTable()}
      </Card>
      <Card title="指标面积分析" className={styles.card}>
        {renderAreaAnalysis()}
      </Card>
    </>
  );
};

const tabs = [
  { label: "生态本底", key: "bendi" },
  { label: "变化监测", key: "jiance" },
  // { label: "统计", key: "tongji" },
];

const Monitor = () => {
  const [tab, setTab] = useState("bendi");
  useEffect(() => {
    eventEmitter.on("ai", () => {
      setTab("jiance");
    });
  }, []);
  return (
    <div className={styles.monitor}>
      <Tabs
        items={tabs}
        activeKey={tab}
        style={{ padding: "0 10px" }}
        onChange={(v) => setTab(v)}
      />
      {tab === "bendi" ? <Bendi /> : null}
      {tab === "tongji" ? <Tongji /> : null}
      {tab === "jiance" ? <Jiance /> : null}
    </div>
  );
};

export default Monitor;
