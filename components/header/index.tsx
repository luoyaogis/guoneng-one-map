"use client";
import { Layout } from "antd";
import { useRouter } from "next/navigation";
import styles from "./header.module.scss";
import { ArrowRightOutlined, RightOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;

const Header = () => {
  const router = useRouter();
  return (
    <AntHeader className={styles.header}>
      <div className={styles.title}>国能资源一张图</div>

      <div
        className={styles.return}
        onClick={() => window.open("http://172.30.1.117")}
      >
        国能时空信息平台
        <ArrowRightOutlined />
      </div>
    </AntHeader>
  );
};

export default Header;
