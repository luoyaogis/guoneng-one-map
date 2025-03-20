import { Button, Table, Tree, type TreeProps, type TreeDataNode } from "antd";
import { useRouter } from "next/navigation";
import styles from "./left-card.module.scss";
import VectorLayer from "ol/layer/Vector";

const treeData: TreeDataNode[] = [
  {
    title: "土地覆盖",
    key: "土地覆盖",
  },
  {
    title: "扰动地块",
    key: "扰动地块",
  },
  {
    title: "土地复垦",
    key: "土地复垦",
    children: [
      {
        title: "堆场占用范围",
        key: "堆场占用范围",
      },
      {
        title: "堆场终了范围",
        key: "堆场终了范围",
      },
      {
        title: "堆场已复垦范围",
        key: "堆场已复垦范围",
      },
      {
        title: "塌陷区范围",
        key: "塌陷区范围",
      },
      {
        title: "塌陷区治理范围",
        key: "塌陷区治理范围",
      },
      {
        title: "场区及其他绿化",
        key: "场区及其他绿化",
      },
    ],
  },
  {
    title: "植被覆盖度",
    key: "植被覆盖度",
  },
];

export default () => {
  const router = useRouter();
  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys, info);
    // @ts-ignore
    const visible = (window.vectorLayer as VectorLayer).getVisible();
    // @ts-ignore
    (window.vectorLayer as VectorLayer).setVisible(!visible);
  };
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>大柳塔煤矿</div>
        <div className={styles.rest}>
          <Button type="primary" onClick={() => router.back()}>
            返回
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.batch}>
          <div className={styles.key}>原始批次:</div>
          <div className={styles.value}>2025-1</div>
        </div>
        <div className={styles.batch}>
          <div className={styles.key}>原始批次:</div>
          <div className={styles.value}>2025-1</div>
        </div>
        <Tree
          style={{ marginTop: 20 }}
          checkable
          defaultExpandedKeys={["土地复垦"]}
          defaultSelectedKeys={["土地覆盖"]}
          defaultCheckedKeys={["土地覆盖"]}
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={treeData}
        />
      </div>
    </div>
  );
};
