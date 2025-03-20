"use client";
import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import styles from "./map.module.scss";

// 天地图影像中文标记服务(墨卡托投影)
// Usage: 用于卫星影像图层，与tainDTVectorAnno相比多了行政矢量边界
const tianDTAnno = new Cesium.WebMapTileServiceImageryProvider({
  url:
    "http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default.jpg&tk=8c471ad83d563e443d9a630de25f23a0",
  layer: "cia_w", // WMTS请求的层名称
  style: "default", // WMTS请求的样式名称
  format: "tiles", // MIME类型，用于从服务器检索图像
  tileMatrixSetID: "GoogleMapsCompatible", // 用于WMTS请求的TileMatrixSet的标识符
  subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"], // 天地图8个服务器
  minimumLevel: 0, // 最小层级
  maximumLevel: 18,
});
const imageryViewModels: Cesium.ProviderViewModel[] = [];

// 天地图img_w影像服务,墨卡托投影
const tianDTimg_w_imageryProvier = new Cesium.WebMapTileServiceImageryProvider({
  url:
    "http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default&format=tiles&tk=8c471ad83d563e443d9a630de25f23a0",
  layer: "img_w", // WMTS请求的层名称
  style: "default", // WMTS请求的样式名称
  format: "tiles", // MIME类型，用于从服务器检索图像
  tileMatrixSetID: "GoogleMapsCompatible", // 用于WMTS请求的TileMatrixSet的标识符
  subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"], // 天地图8个服务器
  minimumLevel: 0, // 最小层级
  maximumLevel: 18, // 最大层级
});
// const tianDTimg_w_imageryProvier = new Cesium.WebMapTileServiceImageryProvider({
//   url: "http://192.169.106.34/basemap/img_w/wmts",
//   layer: "img", // WMTS请求的层名称
//   style: "default", // WMTS请求的样式名称
//   format: "tiles", // MIME类型，用于从服务器检索图像
//   tileMatrixSetID: "w", // 用于WMTS请求的TileMatrixSet的标识符
//   credit: new Cesium.Credit("天地图影像服务"),
//   minimumLevel: 0, // 最小层级
//   maximumLevel: 18, // 最大层级
// });
const tianDTimg_w_viewModel = new Cesium.ProviderViewModel({
  name: "天地图影像服务",
  iconUrl: "/Cesium/Widgets/Images/ImageryProviders/openStreetMap.png",
  tooltip: "天地图国家地理信息公共服务平台.\nhttps://www.tianditu.gov.cn/",
  creationFunction: () => tianDTimg_w_imageryProvier,
});
imageryViewModels.push(tianDTimg_w_viewModel);

// OSM地图服务
const osm_imageryProvider = new Cesium.OpenStreetMapImageryProvider({
  url: "https://a.tile.openstreetmap.org/",
});
const osg_viewModel = new Cesium.ProviderViewModel({
  name: "Open\u00adStreet\u00adMap",
  iconUrl: "/Cesium/Widgets/Images/ImageryProviders/openStreetMap.png",
  tooltip:
    "OpenStreetMap (OSM) is a collaborative project to create a free editable map of the world.\nhttp://www.openstreetmap.org",
  creationFunction: () => osm_imageryProvider,
});
imageryViewModels.push(osg_viewModel);

const MapContainer = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const element = document.createElement("div");
    element.id = "resource-cesium-viewer";
    element.style.height = "100%";
    mapRef.current?.appendChild(element);
    const viewer = new Cesium.Viewer("resource-cesium-viewer", {
      timeline: false,
      animation: false,
      homeButton: false,
      fullscreenButton: false,
      vrButton: false,
      navigationHelpButton: false,
      baseLayerPicker: false,
      projectionPicker: false,
      geocoder: false, // 搜索框
      requestRenderMode: true, // 降低CPU占用
      mapProjection: new Cesium.WebMercatorProjection(),
    });
    viewer.extend(Cesium.viewerDragDropMixin);
    // 添加天地图注记图层
    viewer.baseLayerPicker.viewModel.imageryProviderViewModels =
      imageryViewModels;
    viewer.baseLayerPicker.viewModel.selectedImagery =
      viewer.baseLayerPicker.viewModel.imageryProviderViewModels[0];

    viewer.imageryLayers.addImageryProvider(tianDTAnno);
    // 设置相机视角
    viewer.camera.setView({
      // fromDegrees()方法，将经纬度和高程转换为世界坐标
      destination: Cesium.Rectangle.fromDegrees(
        114.0149404672,
        30.0734572226,
        114.918116574,
        30.9597805439
      ), // west, south, east, north
      orientation: {
        // 指向
        heading: Cesium.Math.toRadians(0),
        // 视角
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0,
      },
    });
    return () => {
      viewer.destroy();
    };
  }, [mapRef]);

  return <div ref={mapRef} className={styles.mapContainer} />;
};

export default MapContainer;
