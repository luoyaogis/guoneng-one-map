"use client";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Input,
  Progress,
  Row,
  Table,
} from "antd";
import { DesktopOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./location.module.scss";
import dayjs from "dayjs";
import TrajectoryAnimation from "@/utils/TrajectoryAnimation.ts";
import { useEffect, useRef, useState } from "react";

const dataSource = [
  {
    key: 1,
    user: "用户1",
    startTime: dayjs().startOf("date").format("YYYY-MM-DD HH:mm:ss"),
    endTime: dayjs().endOf("date").format("YYYY-MM-DD HH:mm:ss"),
    startPoint: "--",
    endPoint: "--",
  },
  {
    key: 2,
    user: "用户2",
    startTime: dayjs().startOf("date").format("YYYY-MM-DD HH:mm:ss"),
    endTime: dayjs().endOf("date").format("YYYY-MM-DD HH:mm:ss"),
    startPoint: "--",
    endPoint: "--",
  },
];

const Location = () => {
  const [value, setValue] = useState("");
  const [datas, setDatas] = useState<(typeof dataSource)[0][]>([]);
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
    },
    {
      title: "人员",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "起点",
      dataIndex: "startPoint",
      key: "startPoint",
    },
    {
      title: "终点",
      dataIndex: "endPoint",
      key: "endPoint",
    },
  ];

  const animationRef = useRef<TrajectoryAnimation>(null);
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
          <Row style={{ marginBottom: 10 }}>
            <Col span={17}>
              <Input value={value} onChange={(e) => setValue(e.target.value)} />
            </Col>
            <Col offset={1}>
              <Button
                type="primary"
                onClick={() => {
                  setValue("");
                  setDatas(dataSource);
                }}
              >
                搜索
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns as any[]}
            scroll={{ x: 600 }}
            size="small"
            dataSource={datas}
            pagination={false}
          />
        </ConfigProvider>
      </>
    );
  };

  const renderOnline = () => {
    return (
      <>
        <div className={styles.progress}>
          <Progress
            type="circle"
            strokeColor="#ff9420"
            percent={Number(((28 / 68) * 100).toFixed(0))}
            format={(percent) => {
              return (
                <div className={styles.circle} style={{ color: "#ff9420" }}>
                  <span className={styles.meta}>在线人员</span>
                  <span className={styles.value}>{percent}%</span>
                </div>
              );
            }}
          />
          <Progress
            type="circle"
            strokeColor="#5473e8"
            percent={Number(((168 / 382) * 100).toFixed(0))}
            format={(percent) => {
              return (
                <div className={styles.circle} style={{ color: "#5473e8" }}>
                  <span className={styles.meta}>在线设备</span>
                  <span className={styles.value}>{percent}%</span>
                </div>
              );
            }}
          />
        </div>
        <div className={styles.onlines}>
          <div className={styles.icon}>
            <UserOutlined />
          </div>

          <div className={styles.online}>
            <div className={styles.value}>68</div>
            <div className={styles.label}>总人数</div>
          </div>
          <div className={styles.online}>
            <div className={styles.value}>28</div>
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
            <div className={styles.value}>168</div>
            <div className={styles.label}>在线设备</div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Card title="轨迹播放" className={styles.card}>
        {renderTrack()}
      </Card>
      <Card title="在线统计" className={styles.card}>
        {renderOnline()}
      </Card>
    </>
  );
};

export default Location;
