"use client";
import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as tiandiTuLayer } from "ol/layer";
import { TileWMS, Vector as VectorSource, WMTS, XYZ } from "ol/source";
import { OlMap } from "@/utils/OlMap";
import styles from "./map.module.scss";
import { Radio } from "antd";

import {
  createFromIconfontCN,
} from "@ant-design/icons";


const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_4813506_p2bhi6ctt6.js",
});


const ComputingMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(2);
  const tdtKey = "5524c003a4f5e5ba639f3d3dd5e0193b";

  // 创建天地图影像图层
  const imageLayer = new TileLayer({
    source: new XYZ({
      url: `http://t0.tianditu.gov.cn/img_w/wmts?layer=img&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=${tdtKey}`,
      maxZoom: 18,
    }),
  });
  imageLayer.set("id", "img_base");
  imageLayer.set("title", "影像底图");
  // 创建天地图影像标注图层
  const imageLabelLayer = new TileLayer({
    source: new XYZ({
      url: `http://t0.tianditu.gov.cn/cia_w/wmts?layer=cia&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=${tdtKey}`,
      maxZoom: 18,
    }),
  });
  imageLabelLayer.set("id", "img_label");
  imageLabelLayer.set("title", "影像注记");

  // 创建天地图矢量图层
  const vectorLayer = new TileLayer({
    source: new XYZ({
      url: `http://t0.tianditu.gov.cn/vec_w/wmts?layer=vec&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=${tdtKey}`,
      maxZoom: 18,
    }),
  });
  vectorLayer.set("id", "vec_base");
  vectorLayer.set("title", "电子底图");

  // 创建天地图矢量标注图层
  const vectorLabelLayer = new TileLayer({
    source: new XYZ({
      url: `http://t0.tianditu.gov.cn/cva_w/wmts?layer=cva&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=${tdtKey}`,
      maxZoom: 18,
    }),
  });
  vectorLabelLayer.set("id", "vec_label");
  vectorLabelLayer.set("title", "电子标记");
  // const imagarySource = new TileWMS({
  //   url: "http://172.30.1.117:8080/geoserver/wms",
  //   params: { LAYERS: "ne:huishanping_4326", TILED: true },
  //   serverType: "geoserver",
  //   // Countries have transparency, so do not fade tiles:
  //   transition: 0,
  // });
  // const imagaryLayer = new TileLayer({
  //   source: imagarySource,
  // });
  // imagaryLayer.set("id", "imagarySource");
  // imagaryLayer.setZIndex(1);

  useEffect(() => {
    const map = new OlMap({
      target: mapContainerRef.current!,
      center: [116.397428, 39.90923],
      zoom: 5,
      layers: [imageLayer, imageLabelLayer, vectorLayer, vectorLabelLayer],
      projection: "EPSG:3857",
      controls: {
        showScale: true, // 显示比例尺
        showZoom: true, // 显示缩放级别
        showCoordinate: true, // 显示坐标
        showResolution: true, // 显示分辨率
      },
      controlsStyle: {
        bottom: 50,
        left: 540,
      },
      tools: {
        showMeasure: true,
        showArea: true,
        showLayer: true,
        showZoomIn: true,
        showZoomOut: true,
        showReset: true,
      },
      toolsStyle: {
        bottom: 50,
        right: 380,
      },
    });
    window.map = map;

    map.getLayer("vec_base")?.hide();
    map.getLayer("vec_label")?.hide();
    //   // 创建地图
    //   const map = new Map({
    //     target: mapContainerRef.current!,
    //     controls: [],
    //     layers: [
    //       // new TileLayer({
    //       //   source: new OSM(), // 天地影像图层可以通过 OSM 替换为实际的天地图层
    //       // }),
    //       tiandituImgLayer,
    //       // imagaryLayer,
    //     ],
    //     view: new View({
    //       // center: fromLonLat([108.09107519289681, 29.724307714246539]),
    //       center: [12041299.943224058, 3475957.744334955],
    //       zoom: 5,
    //       projection: "EPSG:3857",
    //     }),
    //   });
    return () => {
      map.destory();
    };
  }, []);

  const onLayerChange = (no: number) => {
    setValue(no);
    if (no === 1) {
      window.map.getLayer("vec_base")?.show();
      window.map.getLayer("vec_label")?.show();
      window.map.getLayer("img_base")?.hide();
      window.map.getLayer("img_label")?.hide();
      return;
    }
    if (no === 2) {
      window.map.getLayer("vec_base")?.hide();
      window.map.getLayer("vec_label")?.hide();
      window.map.getLayer("img_base")?.show();
      window.map.getLayer("img_label")?.show();
      return;
    }
  };

  return (
    <div ref={mapContainerRef} className={styles.mapContainer}>
      <div className={styles.layers}>
        {/* <div className={styles.layer}>
          <Radio onChange={() => onLayerChange(1)}>电子地图</Radio>
        </div>
        <div className={styles.layer}>
          <Radio onChange={() => onLayerChange(2)}>影像地图</Radio>
        </div> */}
        <Radio.Group
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
          onChange={(e) => onLayerChange(e.target.value)}
          value={value}
          options={[
            { value: 1, label: "电子地图" },
            { value: 2, label: "影像地图" },
          ]}
        />
      </div>
    </div>
  );
};

export default ComputingMap;
