import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { TileWMS, Vector as VectorSource, WMTS, XYZ } from "ol/source";
import { type Extent, getTopLeft } from "ol/extent";
import { get as getProjection, fromLonLat } from "ol/proj";
import { Style, Fill, Stroke } from "ol/style";
import WMTSTileGrid from "ol/tilegrid/WMTS";

function getWidth(extent: number[]) {
  return extent[2] - extent[0];
}

const ProjectImagary = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // const getTiandituSource = (option: any): WMTS => {
  //   const fullUrl: string = option.url;
  //   const urlArray: string[] = fullUrl.split("/");
  //   const projCode: string = "EPSG:3857";
  //   // @ts-ignore
  //   const projection: Projection = getProjection(projCode);
  //   const projectionExtent: Extent = projection?.getExtent();
  //   const size: number = getWidth(projectionExtent) / 256;
  //   const resolutions: any[] = new Array(18);
  //   const matrixIds: any[] = new Array(18);
  //   const matrixIds2: any[] = new Array(21);
  //   const resolutions2: any[] = new Array(21);

  //   for (let z: number = 1; z < 19; ++z) {
  //     resolutions[z] = size / Math.pow(2, z);
  //     matrixIds[z] = z;
  //   }

  //   for (let z: number = 1; z < 22; ++z) {
  //     matrixIds2[z] = projCode + ":" + (z - 1);
  //     resolutions2[z] = size / Math.pow(2, z);
  //   }
  //   const wmtsSource: WMTS = new WMTS({
  //     url: fullUrl,
  //     layer: urlArray[3].split("_")[0],
  //     matrixSet: urlArray[3].split("_")[1],
  //     format: "tiles",
  //     style: "default",
  //     projection: projection,
  //     tileGrid: new WMTSTileGrid({
  //       origin: getTopLeft(projectionExtent),
  //       resolutions: resolutions,
  //       matrixIds: matrixIds,
  //     }),
  //     wrapX: true,
  //   });
  //   return wmtsSource;
  // };
  // const tiandituImgSource: WMTS = getTiandituSource({
  //   url: "http://t0.tianditu.gov.cn/img_w/wmts?tk=5524c003a4f5e5ba639f3d3dd5e0193b",
  // });
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
        imagaryLayer,
      ],
      view: new View({
        // center: fromLonLat([108.09107519289681, 29.724307714246539]),
        center: [12041299.943224058, 3475957.744334955],
        zoom: 13,
        projection: "EPSG:3857",
      }),
    });
    return () => {
      map.setTarget(undefined); // 清理地图实例
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      id="mapRoot"
      style={{ width: "100%", height: "calc(100% - 62px)" }}
    />
  );
};

export default ProjectImagary;
