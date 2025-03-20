"use client";

import {
  CloudUploadOutlined,
  InboxOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tabs,
  Upload,
  DatePicker,
  type TabsProps,
  type UploadProps,
} from "antd";
import { useState } from "react";
import styles from "./mdb.module.scss";

const { Dragger } = Upload;
const { RangePicker } = DatePicker;

const uploadProps: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const columns = [
  {
    title: "规则",
    dataIndex: "rule",
  },
  {
    title: "校验状态",
    dataIndex: "status",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
];

const imageColumns = [
  {
    title: "影像编码",
    dataIndex: "imageCode",
    width: 180,
  },
  {
    title: "产品名称",
    dataIndex: "productName",
  },
  {
    title: "产品等级",
    dataIndex: "productLevel",
    width: 100,
  },
  {
    title: "采集时间",
    dataIndex: "captureTime",
    width: 180,
  },
  {
    title: "云量",
    dataIndex: "cloudCover",
    width: 100,
  },
];

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "影像选择",
  },
  {
    key: "2",
    label: "影像上传",
  },
];

// 表单布局
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const onChange = (key: string) => {
    console.log(key);
  };

  const handleSave = () => {
    console.log(form.getFieldsValue());
    onClose?.();
  };

  const renderDataForm = () => {
    return (
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
      >
        <Row gutter={16}>
          {/* 第一行 */}
          <Col span={12}>
            <Form.Item
              label="企业名称"
              name="enterpriseName"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入企业名称" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="年份" name="year" rules={[{ required: true }]}>
              <Select defaultValue="2025">
                <Select.Option value="2023">2023</Select.Option>
                <Select.Option value="2024">2024</Select.Option>
                <Select.Option value="2025">2025</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 第二行 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="产业类别"
              name="industryType"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value="井工矿"> 井工矿 </Radio>
                <Radio value="露天矿"> 露天矿 </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="子公司"
              name="subsidiary"
              rules={[{ required: true }]}
            >
              <Select defaultValue="神东煤炭">
                <Select.Option value="神东煤炭">神东煤炭</Select.Option>
                <Select.Option value="其他子公司">其他子公司</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 第三行 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="行政区划"
              name="region"
              rules={[{ required: true }]}
            >
              <Select defaultValue="内蒙古">
                <Select.Option value="内蒙古">内蒙古</Select.Option>
                <Select.Option value="其他地区">其他地区</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="调研时间" name="researchDate">
              <Input placeholder="请输入调研时间" />
            </Form.Item>
          </Col>
        </Row>

        {/* 第四行 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="权属单位" name="ownershipUnit">
              <Input placeholder="请输入权属单位" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="负责人" name="personInCharge">
              <Input placeholder="请输入负责人" />
            </Form.Item>
          </Col>
        </Row>

        {/* 独占一行的项目描述 */}
        <Row>
          <Col span={24}>
            <Form.Item
              label="项目描述"
              name="projectDescription"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
            >
              <Input.TextArea rows={4} placeholder="请输入项目描述" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            span={4}
            offset={20}
            style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
          >
            <Button
              color="blue"
              variant="solid"
              type="primary"
              onClick={() => setStep(1)}
            >
              下一步
            </Button>
            <Button onClick={() => onClose?.()}>取消</Button>
          </Col>
        </Row>
      </Form>
    );
  };

  const renderUpload = () => {
    return (
      <>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined />
          </p>
          <p className="ant-upload-text">点击拖拽文件到此处</p>
          <p className="ant-upload-hint">仅支持.mdb格式文件</p>
        </Dragger>
        <Row style={{ marginTop: 10 }}>
          <Col
            span={4}
            offset={20}
            style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
          >
            <Button
              color="blue"
              variant="solid"
              type="primary"
              onClick={() => setStep(2)}
            >
              下一步
            </Button>
            <Button onClick={() => onClose?.()}>取消</Button>
          </Col>
        </Row>
      </>
    );
  };

  const renderChecked = () => {
    return (
      <>
        <Table
          columns={columns}
          dataSource={[
            { rule: "规则1", status: "通过", action: "查看日志" },
            { rule: "规则2", status: "通过", action: "查看日志" },
            { rule: "规则3", status: "通过", action: "查看日志" },
          ]}
        />
        <Row>
          <Col
            span={4}
            offset={20}
            style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
          >
            <Button
              color="blue"
              variant="solid"
              type="primary"
              onClick={() => setStep(3)}
            >
              下一步
            </Button>
            <Button onClick={() => onClose?.()}>取消</Button>
          </Col>
        </Row>
      </>
    );
  };

  const renderImagaSelect = () => {
    return (
      <>
        <div className={styles.imageSelect}>
          <Tabs
            defaultActiveKey="1"
            tabPosition="left"
            items={items}
            onChange={onChange}
          />
          <Card bordered={false} style={{ flex: 1 }}>
            {/* 查询条件区域 */}
            <Form>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="矿区范围："
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 16 }}
                    tooltip="根据提取的mdb矢量范围自动填充坐标点系列"
                  >
                    <Input placeholder="自动填充坐标点系列" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="时间范围：" {...formItemLayout}>
                    <RangePicker />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item label="产品名称：" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Button type="primary" icon={<SearchOutlined />}>
                      查询
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            {/* 数据表格 */}
            <div style={{ marginTop: 24 }}>
              <Table
                columns={imageColumns}
                dataSource={[
                  {
                    key: "1",
                    imageCode: "IMG_202301_001",
                    productName: "高分辨率卫星影像",
                    productLevel: "一级",
                    captureTime: "2023-01-15 09:30",
                    cloudCover: "5%",
                  },
                  {
                    key: "2",
                    imageCode: "IMG_202301_001",
                    productName: "高分辨率卫星影像",
                    productLevel: "一级",
                    captureTime: "2023-01-15 09:30",
                    cloudCover: "5%",
                  },
                ]}
                pagination={pagination}
                rowSelection={{
                  type: "radio",
                  onSelect: (record) => console.log("选中行:", record),
                }}
                bordered
              />
            </div>

            {/* 底部操作区 */}
            <div style={{ marginTop: 24, textAlign: "right" }}>
              <Space>
                <Button type="primary" onClick={handleSave}>
                  保存
                </Button>
                <Button onClick={() => onClose?.()}>取消</Button>
              </Space>
            </div>
          </Card>
        </div>
      </>
    );
  };

  return (
    <Modal
      open={open}
      title="导入MDB"
      width={1200}
      onCancel={() => onClose?.()}
      footer={null}
    >
      <Divider />
      <Steps
        style={{ marginTop: 20 }}
        progressDot
        current={step}
        onChange={(s) => setStep(s)}
        items={[
          {
            title: "数据填写",
          },
          {
            title: "MDB导入",
          },
          {
            title: "规则校验",
          },
          {
            title: "影像选择",
          },
        ]}
      />
      <Divider />
      {step === 0 ? renderDataForm() : null}
      {step === 1 ? renderUpload() : null}
      {step === 2 ? renderChecked() : null}
      {step === 3 ? renderImagaSelect() : null}
    </Modal>
  );
};
