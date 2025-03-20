import {
  Avatar,
  Button,
  Col,
  ConfigProvider,
  Divider,
  Input,
  Row,
  Space,
} from "antd";
import { useCallback, useState } from "react";
import styles from "./chat.module.scss";
import { CloseOutlined } from "@ant-design/icons";
import { eventEmitter } from "@/utils/events";

const { Search } = Input;

export default () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<{ role: string; value: any }[]>([
    {
      role: "ai",
      value: "HI，我是智能助手，请问您有什么问题需要我的帮助？",
    },
  ]);

  const handleSend = () => {
    setMessages((message) => {
      return [
        ...message,
        {
          role: "user",
          value,
        },
        {
          role: "ai",
          value: "已完成。",
        },
      ];
    });
    setValue("");
    eventEmitter.emit("ai");
  };

  return (
    <>
      <div className={styles.chatImg} onClick={() => setVisible((v) => !v)}>
        <img src="/images/index/reboot.png" alt="" />
      </div>
      {visible ? (
        <div className={styles.chatList}>
          <div className={styles.header}>
            智能助手
            <CloseOutlined
              className={styles.close}
              onClick={() => setVisible(false)}
            />
          </div>

          {/* <Divider style={{ borderColor: "#aaa", margin: "8px 0" }} /> */}
          <div className={styles.messages}>
            {messages.map((m, i) => {
              return m.role === "user" ? (
                <div
                  className={styles.message}
                  key={i}
                  style={{ justifyContent: "flex-end" }}
                >
                  <div className={styles.content}>{m.value}</div>
                  <Avatar
                    className={styles.avatar}
                    src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                    style={{ marginRight: 10, height: 30, width: 30 }}
                  />
                </div>
              ) : (
                <div
                  className={styles.message}
                  key={i}
                  style={{ justifyContent: "flex-start" }}
                >
                  <Avatar
                    src="/images/index/reboot.png"
                    className={styles.avatar}
                  />
                  <div className={styles.content}>{m.value}</div>
                </div>
              );
            })}
          </div>
          {/* <Divider style={{ borderColor: "#aaa", margin: "8px 0" }} /> */}

          <div className={styles.inputLine}>
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
                },
              }}
            >
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <Button type="primary" onClick={handleSend}>
                  发送
                </Button>
              </Space.Compact>
              {/* <Row>
                <Col span={17}>
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </Col>
                <Col offset={1}>
                  <Button type="primary" onClick={handleSend}>
                    发送
                  </Button>
                </Col>
              </Row> */}
            </ConfigProvider>
          </div>
        </div>
      ) : null}
    </>
  );
};
