"use client";

import {
  AimOutlined,
  FormOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import { useState } from "react";
import styles from "./task.module.scss";
import { useRouter } from "next/navigation";

const columns = [
  {
    title: "任务名称",
    dataIndex: "taskName",
  },
  {
    title: "数据集名称",
    dataIndex: "datasetName",
  },
  {
    title: "几何特征",
    dataIndex: "geometric",
  },
  {
    title: "属性表名",
    dataIndex: "prop",
  },
  {
    title: "备注",
    dataIndex: "remark",
  },
];

const dataSource = [
  {
    taskName: "矿权范围",
    datasetName: "基本信息",
    geometric: "Polygon",
    prop: "KQFW",
    remark: "采矿证转或相关图件提取",
  },
  {
    taskName: "批复水土流失防治责任范围",
    datasetName: "基本信息",
    geometric: "Polygon",
    prop: "PFFZZRFW",
    remark: "水保方案图件或示意性勾绘",
  },
  {
    taskName: "水土流失防治责任范围",
    datasetName: "基本信息",
    geometric: "Polygon",
    prop: "FZZRFW",
    remark: "等同监测范围",
  },
  {
    taskName: "用地范围",
    datasetName: "基本信息",
    geometric: "Polygon",
    prop: "YDFW",
    remark: "矿方提供的用地资料",
  },
  {
    taskName: "生态保护红线与自然保护地",
    datasetName: "基本信息",
    geometric: "Polygon",
    prop: "HXBHD",
    remark: "矿方提供的相关资料",
  },
  {
    taskName: "采空区",
    datasetName: "基本信息",
    geometric: "Polygon",
    prop: "CKQ",
    remark: "由采掘工程平面图提取",
  },
  {
    taskName: "复垦工程计划",
    datasetName: "基本信息",
    geometric: "Polygon",
    prop: "FKJH",
    remark: "矿方提供的复垦工程技术资料",
  },
  {
    taskName: "复垦工程",
    datasetName: "基本信息",
    geometric: "Polygon",
    prop: "FKGC",
    remark: "各矿提交的年度及以往复垦工程数据",
  },
];

export default ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  return (
    <Modal
      open={open}
      title="任务执行"
      width={1200}
      onCancel={() => onClose?.()}
      footer={null}
    >
      <Table
        columns={[
          ...columns,
          {
            title: "操作",
            dataIndex: "actions",
            render: () => {
              return (
                <div
                  style={{ display: "flex", justifyContent: "center", gap: 10 }}
                >
                  <Button
                    type="link"
                    color="default"
                    variant="link"
                    icon={<InfoCircleOutlined />}
                    onClick={() => router.push("/computing")}
                  >
                    详情
                  </Button>
                  <Button
                    type="link"
                    color="blue"
                    variant="link"
                    icon={<AimOutlined />}
                    onClick={() => router.push("/computing")}
                  >
                    任务执行
                  </Button>
                </div>
              );
            },
          },
        ]}
        dataSource={dataSource}
        pagination={pagination}
      />
    </Modal>
  );
};
