import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource, WMTS } from "ol/source";
import { type Extent, getTopLeft } from "ol/extent";
import { get as getProjection, fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke } from "ol/style";
import WMTSTileGrid from "ol/tilegrid/WMTS";

function getWidth(extent: number[]) {
  return extent[2] - extent[0];
}

const geojson = {
  type: "FeatureCollection",
  name: "huishanping",
  crs: {
    type: "name",
    properties: { name: "urn:ogc:def:crs:EPSG::4490" },
  },
  features: [
    {
      type: "Feature",
      properties: {
        FileName: "TRIPLESAT_1_PAN_L4_20210802023252_0037DAVI_015",
        Name: "地块1",
        单位: "风电场",
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [108.209568543433434, 29.745037099654642],
              [108.131811246355568, 29.724319699590996],
              [108.09107519289681, 29.724307714246539],
              [108.091075192896781, 29.828429423859237],
              [108.209567812452534, 29.828429423859333],
              [108.209568543433434, 29.745037099654642],
            ],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        FileName: "TRIPLESAT_1_PAN_L4_20210802023249_0037DAVI_014",
        Name: "地块2",
        单位: "风电场运维",
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [108.131811246355568, 29.724319699590993],
              [108.209568543433434, 29.745037099654642],
              [108.209567812452562, 29.724307714246635],
              [108.131811246355568, 29.724319699590993],
            ],
          ],
        ],
      },
    },
  ],
};

const ProjectVector = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const getTiandituSource = (option: any): WMTS => {
    const fullUrl: string = option.url;
    const urlArray: string[] = fullUrl.split("/");
    const projCode: string = "EPSG:3857";
    // @ts-ignore
    const projection: Projection = getProjection(projCode);
    const projectionExtent: Extent = projection?.getExtent();
    const size: number = getWidth(projectionExtent) / 256;
    const resolutions: any[] = new Array(18);
    const matrixIds: any[] = new Array(18);
    const matrixIds2: any[] = new Array(21);
    const resolutions2: any[] = new Array(21);

    for (let z: number = 1; z < 19; ++z) {
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }

    for (let z: number = 1; z < 22; ++z) {
      matrixIds2[z] = projCode + ":" + (z - 1);
      resolutions2[z] = size / Math.pow(2, z);
    }
    const wmtsSource: WMTS = new WMTS({
      url: fullUrl,
      layer: urlArray[3].split("_")[0],
      matrixSet: urlArray[3].split("_")[1],
      format: "tiles",
      style: "default",
      projection: projection,
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds,
      }),
      wrapX: true,
    });
    return wmtsSource;
  };
  const tiandituImgSource: WMTS = getTiandituSource({
    url: "http://t0.tianditu.gov.cn/img_w/wmts?tk=5524c003a4f5e5ba639f3d3dd5e0193b",
  });

  useEffect(() => {
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojson, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    });

    // 创建矢量图层
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: "#0048ff16",
        }),
        stroke: new Stroke({
          color: "#0048ff",
          width: 2,
        }),
      }),
    });

    // 创建地图
    const map = new Map({
      target: mapContainerRef.current!,
      layers: [
        // new TileLayer({
        //   source: new OSM(), // 天地影像图层可以通过 OSM 替换为实际的天地图层
        // }),
        new TileLayer({
          source: tiandituImgSource,
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([108.09107519289681, 29.724307714246539]),
        zoom: 10,
        projection: "EPSG:3857",
      }),
    });
    // 获取矢量数据的范围
    const extent = vectorSource.getExtent();
    // 调整视图以适应矢量数据的范围
    map.getView().fit(extent, { padding: [50, 50, 50, 50] });
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

export default ProjectVector;
