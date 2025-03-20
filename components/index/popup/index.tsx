"use client";
import { ConfigProvider, Tree, type TreeProps, type TreeDataNode } from "antd";
import styles from "./popup.module.scss";
import { GeoJSON } from "ol/format";
import { useEffect, useState } from "react";
import { TileWMS } from "ol/source";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { Fill, Stroke, Style } from "ol/style";
import VectorSource from "ol/source/Vector";
import { CloseOutlined } from "@ant-design/icons";
import { eventEmitter } from "@/utils/events";
import { transform } from "ol/proj";

const colors: Record<string, string> = {
  KQFW: "#FF5918",
  FZZRFW: "#1890FF",
  TDFG: "#ECB676",
  RDDK: "#FFFF00",
  DCZYFW: "#88FF00",
  DCZLFW: "#555555",
  DCYFKFW: "#D7D7D7",
  ZBFGD: "#239952",
};

const treeData: TreeDataNode[] = [
  {
    title: "黑岱沟煤矿",
    key: "黑岱沟煤矿",
    children: [
      {
        title: "影像",
        key: "影像",
        children: [
          {
            title: "JK1KFO1A_PMS_L3",
            key: "JK1KFO1A_PMS_L3",
          },
        ],
      },
      {
        title: "矢量",
        key: "矢量",
        children: [
          {
            title: "基础信息",
            key: "基础信息",
            children: [
              {
                title: "矿权范围",
                key: "KQFW",
              },
              {
                title: "水土流失防治责任范围",
                key: "FZZRFW",
              },
              // {
              //   title: "生态保护红线与自然保护地",
              //   key: "HXBHD",
              // },
              // {
              //   title: "采空区",
              //   key: "CKQ",
              // },
              // {
              //   title: "复垦工程",
              //   key: "FKGC",
              // },
            ],
          },
          {
            title: "土地覆盖",
            key: "TDFG",
          },
          {
            title: "扰动地块",
            key: "RDDK",
          },
          {
            title: "土地复垦",
            key: "土地复垦",
            children: [
              {
                title: "堆场占用范围",
                key: "DCZYFW",
              },
              {
                title: "堆场终了范围",
                key: "DCZLFW",
              },
              {
                title: "堆场已复垦范围",
                key: "DCYFKFW",
              },
            ],
          },
          {
            title: "植被覆盖度",
            key: "ZBFGD",
          },
        ],
      },
    ],
  },
];

const LeftPanel = () => {
  const [visible, setVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    if (!window.map) return;
    if (!visible) {
      renderImg(false);
      renderAllVector(false);
    }
  }, [visible]);

  useEffect(() => {
    setTimeout(() => {
      window.map.on("click", (feature) => {
        console.log("feature", feature);
        const mapDisplay = window.map.getMapDisplay();

        setRefreshKey((key) => key + 1);
        const id = feature.getId()?.toString()!;
        mapDisplay.clearFeatureById("yutu_text");
        mapDisplay.clearFeatureById("person_text");
        mapDisplay.clearFeatureById("dev_text");
        if (id === "yutu_png") {
          mapDisplay.text([135, 12.8], {
            id: "yutu_text",
            style: {
              offsetY: -50,
              color: "rgb(51, 51, 51)",
              fontSize: 12,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
            content: `台风名称： 202425天兔
预报时间：2024-11-15 06:00:00
预报机构：中国
中心位置：135°E | 12.8°N
最大风速：35m/s
气旋强度：12级（台风（TY））
中心气压：970hPa`,
          });
          return;
        }
        if (id.startsWith("human")) {
          mapDisplay.text(
            transform(
              // @ts-ignore
              feature.getGeometry()?.flatCoordinates,
              "EPSG:3857",
              "EPSG:4326"
            ),
            {
              id: "person_text",
              style: {
                offsetY: -50,
                color: "rgb(51, 51, 51)",
                fontSize: 12,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              },
              content: `姓名： 张诚扬
工号：202510234
所属单位：神东煤炭
定位时间：2025-3-20 12:20:38
坐标：${transform(
                // @ts-ignore
                feature.getGeometry()?.flatCoordinates,
                "EPSG:3857",
                "EPSG:4326"
              )
                .map((d) => d.toFixed(4))
                .join(",")}`,
            }
          );
          return;
        }
        if (id.startsWith("car")) {
          mapDisplay.text(
            transform(
              // @ts-ignore
              feature.getGeometry()?.flatCoordinates,
              "EPSG:3857",
              "EPSG:4326"
            ),
            {
              id: "dev_text",
              style: {
                offsetY: -50,
                color: "rgb(51, 51, 51)",
                fontSize: 12,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              },
              content: `车牌号： AV1824
车型：小轿车
所属单位：神东煤炭
是否越界：未越界
坐标：${transform(
                // @ts-ignore
                feature.getGeometry()?.flatCoordinates,
                "EPSG:3857",
                "EPSG:4326"
              )
                .map((d) => d.toFixed(4))
                .join(",")}`,
            }
          );
          return;
        }
        if (!id.startsWith("煤")) return;
        setVisible(true);
        const layer = window.map.getLayer("JK1KFO1A_PMS_L3");
        window.map.centerAt([111.25185, 39.74695], 13);
        // 再次点击时
        if (layer) {
          renderImg(false);
          renderAllVector(false);
          layer.hide();
          layer.show();
          renderVector(true, "KQFW");
          return;
        }
        const imagarySource = new TileWMS({
          url: "http://172.30.1.117:8080/geoserver/wms",
          params: { LAYERS: "ne:JL1KFO1A_20220925_JL1", TILED: true },
          serverType: "geoserver",
          // Countries have transparency, so do not fade tiles:
          transition: 0,
        });
        const imagaryLayer = new TileLayer({
          source: imagarySource,
        });
        imagaryLayer.set("id", "JK1KFO1A_PMS_L3");
        imagaryLayer.setZIndex(99);
        window.map.addLayer(imagaryLayer);
        drawGeojson("KQFW");
      });
    }, 1000);
    if (!window.map) return;
  }, []);

  useEffect(() => {
    eventEmitter.on("popup:close", () => {
      setVisible(false);
    });
  }, []);

  const drawGeojson = (key: string) => {
    if (!window.map) return;
    console.log("key", key);
    // 创建VectorSource并加载GeoJSON数据
    const vectorSource = new VectorSource({
      url: `/geojsons/layers/${key}.geojson`, // GeoJSON文件路径或URL
      format: new GeoJSON({
        dataProjection: "EPSG:4326", // 数据坐标系（通常为WGS84）
        featureProjection: "EPSG:3857", // 地图坐标系（Web Mercator）
      }),
    });

    // 定义矢量图层的样式
    const style = new Style({
      fill: new Fill({
        color: `${colors[key]}48`, // 填充颜色
      }),
      stroke: new Stroke({
        color: colors[key], // 边框颜色
        width: 2, // 边框宽度
      }),
    });
    // 创建矢量图层
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: style, // 应用样式
    });
    vectorLayer.set("id", key);
    vectorLayer.setZIndex(100);
    // 将矢量图层添加到地图
    window.map.addLayer(vectorLayer);
  };

  const renderImg = (visible: boolean) => {
    const layer = window.map.getLayer("JK1KFO1A_PMS_L3");
    if (visible) {
      layer?.show();
    } else {
      layer?.hide();
    }
  };

  const renderVector = (visible: boolean, key: string) => {
    const layer = window.map.getLayer(key);
    if (visible) {
      if (!layer) {
        drawGeojson(key);
      } else {
        layer?.show();
      }
    } else {
      layer?.hide();
    }
  };

  const renderBasisVector = (visible: boolean) => {
    treeData[0].children![1].children![0]!.children?.forEach((node) => {
      const layer = window.map.getLayer(node.key as string);
      if (visible) {
        layer ? layer.show() : drawGeojson(node.key as string);
      } else {
        layer?.hide();
      }
    });
  };

  const renderTDFKVector = (visible: boolean) => {
    treeData[0].children![1].children![3]!.children?.forEach((node) => {
      const layer = window.map.getLayer(node.key as string);
      if (visible) {
        layer ? layer.show() : drawGeojson(node.key as string);
      } else {
        layer?.hide();
      }
    });
  };

  const renderAllVector = (visible: boolean) => {
    renderBasisVector(visible);
    renderTDFKVector(visible);
    ["TDFG", "RDDK", "ZBFGD"].forEach((key) => {
      const layer = window.map.getLayer(key);
      if (visible) {
        layer ? layer.show() : drawGeojson(key);
      } else {
        layer?.hide();
      }
    });
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys, info);
    const key = info.node.key.toString();
    if (["影像", "JK1KFO1A_PMS_L3"].includes(key)) {
      renderImg(info.checked);
      return;
    }
    if (["黑岱沟煤矿"].includes(key)) {
      renderImg(info.checked);
      renderAllVector(info.checked);
    }
    if (key.includes("基础信息")) {
      renderBasisVector(info.checked);
      return;
    }
    if (key.includes("土地复垦")) {
      renderTDFKVector(info.checked);
      return;
    }
    if (key.includes("矢量")) {
      renderAllVector(info.checked);
      return;
    }
    renderVector(info.checked, info.node.key as string);
  };

  return (
    <div
      className={styles.popup}
      style={{ display: visible ? "block" : "none" }}
    >
      <CloseOutlined
        className={styles.close}
        onClick={() => setVisible(false)}
      />
      <ConfigProvider
        theme={{
          // 1. 单独使用暗色算法
          // algorithm: theme.darkAlgorithm,
          // 2. 组合使用暗色算法与紧凑算法
          // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
          token: {
            colorPrimary: "rgba(45,45,45,0.5)",
            colorBgMask: "rgba(255,255,255,1)",
            colorBgContainer: "transprant",
            colorTextBase: "rgba(255,255,255,1)",
            colorInfo: "rgba(255,255,255,1)",
            colorBgBase: "rgba(255,255,255,1)",
          },
        }}
      >
        <Tree
          checkable
          key={refreshKey}
          defaultExpandedKeys={["黑岱沟煤矿", "影像", "矢量", "基础信息"]}
          defaultSelectedKeys={["KQFW", "JK1KFO1A_PMS_L3"]}
          defaultCheckedKeys={["KQFW", "JK1KFO1A_PMS_L3"]}
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={treeData}
        />
      </ConfigProvider>
    </div>
  );
};

export default LeftPanel;
