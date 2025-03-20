"use client";
import { ConfigProvider, Tree, type TreeProps, type TreeDataNode } from "antd";
import styles from "./left-panel.module.scss";
import { GeoJSON } from "ol/format";
import { extend } from "ol/extent";
import { Key, useEffect } from "react";
import TileLayer from "ol/layer/Tile";
import { ImageStatic, TileWMS } from "ol/source";
import ImageLayer from "ol/layer/Image";
import { transform } from "ol/proj";
import { eventEmitter } from "@/utils/events";

const treeData: TreeDataNode[] = [
  {
    title: "国能资源一张图",
    key: "国能资源一张图",
    children: [
      {
        title: "煤矿",
        key: "煤矿",
        // children: [
        //   {
        //     title: "煤矿",
        //     key: "煤矿",
        //     children: [
        //       {
        //         title: "黑岱沟煤矿",
        //         key: "黑岱沟煤矿",
        //       },
        //       {
        //         title: "神东煤炭",
        //         key: "神东煤炭",
        //         children: [
        //           {
        //             title: "大柳塔煤矿",
        //             key: "大柳塔煤矿",
        //           },
        //           {
        //             title: "补连塔煤矿",
        //             key: "补连塔煤矿",
        //           },
        //           {
        //             title: "椾家梁煤矿",
        //             key: "椾家梁煤矿",
        //           },
        //           {
        //             title: "上湾煤矿",
        //             key: "上湾煤矿",
        //           },
        //           {
        //             title: "哈拉沟煤矿",
        //             key: "哈拉沟煤矿",
        //           },
        //           {
        //             title: "保德煤矿",
        //             key: "保德煤矿",
        //           },
        //           {
        //             title: "乌兰木伦煤矿",
        //             key: "乌兰木伦煤矿",
        //           },
        //         ],
        //       },
        //     ],
        //   },
        //  ],
      },
      {
        title: "电力",
        key: "电力",
      },
      {
        title: "化工",
        key: "化工",
      },
      {
        title: "运输场站",
        key: "运输场站",
      },
      {
        title: "路网管理",
        key: "路网管理",
        children: [
          {
            title: "铁路",
            key: "铁路",
          },
          {
            title: "公路",
            key: "公路",
          },
        ],
      },
      {
        title: "气象预警",
        key: "气象预警",
        children: [
          {
            title: "降温预警",
            key: "降温预警",
          },
          {
            title: "台风预警",
            key: "台风预警",
          },
        ],
      },
      {
        title: "北斗定位",
        key: "北斗定位",
        children: [
          {
            title: "人员",
            key: "人员",
          },
          {
            title: "车辆",
            key: "车辆",
          },
        ],
      },
    ],
  },
  // {
  //   title: "子公司",
  //   key: "子公司",
  // children: [
  //   {
  //     title: "内蒙古子公司",
  //     key: "内蒙古子公司",
  //     children: [
  //       {
  //         title: "东胜热电",
  //         key: "东胜热电",
  //       },
  //       {
  //         title: "黑岱沟煤矿",
  //         key: "黑岱煤矿",
  //       },
  //       {
  //         title: "神东煤矿",
  //         key: "神东煤矿",
  //       },
  //     ],
  //   },
  // ],
  // },
];

const LeftPanel = ({
  changeModule,
}: {
  changeModule: (value: string) => void;
}) => {
  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys, info);
    const key = info.node.key as string;
    if (!(checkedKeys as Key[]).length) {
      changeModule("total");
    }
    if ((checkedKeys as Key[]).includes("煤矿")) {
      changeModule("monitor");
    }
    if ((checkedKeys as Key[]).includes("路网管理")) {
      changeModule("road");
    }
    if ((checkedKeys as Key[]).includes("气象预警")) {
      changeModule("weather");
    }
    if ((checkedKeys as Key[]).includes("北斗定位")) {
      changeModule("location");
    }
    if ((checkedKeys as Key[]).includes("子公司")) {
      changeModule("company");
    }
    if (key.includes("国能资源一张图")) {
      drawCoal(info.checked);
      drawElec(info.checked);
      drawChem(info.checked);
      drawTrans(info.checked);
      drawTrain(info.checked);
      drawHighway(info.checked);
      drawWeather(info.checked);
      drawYutu(info.checked);
      drawCar(info.checked);
      drawHuman(info.checked);
    }
    // if (key.includes("生态监测")) {
    //   drawCoal(info.checked);
    //   drawElec(info.checked);
    //   drawChem(info.checked);
    //   drawTrans(info.checked);
    //   if (!info.checked) {
    //     eventEmitter.emit("popup:close");
    //   }
    //   return;
    // }
    if (key.includes("煤")) {
      drawCoal(info.checked);
      return;
    }
    if (key.includes("电")) {
      drawElec(info.checked);
      return;
    }
    if (key.includes("化")) {
      drawChem(info.checked);
      return;
    }
    if (key.includes("运")) {
      drawTrans(info.checked);
      return;
    }
    if (key.includes("路网管理")) {
      drawTrain(info.checked);
      drawHighway(info.checked);
      return;
    }
    if (key.includes("铁路")) {
      drawTrain(info.checked);
      return;
    }
    if (key.includes("公路")) {
      drawHighway(info.checked);
      return;
    }
    if (key.includes("气象预警")) {
      drawWeather(info.checked);
      drawYutu(info.checked);
      return;
    }
    if (key.includes("降温预警")) {
      drawWeather(info.checked);
    }
    if (key.includes("台风预警")) {
      drawYutu(info.checked);
    }
    if (key.includes("北斗定位")) {
      drawCar(info.checked);
      drawHuman(info.checked);

      return;
    }
    if (key.includes("人员")) {
      drawHuman(info.checked);

      return;
    }
    if (key.includes("车辆")) {
      drawCar(info.checked);

      return;
    }
    // if (key.includes("子公司")) {
    //   drawCompany(info.checked);
    //   return;
    // }
  };

  const drawHuman = (visible: boolean) => {
    const mapDisplay = window.map.getMapDisplay();
    const points = [
      { x: 111.21642772859512, y: 39.75578498299018 },
      { x: 111.24276714824308, y: 39.71981907763936 },
      { x: 108.663053, y: 37.596301 },
      { x: 108.135709, y: 40.027109 },
      { x: 117.40817, y: 43.148612 },
      { x: 115.474576, y: 38.254918 },
      { x: 112.002897, y: 37.212306 },
      { x: 113.81835937500001, y: 33.9615862897991 },
      { x: 104.30419921875001, y: 34.59704151614417 },
      { x: 104.69970703125, y: 30.826780904779774 },
      { x: 117.11425781250001, y: 29.113775395114416 },
      { x: 117.79541015625001, y: 35.8356283888737 },
      { x: 108.65478515625001, y: 33.779147331286474 },
      { x: 103.51318359375, y: 34.994003757575776 },
      { x: 103.68896484375001, y: 36.73888412439431 },
      { x: 101.6455078125, y: 35.55010533588552 },
      { x: 105.908203125, y: 26.82407078047018 },
      { x: 115.48828125000001, y: 28.767659105691255 },
      { x: 100.48095703125, y: 27.176469131898898 },
      { x: 117.72949218750001, y: 27.13736835979561 },
      { x: 104.39208984375001, y: 36.58024660149866 },
      { x: 96.89941406250001, y: 35.782170703266075 },
      { x: 108.58886718750001, y: 29.248063243796576 },
      { x: 108.94042968750001, y: 33.8339199536547 },
      { x: 103.79882812500001, y: 34.831841149828676 },
      { x: 101.75537109375001, y: 35.8356283888737 },
      { x: 100.23925781250001, y: 35.567980458012094 },
      { x: 114.54345703125001, y: 36.721273880045004 },
      { x: 115.42236328125001, y: 27.916766641249065 },
    ];

    if (visible) {
      points.forEach((point: Record<string, any>, index: number) => {
        mapDisplay.img([point.x, point.y], {
          url: "/images/index/human.png",
          id: "human" + index,
          style: {
            width: 24,
            height: 24,
            scale: 1,
          },
        });
      });
    } else {
      const arr = new Array(points.length).fill(true);
      arr.forEach((a, index) => {
        mapDisplay.clearFeatureById("human" + index);
      });
    }
  };

  const drawCar = (visible: boolean) => {
    const mapDisplay = window.map.getMapDisplay();
    const points = [
      { x: 111.27899199708256, y: 39.724116227392244 },
      { x: 111.20178658327903, y: 39.743574819261454 },
      { x: 110.14910344870893, y: 38.72242784335825 },
      { x: 110.63627782613875, y: 39.15823504739015 },
      { x: 110.22318338523198, y: 39.25652145976315 },
      { x: 102.3046875, y: 32.194208672875384 },
      { x: 107.53417968750001, y: 35.7286770448517 },
      { x: 115.26855468750001, y: 36.96744946416934 },
      { x: 117.02636718750001, y: 35.871246850027966 },
      { x: 111.26953125000001, y: 32.194208672875384 },
      { x: 112.28027343750001, y: 31.784216884487385 },
      { x: 113.09326171875001, y: 30.240086360983426 },
      { x: 117.26806640625001, y: 30.770159115784214 },
      { x: 99.42626953125001, y: 35.02999636902566 },
      { x: 94.98779296875, y: 34.88593094075317 },
      { x: 95.36132812500001, y: 33.394759218577995 },
      { x: 95.93261718750001, y: 34.56085936708384 },
      { x: 113.77441406250001, y: 23.785344805941214 },
      { x: 103.20556640625001, y: 25.819671943904044 },
      { x: 99.29443359375001, y: 30.29701788337205 },
      { x: 119.17968750000001, y: 33.687781758439364 },
      { x: 118.89404296875001, y: 35.38904996691167 },
      { x: 113.02734375000001, y: 36.38591277287654 },
      { x: 119.42138671875, y: 31.31610138349565 },
      { x: 117.13623046875001, y: 30.467614102257855 },
      { x: 117.22412109375001, y: 30.107117887092382 },
      { x: 103.72192382812501, y: 32.93492866908233 },
      { x: 101.46972656250001, y: 33.04550781490999 },
      { x: 100.10742187500001, y: 30.90222470517144 },
      { x: 98.98681640625001, y: 36.36822190085111 },
      { x: 98.96484375000001, y: 39.57182223734374 },
      { x: 108.23730468750001, y: 41.77131167976407 },
      { x: 112.58789062500001, y: 42.47209690919285 },
      { x: 114.56542968750001, y: 42.85985981506279 },
      { x: 102.72216796875001, y: 41.393294288784894 },
      { x: 116.14746093750001, y: 41.1455697310095 },
      { x: 97.73437500000001, y: 41.45919537950706 },
    ];

    if (visible) {
      points.forEach((point: Record<string, any>, index: number) => {
        mapDisplay.img([point.x, point.y], {
          url: "/images/index/car.png",
          id: "car" + index,
          style: {
            width: 24,
            height: 24,
            scale: 1,
          },
        });
      });
      fetch("/geojsons/car/data1.geojson")
        .then((response) => response.json())
        .then((response) => {
          // mapExtend(response);
          mapDisplay.polyline(response.coordinates);
        });
    } else {
      const arr = new Array(points.length).fill(true);
      arr.forEach((a, index) => {
        mapDisplay.clearFeatureById("car" + index);
      });
    }
  };

  const drawTrain = (visible: boolean) => {
    if (!window.map) return;
    const layer = window.map.getLayer("train");

    if (visible) {
      if (!layer) {
        const trainLayer = new TileLayer({
          source: new TileWMS({
            url: `http://172.30.1.117:8080/geoserver/ne/wms`,
            params: {
              LAYERS: "ne:全国铁路",
              TILED: true,
            },
            serverType: "geoserver",
            transition: 0,
          }),
        });
        trainLayer.set("id", "train");
        trainLayer.setZIndex(9);
        window.map.addLayer(trainLayer);
        return;
      }
      layer.show();
    } else {
      layer?.hide();
    }
  };

  const drawHighway = (visible: boolean) => {
    if (!window.map) return;
    const layer = window.map.getLayer("way");

    if (visible) {
      if (!layer) {
        const trainLayer = new TileLayer({
          source: new TileWMS({
            url: `http://172.30.1.117:8080/geoserver/ne/wms`,
            params: {
              LAYERS: "ne:中国高速_polyline",
              TILED: true,
            },
            serverType: "geoserver",
            transition: 0,
          }),
        });
        trainLayer.set("id", "way");
        trainLayer.setZIndex(9);
        window.map.addLayer(trainLayer);
        return;
      }
      layer.show();
    } else {
      layer?.hide();
    }
  };

  const drawWeather = (visible: boolean) => {
    if (!window.map) return;
    const layer = window.map.getLayer("weather");

    if (visible) {
      if (!layer) {
        // 创建图像图层
        const weatherLayer = new ImageLayer({
          source: new ImageStatic({
            url: "/images/index/weather.png", // 图片URL
            imageExtent: [
              ...transform([73.502355, 15.049616], "EPSG:4326", "EPSG:3857"), // 左上转投影坐标
              ...transform([135.09567, 53.563269], "EPSG:4326", "EPSG:3857"), // 右下转投影坐标
            ], // 转换后的坐标系范围
            projection: "EPSG:3857", // 坐标系类型
          }),
        });

        weatherLayer.set("id", "weather");
        weatherLayer.setZIndex(1);
        window.map.addLayer(weatherLayer);
        return;
      }
      layer?.show();
    } else {
      layer?.hide();
    }
  };

  const drawYutu = (visible: boolean) => {
    loadYutu(visible);
  };

  const mapExtend = (geojson: GeoJSON) => {
    // 2. 解析 GeoJSON 并计算范围
    const format = new GeoJSON();
    const features = format.readFeatures(geojson, {
      dataProjection: "EPSG:4326", // 原始坐标系（假设为 WGS84）
      featureProjection: "EPSG:3857", // 转换为 Web Mercator
    });

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
  };

  const loadCoal = () => {
    const mapDisplay = window.map.getMapDisplay();
    fetch("/geojsons/index/meikuang.geojson")
      .then((response) => response.json())
      .then((response) => {
        // mapExtend(response);
        response.features.forEach(
          (feature: Record<string, any>, index: number) => {
            mapDisplay.img(
              [
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[1],
              ],
              {
                url: "/images/index/煤.png",
                id: "煤" + index,
                style: {
                  width: 20,
                  height: 20,
                  scale: 1,
                },
              }
            );
          }
        );
      });
  };

  const loadElec = () => {
    const mapDisplay = window.map.getMapDisplay();
    fetch("/geojsons/index/dianli.geojson")
      .then((response) => response.json())
      .then((response) => {
        // mapExtend(response);
        response.features.forEach(
          (feature: Record<string, any>, index: number) => {
            mapDisplay.img(
              [
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[1],
              ],
              {
                url: "/images/index/电.png",
                id: "电" + index,
                style: {
                  width: 20,
                  height: 20,
                  scale: 1,
                },
              }
            );
          }
        );
      });
  };

  const loadChem = () => {
    const mapDisplay = window.map.getMapDisplay();
    fetch("/geojsons/index/huagong.geojson")
      .then((response) => response.json())
      .then((response) => {
        // mapExtend(response);
        response.features.forEach(
          (feature: Record<string, any>, index: number) => {
            mapDisplay.img(
              [
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[1],
              ],
              {
                url: "/images/index/化.png",
                id: "化" + index,
                style: {
                  width: 20,
                  height: 20,
                  scale: 1,
                },
              }
            );
          }
        );
      });
  };

  const loadTrans = () => {
    const mapDisplay = window.map.getMapDisplay();
    fetch("/geojsons/index/yunshu.geojson")
      .then((response) => response.json())
      .then((response) => {
        // mapExtend(response);
        response.features.forEach(
          (feature: Record<string, any>, index: number) => {
            mapDisplay.img(
              [
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[1],
              ],
              {
                url: "/images/index/运.png",
                id: "运" + index,
                style: {
                  width: 20,
                  height: 20,
                  scale: 1,
                },
              }
            );
          }
        );
      });
  };

  const loadYutu = (visible: boolean) => {
    const mapDisplay = window.map.getMapDisplay();
    fetch("/json/yutu.json")
      .then((response) => response.json())
      .then((response) => {
        if (!visible) {
          response[0].points.forEach((point: any, index: number) => {
            mapDisplay.clearFeatureById("yutu_" + index);
          });
          mapDisplay.clearFeatureById("yutu_polyline");
          mapDisplay.clearFeatureById("yutu_png");
          mapDisplay.clearFeatureById("yutu_text");
          return;
        }

        response[0].points.forEach((point: any, index: number) => {
          mapDisplay.point([point.longitude, point.latitude], {
            id: "yutu_" + index,
            style: {
              fillColor: "#f00",
              width: 3,
            },
          });
        });
        const polylines = response[0].points.map((point: any) => [
          point.longitude,
          point.latitude,
        ]);
        // window.map.centerAt(polylines[0], 5);
        mapDisplay.polyline(polylines, {
          id: "yutu_polyline",
        });
        mapDisplay.img(polylines[0], {
          url: "/images/index/yutu.png",
          id: "yutu_png",
          style: {
            width: 20,
            height: 20,
            scale: 1,
          },
        });
      });
  };

  const drawCoal = (visible: boolean) => {
    if (visible) {
      loadCoal();
    } else {
      clearCoal();
    }
  };

  const clearCoal = () => {
    const mapDisplay = window.map.getMapDisplay();
    const arr = new Array(100).fill(true);
    arr.forEach((a, index) => {
      mapDisplay.clearFeatureById("煤" + index);
    });
  };
  // 电力
  const drawElec = (visible: boolean) => {
    if (visible) {
      loadElec();
    } else {
      clearElec();
    }
  };
  const clearElec = () => {
    const mapDisplay = window.map.getMapDisplay();
    const arr = new Array(100).fill(true);
    arr.forEach((a, index) => {
      mapDisplay.clearFeatureById("电" + index);
    });
  };
  // 化工
  const drawChem = (visible: boolean) => {
    if (visible) {
      loadChem();
    } else {
      clearChem();
    }
  };
  const clearChem = () => {
    const mapDisplay = window.map.getMapDisplay();
    const arr = new Array(100).fill(true);
    arr.forEach((a, index) => {
      mapDisplay.clearFeatureById("化" + index);
    });
  };
  // 运输
  const drawTrans = (visible: boolean) => {
    if (visible) {
      loadTrans();
    } else {
      clearTrans();
    }
  };
  const clearTrans = () => {
    const mapDisplay = window.map.getMapDisplay();
    const arr = new Array(100).fill(true);
    arr.forEach((a, index) => {
      mapDisplay.clearFeatureById("运" + index);
    });
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     loadCoal();
  //     loadChem();
  //     loadElec();
  //     loadTrans();
  //     window.map.on("click", (feature) => {
  //       console.log("feature", feature);
  //     });
  //   }, 1000);
  //   if (!window.map) return;
  // }, []);

  return (
    <div className={styles.leftPanel}>
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
          defaultExpandedKeys={["生态监测", "煤矿", "神东煤炭"]}
          // defaultSelectedKeys={["生态监测"]}
          // defaultCheckedKeys={["生态监测"]}
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={treeData}
        />
      </ConfigProvider>
    </div>
  );
};

export default LeftPanel;
