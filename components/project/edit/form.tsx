"use client"
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Steps,
  Table,
  Tabs,
  type TabsProps,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import styles from "./form.module.scss";
import { useRouter } from "next/navigation";

const { TextArea } = Input;

const items: TabsProps["items"] = [
  {
    label: "工程基本信息",
    key: "1",
  },
  {
    label: "任务列表",
    key: "2",
  },
];

const dataSource = [
  {
    key: "1",
    no: "1",
    taskName: "风电场噪声风险排查",
    type: "矢量数据",
    scheduledTime: "2025-01-09 ~ 2025-01-28",
    processors: "管理员",
    startTime: "",
    endTime: "",
    description: "基于回山坪生态监测...",
    status: "未处理",
  },
  {
    key: "2",
    no: "2",
    taskName: "风电场环境影响评价合规性分析",
    type: "矢量数据",
    scheduledTime: "2025-01-09 ~ 2025-01-28",
    processors: "管理员",
    startTime: "",
    endTime: "",
    description: "基于回山坪生态监测...",
    status: "未处理",
  },
  {
    key: "3",
    no: "3",
    taskName: "风电场土地覆盖情况分析",
    type: "矢量数据",
    scheduledTime: "2025-01-09 ~ 2025-01-28",
    processors: "管理员",
    startTime: "",
    endTime: "",
    description: "基于回山坪生态监测...",
    status: "未处理",
  },
  {
    key: "4",
    no: "4",
    taskName: "风电场扰动土地情况分析",
    type: "矢量数据",
    scheduledTime: "2025-01-09 ~ 2025-01-28",
    processors: "管理员",
    startTime: "",
    endTime: "",
    description: "基于回山坪生态监测...",
    status: "未处理",
  },

  {
    key: "5",
    no: "5",
    taskName: "固体废物风险排查野外调研",
    type: "照片",
    scheduledTime: "2025-01-09 ~ 2025-01-28",
    processors: "管理员",
    startTime: "",
    endTime: "",
    description: "基于回山坪生态监测...",
    status: "未处理",
  },
];

const ProjectForm = ({ defaultTab }: { defaultTab: string }) => {
  const router = useRouter();
  const columns = [
    {
      title: "序号",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "任务名称",
      dataIndex: "taskName",
      key: "taskName",
    },
    {
      title: "成果数据类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "计划时间",
      dataIndex: "scheduledTime",
      key: "scheduledTime",
    },
    {
      title: "处理人",
      dataIndex: "processors",
      key: "processors",
    },
    {
      title: "实际开始时间",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "实际结束时间",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "任务描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "任务状态 ",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "操作",
      dataIndex: "actions",
      key: "actions",
      render: () => {
        return (
          <div className={styles.actions}>
            <span>详情</span>
            <span>指派</span>
            <span
              onClick={() => {
                router.push(
                  "/computing?imagarys=W3siaW1hZ2VJZCI6MjA0NzE0MiwiaW1hZ2VfaWRlbnRpZmljYXRpb24iOiJUUklQTEVTQVRfMjAyNDEyMjcifV0%3D"
                );
              }}
            >
              运行
            </span>
          </div>
        );
      },
    },
  ];
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [tab, setTab] = useState(defaultTab || "1");
  const onFinish = useCallback((values: Record<string, any>) => {
    // todo
  }, []);

  const onSearchFinish = useCallback(() => {}, []);

  return (
    <>
      <div className={styles.block}>
        <Tabs
          items={items}
          activeKey={tab}
          type="card"
          onChange={(value) => setTab(value)}
        />
        {tab === "1" ? (
          <div className={styles.form}>
            <Form
              form={form}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              onFinish={onFinish}
            >
              <Row>
                <Col span={12}>
                  <Form.Item label="工程名称" name="projectName">
                    <Input style={{ width: 400 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="行政区划" name="region">
                    <Input style={{ width: 400 }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="业务大类" name="bigCate">
                    <Select options={[]} style={{ width: 400 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="业务小类" name="smallCate">
                    <Select options={[]} style={{ width: 400 }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Form.Item label="年份" name="year">
                    <DatePicker picker="year" style={{ width: 400 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="调研时间" name="researchTime">
                    <DatePicker style={{ width: 400 }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Form.Item label="负责人" name="responsiblePerson">
                    <Select options={[]} style={{ width: 400 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="权属单位" name="unit">
                    <Select options={[]} style={{ width: 400 }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Form.Item label="工程描述" name="description">
                    <TextArea cols={4} style={{ width: 400 }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="工程封面" name="cover">
                    <Upload action="/upload.do" listType="picture-card">
                      <button
                        style={{ border: 0, background: "none" }}
                        type="button"
                      >
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传封面</div>
                      </button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div className={styles.subTitle}>操作步骤</div>
            <Steps
              style={{ margin: "50px auto", width: "80%" }}
              current={0}
              items={[
                {
                  title: "选择影像",
                },
                {
                  title: "生成任务",
                },
                {
                  title: "任务计算",
                },
                {
                  title: "成果汇总",
                },
                {
                  title: "导出报告",
                },
              ]}
            />
          </div>
        ) : null}
        {tab === "2" ? (
          <div className={styles.table}>
            <div className={styles.searchLine}>
              <Form form={searchForm} layout="inline" onFinish={onSearchFinish}>
                <Form.Item label="任务名称" name="taskName">
                  <Input style={{ width: 200 }} />
                </Form.Item>
                <Form.Item label="成果数据类型" name="type">
                  <Select options={[]} style={{ width: 200 }} />
                </Form.Item>
                <Form.Item label="处理人" name="withPerson">
                  <Input style={{ width: 200 }} />
                </Form.Item>
                <Form.Item label="任务状态" name="status">
                  <Select options={[]} style={{ width: 200 }} />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    style={{ marginRight: 10 }}
                  >
                    查询
                  </Button>
                  <Button onClick={() => searchForm.resetFields()}>重置</Button>
                </Form.Item>
              </Form>
            </div>
            <Table dataSource={dataSource} columns={columns} />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ProjectForm;
