import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { TileWMS, Vector as VectorSource, WMTS, XYZ } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke } from "ol/style";

const ComputingMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const tdtKey = "5524c003a4f5e5ba639f3d3dd5e0193b";

  // 创建天地图影像图层
  const tiandituImgLayer = new TileLayer({
    source: new XYZ({
      url: `http://t0.tianditu.gov.cn/img_w/wmts?layer=img&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=${tdtKey}`,
      maxZoom: 18,
    }),
  });
  const imagarySource = new TileWMS({
    url: "http://172.30.1.117:8080/geoserver/wms",
    params: { LAYERS: "ne:huishanping_4326", TILED: true },
    serverType: "geoserver",
    // Countries have transparency, so do not fade tiles:
    transition: 0,
  });
  const trainLayer = new TileLayer({
    source: new TileWMS({
      url: `http://172.30.1.117:8080/geoserver/ne/wms`,
      params: {
        LAYERS: "ne:全国铁路",
        // TILED: true,
        SRS: "EPSG:3857",
        VERSION: "1.1.1",
      },
      serverType: "geoserver",
      transition: 0,
    }),
  });
  const imagaryLayer = new TileLayer({
    source: imagarySource,
  });
  imagaryLayer.set("id", "imagarySource");
  imagaryLayer.setZIndex(1);
  useEffect(() => {
    // 创建地图
    const map = new Map({
      target: mapContainerRef.current!,
      layers: [
        // new TileLayer({
        //   source: new OSM(), // 天地影像图层可以通过 OSM 替换为实际的天地图层
        // }),
        tiandituImgLayer,
        // trainLayer,
        imagaryLayer,
      ],
      view: new View({
        // center: fromLonLat([108.09107519289681, 29.724307714246539]),
        center: [12041299.943224058, 3475957.744334955],
        zoom: 13,
        projection: "EPSG:3857",
      }),
    });
    // 创建VectorSource并加载GeoJSON数据
    const vectorSource = new VectorSource({
      url: "/area.geojson", // GeoJSON文件路径或URL
      format: new GeoJSON({
        dataProjection: "EPSG:4326", // 数据坐标系（通常为WGS84）
        featureProjection: "EPSG:3857", // 地图坐标系（Web Mercator）
      }),
    });

    // 定义矢量图层的样式
    const style = new Style({
      fill: new Fill({
        color: "#FF660016", // 填充颜色
      }),
      stroke: new Stroke({
        color: "#FF6600", // 边框颜色
        width: 2, // 边框宽度
      }),
    });

    // 创建矢量图层
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: style, // 应用样式
    });

    // 将矢量图层添加到地图
    map.addLayer(vectorLayer);
    // @ts-ignore
    window.vectorLayer = vectorLayer;
    return () => {
      map.setTarget(undefined); // 清理地图实例
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "calc(100% - 360px)", height: "100%" }}
    />
  );
};

export default ComputingMap;
