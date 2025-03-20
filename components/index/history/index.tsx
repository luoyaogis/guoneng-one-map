"use client";
import { useEffect, useState } from "react";
import styles from "./history.module.scss";
import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { GeoJSON } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import { Fill, Stroke, Style } from "ol/style";
import VectorSource from "ol/source/Vector";
import { extend } from "ol/extent";
import { Divider } from "antd";
const dataSource = [
  {
    id: 152,
    resultName: "耕地提取20250310185826.geosjon",
  },
  {
    id: 151,
    resultName: "林地提取20250217215825.geosjon",
  },
  {
    id: 150,
    resultName: "全要素提取20250210175208.geosjon",
  },
  {
    id: 148,
    resultName: "耕地提取20250210103353.geosjon",
  },
  {
    id: 146,
    resultName: "全要素提取20250209152048.geosjon",
  },
  {
    id: 142,
    resultName: "边坡提取20250110091249.geosjon",
  },
  // {
  //   id: 141,
  //   resultName: "耕地提取20250109195015.geosjon",
  // },
  // {
  //   id: 139,
  //   resultName: "耕地提取20250109172816.geosjon",
  // },
  // {
  //   id: 135,
  //   resultName: "林地提取20250109163807.geosjon",
  // },
  // {
  //   id: 133,
  //   resultName: "耕地提取20250109162835.geosjon",
  // },
];
export default () => {
  const [visible, setVisible] = useState(false);
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    if (!window.map) return;
    if (!visible) {
      dataSource.forEach((d) => {
        window.map.removeLayer(String(d.id));
      });
      setIds([]);
    }
  }, [visible]);

  const handleView = (id: number) => {
    if (!window.map) return;
    if (ids.includes(id)) {
      window.map.removeLayer(String(id));
      setIds((ids) => ids.filter((d) => d !== id));
    } else {
      setIds([...ids, id]);
      // 创建矢量图层

      const format = new GeoJSON();

      fetch(`/geojsons/history/${id}.geojson`)
        .then((response) => response.json())
        .then((response) => {
          const features = format.readFeatures(response, {
            dataProjection: "EPSG:4326", // 原始坐标系（假设为 WGS84）
            featureProjection: "EPSG:3857", // 转换为 Web Mercator
          });
          // 定义矢量图层的样式
          const style = new Style({
            fill: new Fill({
              color: "#FFFF0016", // 填充颜色
            }),
            stroke: new Stroke({
              color: "#FFFF00", // 边框颜色
              width: 2, // 边框宽度
            }),
          });
          const vectorLayer = new VectorLayer({
            source: new VectorSource({
              features,
            }),
            style: style, // 应用样式
          });
          vectorLayer.set("id", String(id));
          vectorLayer.setZIndex(9);
          window.map.addLayer(vectorLayer);

          // 3. 合并所有要素的几何范围
          let extent: any = null;
          features.forEach((feature) => {
            const geometry = feature.getGeometry();
            if (geometry) {
              const geomExtent = geometry.getExtent();
              if (!extent) {
                extent = geomExtent;
              } else {
                extend(extent, geomExtent);
              }
            }
          });

          // 4. 执行缩放操作
          if (extent) {
            window.map.getView().fit(extent, {
              padding: [50, 50, 50, 50], // 四周留白
              duration: 1000, // 动画时长
              maxZoom: 15, // 最大缩放级别
            });
          }
        });
    }
  };
  return (
    <>
      <div className={styles.history} onClick={() => setVisible((v) => !v)}>
        <img src="/images/index/history.png" alt="" />
      </div>
      {visible ? (
        <div className={styles.historyList}>
          <div className={styles.header}>
            <span className={styles.title}>计算分析结果</span>
            <CloseOutlined
              className={styles.close}
              onClick={() => setVisible(false)}
            />
          </div>
          <Divider />
          {dataSource.map((d) => {
            return (
              <div className={styles.line} key={d.id}>
                <div className={styles.name}>{d.resultName}</div>
                <div className={styles.action}>
                  <EyeOutlined
                    onClick={() => handleView(d.id)}
                    style={{
                      color: ids.includes(d.id) ? "#1677ff" : "inherit",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
};
