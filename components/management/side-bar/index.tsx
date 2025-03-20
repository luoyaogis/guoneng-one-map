"use client";

import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";

interface SideBarProps {
  changeActiveKeys: (keys: string) => void;
}

type MenuItem = Required<MenuProps>["items"][number];

const SideBar: React.FC<SideBarProps> = ({ changeActiveKeys }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [current, setCurrent] = useState(pathname.split("/")[2] || "colliery");
  const [openKeys, setOpenKeys] = useState(["energy-management"]);
  const items: MenuItem[] = [
    getItem("能源管理", "energy-management", null, [
      getItem("煤矿能源", "colliery"),
      getItem("变化监测", "monitor"),
    ]),
    getItem("模板管理", "template", null),
  ];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    setOpenKeys(keys);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    changeActiveKeys(e.key as string);
    setCurrent(e.key);
  };

  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      selectedKeys={[current]}
      onClick={onClick}
      onOpenChange={onOpenChange}
      style={{ width: 240 }}
      items={items}
    />
  );
};

export default SideBar;
