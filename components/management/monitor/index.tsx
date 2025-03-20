"use client";

import {
  AimOutlined,
  FormOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Table } from "antd";
import { useCallback, useState } from "react";
import styles from "./task.module.scss";
import { useRouter } from "next/navigation";

const columns = [
  {
    title: "企业名称",
    dataIndex: "companyName",
  },
  {
    title: "子公司",
    dataIndex: "subCompany",
  },
  {
    title: "年份",
    dataIndex: "year",
  },
  {
    title: "批次",
    dataIndex: "batch",
  },
  {
    title: "产业类别",
    dataIndex: "cate",
  },
];

const dataSource = [
  {
    companyName: "大柳塔煤矿",
    subCompany: "神东煤炭",
    year: "2025",
    batch: "1",
    cate: "井工矿",
  },
  {
    companyName: "大柳塔煤矿",
    subCompany: "神东煤炭",
    year: "2025",
    batch: "4",
    cate: "井工矿",
  },
  {
    companyName: "大柳塔煤矿",
    subCompany: "神东煤炭",
    year: "2025",
    batch: "3",
    cate: "井工矿",
  },
  {
    companyName: "大柳塔煤矿",
    subCompany: "神东煤炭",
    year: "2025",
    batch: "2",
    cate: "井工矿",
  },
  {
    companyName: "大柳塔煤矿",
    subCompany: "神东煤炭",
    year: "2025",
    batch: "1",
    cate: "井工矿",
  },
];

export default ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const handleReset = useCallback(() => {
    form.resetFields();
  }, []);

  return (
    <Modal
      open={open}
      title="变化监测"
      width={1200}
      onCancel={() => onClose?.()}
      footer={null}
    >
      <Form layout="inline" form={form} style={{ marginBottom: 10 }}>
        <Form.Item label="年份" name="year">
          <Input />
        </Form.Item>
        <Form.Item label="批次" name="batch">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button onClick={handleReset}>重置</Button>
      </Form>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
      <div
        className="actions"
        style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
      >
        <Button type="primary" onClick={() => router.push("monitor")}>
          提取图斑变化
        </Button>
        <Button>取消</Button>
      </div>
    </Modal>
  );
};
