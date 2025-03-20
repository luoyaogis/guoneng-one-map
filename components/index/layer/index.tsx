// "use client";
// import { useEffect, useRef, useState } from "react";
// import * as Cesium from "cesium";
// import "cesium/Build/Cesium/Widgets/widgets.css";
// import styles from "./layer.module.scss";
// import { createFromIconfontCN } from "@ant-design/icons";
// import { Input, Tree } from "antd";

// const iconFontDefaultStyle = {
//   fontSize: "20px",
//   verticalAlign: "middle",
//   fontWeight: "bold",
// };

// // 2. 创建 Icon 组件（配置项目生成的 symbol 链接）
// const IconFont = createFromIconfontCN({
//   scriptUrl: "//at.alicdn.com/t/c/font_4840312_jmtk8e7ctw.js", // 替换为你的 iconfont 项目地址
//   extraCommonProps: {
//     style: {
//       ...iconFontDefaultStyle,
//     },
//     className: "global-icon-class", // 可添加全局 class
//   },
// });

// interface DataNode {
//   title: string;
//   key: string;
//   children?: DataNode[];
// }

// // 生成树形数据（根据图片内容结构化）
// const treeData: DataNode[] = [
//   {
//     title: "神东煤炭",
//     key: "神东煤炭",
//     children: [
//       {
//         title: "大柳塔煤矿",
//         key: "大柳塔煤矿",
//         children: [
//           {
//             title: "基础数据",
//             key: "大柳塔煤矿-基础数据",
//             children: [{ title: "遥感影像数据", key: "基础数据-遥感影像数据" }],
//           },
//           {
//             title: "矢量数据",
//             key: "矢量数据",
//             children: [
//               { title: "矿区范围", key: "矢量数据-矿区范围" },
//               {
//                 title: "生态保护红线与自然保护",
//                 key: "矢量数据-生态保护红线与自然保护",
//               },
//               { title: "塌陷区范围", key: "矢量数据-塌陷区范围" },
//               { title: "抗沉地块", key: "矢量数据-抗沉地块" },
//               { title: "裂缝发育区", key: "矢量数据-裂缝发育区" },
//             ],
//           },
//           {
//             title: "三维数据",
//             key: "三维数据",
//             children: [
//               { title: "煤矿三维模型", key: "三维数据-煤矿三维模型" },
//               { title: "点云模型", key: "三维数据-点云模型" },
//             ],
//           },
//         ],
//       },
//       {
//         title: "补连塔煤矿",
//         key: "补连塔煤矿",
//       },
//       {
//         title: "上湾煤矿",
//         key: "上湾煤矿",
//       },
//       {
//         title: "哈拉沟煤矿",
//         key: "哈拉沟煤矿",
//       },
//       {
//         title: "保德煤矿",
//         key: "保德煤矿",
//       },
//       {
//         title: "乌兰木伦煤矿",
//         key: "乌兰木伦煤矿",
//       },
//       {
//         title: "石圪台煤矿",
//         key: "石圪台煤矿",
//       },
//       {
//         title: "锦界煤矿",
//         key: "锦界煤矿",
//       },
//       {
//         title: "布尔台煤矿",
//         key: "布尔台煤矿",
//       },
//       {
//         title: "柳塔煤矿",
//         key: "柳塔煤矿",
//       },
//       {
//         title: "寸草塔煤矿",
//         key: "寸草塔煤矿",
//       },
//       {
//         title: "寸草塔二矿",
//         key: "寸草塔二矿",
//       },
//     ],
//   },
// ];

// const MapLayer = () => {
//   const layerRef = useRef<Cesium.ImageryLayer>(null);
//   const vectorRef = useRef<Cesium.GeoJsonDataSource>(null);
//   const [visible, setVisible] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
//   const [autoExpandParent, setAutoExpandParent] = useState(true);

//   // useEffect(() => {
//   //   if (!window.viewer) return;
//   //   layerRef.current = window.viewer.imageryLayers.addImageryProvider(
//   //     new Cesium.WebMapServiceImageryProvider({
//   //       url: "http://172.30.1.117:8080/geoserver/wms",
//   //       layers: "ne:huishanping_4326",
//   //       parameters: {
//   //         service: "WMS",
//   //         format: "image/png",
//   //         transparent: true,
//   //         version: "1.3.0", // 或者 '1.3.0'
//   //       },
//   //     })
//   //   );
//   //   const bbox = [
//   //     108.0880676926, 29.7217557661, 108.2124569127, 29.7217557661,
//   //     108.2124569127, 29.8309869536, 108.0880676926, 29.8309869536,
//   //     108.0880676926, 29.7217557661,
//   //   ];
//   //   window.viewer.camera.flyTo({
//   //     destination: Cesium.Rectangle.fromDegrees(
//   //       bbox[0],
//   //       bbox[1],
//   //       bbox[4],
//   //       bbox[5]
//   //     ),
//   //     duration: 1,
//   //   });
//   // }, []);

//   // 搜索过滤函数
//   const filterTree = (data: DataNode[], searchText: string): DataNode[] => {
//     return data
//       .map((item) => ({ ...item }))
//       .filter((node) => {
//         if (node.children?.length) {
//           node.children = filterTree(node.children, searchText);
//         }
//         return (
//           node.title.toLowerCase().includes(searchText.toLowerCase()) ||
//           (node.children && node.children.length > 0)
//         );
//       });
//   };

//   // 处理搜索输入
//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setSearchValue(value);

//     if (!value) {
//       setExpandedKeys([]);
//       return;
//     }

//     const matchedKeys: React.Key[] = [];
//     const traverse = (nodes: DataNode[]) => {
//       nodes.forEach((node) => {
//         if (node.title.toLowerCase().includes(value.toLowerCase())) {
//           matchedKeys.push(node.key);
//         }
//         if (node.children) {
//           traverse(node.children);
//         }
//       });
//     };

//     traverse(treeData);
//     setExpandedKeys(matchedKeys);
//     setAutoExpandParent(true);
//   };

//   const drawImage = (visible: boolean) => {
//     if (visible) {
//       if (layerRef.current) {
//         layerRef.current!.show = true;
//         return;
//       }
//       layerRef.current = window.viewer.imageryLayers.addImageryProvider(
//         new Cesium.WebMapServiceImageryProvider({
//           url: "http://172.30.1.117:8080/geoserver/wms",
//           layers: "ne:huishanping_4326",
//           parameters: {
//             service: "WMS",
//             format: "image/png",
//             transparent: true,
//             version: "1.3.0", // 或者 '1.3.0'
//           },
//         })
//       );
//       const bbox = [
//         108.0880676926, 29.7217557661, 108.2124569127, 29.7217557661,
//         108.2124569127, 29.8309869536, 108.0880676926, 29.8309869536,
//         108.0880676926, 29.7217557661,
//       ];
//       window.viewer.camera.flyTo({
//         destination: Cesium.Rectangle.fromDegrees(
//           bbox[0],
//           bbox[1],
//           bbox[4],
//           bbox[5]
//         ),
//         duration: 1,
//       });
//     } else {
//       layerRef.current!.show = false;
//     }
//   };

//   const drawVector = (visible: boolean) => {
//     if (visible) {
//       if (vectorRef.current) {
//         vectorRef.current!.show = true;
//         return;
//       }
//       // 从本地文件加载
//       const geojsonFile = "/area.geojson";
//       Cesium.GeoJsonDataSource.load(geojsonFile).then((dataSource) => {
//         vectorRef.current = dataSource;
//         window.viewer.dataSources.add(dataSource);
//       });
//       const bbox = [
//         108.0880676926, 29.7217557661, 108.2124569127, 29.7217557661,
//         108.2124569127, 29.8309869536, 108.0880676926, 29.8309869536,
//         108.0880676926, 29.7217557661,
//       ];
//       window.viewer.camera.flyTo({
//         destination: Cesium.Rectangle.fromDegrees(
//           bbox[0],
//           bbox[1],
//           bbox[4],
//           bbox[5]
//         ),
//         duration: 1,
//       });
//     } else {
//       vectorRef.current!.show = false;
//     }
//   };

//   const onCheck = (keys: string[], nodeInfo: any) => {
//     console.log(keys, nodeInfo.node.key);
//     if (nodeInfo.node.key.includes("基础数据")) {
//       drawImage(nodeInfo.checked);
//       return;
//     }
//     if (nodeInfo.node.key.includes("矢量数据")) {
//       drawVector(nodeInfo.checked);
//       return;
//     }
//   };

//   return (
//     <>
//       <div className={styles.floatBtn} onClick={() => setVisible((v) => !v)}>
//         <IconFont
//           type="icon-layer"
//           style={{ ...iconFontDefaultStyle, marginRight: 6 }}
//         />
//         图层
//       </div>

//       <div
//         className={[styles.floatLayer, !visible ? styles.hidden : ""].join(" ")}
//       >
//         <Input.Search
//           placeholder="请输入关键词"
//           value={searchValue}
//           onChange={handleSearch}
//           style={{ marginBottom: 8 }}
//         />

//         <Tree
//           checkable
//           expandedKeys={expandedKeys}
//           autoExpandParent={autoExpandParent}
//           treeData={filterTree(treeData, searchValue)}
//           // @ts-ignore
//           onCheck={onCheck}
//           onExpand={(keys) => {
//             setExpandedKeys(keys);
//             setAutoExpandParent(false);
//           }}
//         />
//       </div>
//     </>
//   );
// };

// export default MapLayer;
