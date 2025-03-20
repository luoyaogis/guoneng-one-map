"use client";
import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import styles from "./map.module.scss";

const MapContainer = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // 天地图影像图层
    const imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
      url: "http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
           "&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
           "&style=default&tk=5524c003a4f5e5ba639f3d3dd5e0193b",
      layer: "img",
      style: "default",
      format: "tiles",
      tileMatrixSetID: "w",
      subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      minimumLevel: 0,
      maximumLevel: 18,
    });

    // 天地图影像标记图层
    const imageryProviderLabels = new Cesium.WebMapTileServiceImageryProvider({
      url: "http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
           "&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
           "&style=default.jpg&tk=5524c003a4f5e5ba639f3d3dd5e0193b",
      layer: "cia",
      style: "default",
      format: "tiles",
      tileMatrixSetID: "GoogleMapsCompatible",
      subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      minimumLevel: 0,
      maximumLevel: 18,
    });

    const viewer = new Cesium.Viewer(mapRef.current, {
      timeline: false,
      animation: false,
      homeButton: false,
      fullscreenButton: false,
      vrButton: false,
      navigationHelpButton: false,
      baseLayerPicker: false,  // 禁用图层选择器
      projectionPicker: false,
      geocoder: false,
      requestRenderMode: true, // 降低CPU占用
    });

    // 添加影像图层和影像标记图层
    viewer.imageryLayers.addImageryProvider(imageryProvider);
    viewer.imageryLayers.addImageryProvider(imageryProviderLabels);

    // 设置相机视角
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(116.3974, 39.9093, 10000000.0),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90), // 设置视角
        roll: 0.0
      }
    });

    return () => {
      viewer.destroy();
    };
  }, []);

  return <div ref={mapRef} className={styles.mapContainer} />;
};

export default MapContainer;
