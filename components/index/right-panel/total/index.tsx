"use client";
import { Button, Card, ConfigProvider, Table } from "antd";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import styles from "./total.module.scss";
import { DesktopOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import TrajectoryAnimation from "@/utils/TrajectoryAnimation.ts";

const monitor = [
  {
    icon: "/images/index/煤.png",
    label: "煤矿区",
    value: 79,
  },
  {
    icon: "/images/index/电.png",
    label: "电厂",
    value: 620,
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
    icon: <UserOutlined />,
  },
  {
    label: "在线人数",
    value: 28,
    icon: <UserOutlined />,
  },
  {
    label: "终端设备",
    value: 382,
    icon: <DesktopOutlined />,
  },
  {
    label: "在线设备",
    value: 168,
    icon: <DesktopOutlined />,
  },
];

const dataSource = [
  {
    key: 1,
    user: "张诚扬",
    startTime: dayjs().startOf("date").format("YYYY-MM-DD"),
    endTime: dayjs().endOf("date").format("YYYY-MM-DD"),
    startPoint: "111.26319117616382,39.76300051872502",
    endPoint: "111.22126025719254,39.75183049714474",
  },
];

const options: echarts.EChartsOption = {
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
    top: "center",
    width: 300,
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
        { value: 200, name: "铁路" },
        { value: 500, name: "公路" },
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
        <ReactECharts option={options} style={{ width: "100%", height: 180 }} />
      </div>
    );
  };

  const renderLocation = () => {
    return (
      <>
        <div className={styles.onlines}>
          <div className={styles.icon}>
            <UserOutlined />
          </div>

          <div className={styles.online}>
            <div className={styles.value}>68</div>
            <div className={styles.label}>总人数</div>
          </div>
          <div className={styles.online}>
            <div className={styles.value}>38</div>
            <div className={styles.label}>在线人员</div>
          </div>
        </div>
        <div className={styles.onlines}>
          <div className={styles.icon}>
            <DesktopOutlined />
          </div>
          <div className={styles.online}>
            <div className={styles.value}>382</div>
            <div className={styles.label}>终端设备</div>
          </div>
          <div className={styles.online}>
            <div className={styles.value}>38</div>
            <div className={styles.label}>在线设备</div>
          </div>
        </div>
      </>
    );
  };
  const columns = [
    {
      title: "操作",
      dataIndex: "action",
      fixed: "right",
      render: () => {
        return (
          <Button type="link" onClick={handlePlay}>
            轨迹播放
          </Button>
        );
      },
      width: 100,
    },
    {
      title: "人员",
      dataIndex: "user",
      key: "user",
      width: 100,
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      width: 100,
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      key: "endTime",
      width: 100,
    },
    {
      title: "起点",
      dataIndex: "startPoint",
      key: "startPoint",
      width: 200,
    },
    {
      title: "终点",
      dataIndex: "endPoint",
      key: "endPoint",
      width: 200,
    },
  ];
  const animationRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      window.map.removeLayer("track");
      window.map.removeLayer("track_polyline");
    };
  }, []);
  const handlePlay = () => {
    window.map.removeLayer("track");
    window.map.removeLayer("track_polyline");
    fetch("/track.geojson")
      .then((response) => response.json())
      .then((response) => {
        animationRef.current = new TrajectoryAnimation({
          path: response.coordinates,
          speed: 1000, // 100 像素/秒
          iconUrl: "/images/index/human.png", // 图标路径
          repeat: false,
        });
        animationRef.current.start();
      });
    // 初始化轨迹动画
    // const path = [
    //   [116.40151977539064, 40.00118846453713],
    //   [116.41293525695801, 40.00158295726282],
    //   [116.42477989196777, 39.999741971709454],
    //   [116.42992973327638, 39.99908446483972],
    //   [116.43542289733888, 39.99428447289062],
    // ];
    // animationRef.current = new TrajectoryAnimation({
    //   path: path,
    //   speed: 100, // 100 像素/秒
    //   iconUrl: "/images/index/car.png", // 图标路径
    //   repeat: false,
    // });
    // animationRef.current.layer.setZIndex(10);
    // animationRef.current.layer.set("id", "track");
    // 添加动画图层到地图
    // window.map.addLayer(animationRef.current.layer);

    // 开始动画
    // animationRef.current.start();
  };

  const renderTrack = () => {
    return (
      <>
        <ConfigProvider
          theme={{
            // 1. 单独使用暗色算法
            // algorithm: theme.darkAlgorithm,
            // 2. 组合使用暗色算法与紧凑算法
            // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
            components: {
              Input: {
                colorBgContainer: "transparent", // 默认状态背景
                hoverBg: "transparent", // 悬停状态背景
                activeBg: "transparent", // 激活状态背景
                colorBorder: "#ccc", // 可选：调整边框颜色
                activeBorderColor: "#fff",
                hoverBorderColor: "#fff",
                colorText: "#fff",
              },
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
            columns={columns as any[]}
            scroll={{ x: 600 }}
            size="small"
            dataSource={dataSource}
            pagination={false}
          />
        </ConfigProvider>
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
      <Card title="轨迹播放" className={styles.card}>
        {renderTrack()}
      </Card>
    </>
  );
};

export default Total;
