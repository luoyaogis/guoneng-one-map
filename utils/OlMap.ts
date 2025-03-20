import OMap from 'ol/Map';
import View from 'ol/View';
import { Layer } from 'ol/layer';
import { defaults as defaultInteractions, Draw, Select } from 'ol/interaction';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Fill, Stroke, Circle as CircleStyle, Text, Icon } from 'ol/style';
import { Point, LineString, Polygon, Circle } from 'ol/geom';
import { Feature } from 'ol';
import { fromLonLat, transformExtent } from 'ol/proj';
import { Geometry } from 'ol/geom';
import { DrawEvent } from 'ol/interaction/Draw';
import { transform } from 'ol/proj';
import { getLength, getArea } from 'ol/sphere';
import { click, doubleClick } from 'ol/events/condition';
import { type CSSProperties } from 'react';

interface OlMapOptions {
  target: string | HTMLElement;
  layers?: Layer[];
  zIndex?: number;
  extent?: number[];
  center?: number[];
  zoom?: number;
  projection?: string;
  controls?: {
    showScale?: boolean;
    showZoom?: boolean;
    showCoordinate?: boolean;
    showResolution?: boolean;
    showLayerControl?: boolean;  // 添加图层控制显示配置
  };
  controlsStyle?: CSSProperties;
  tools?: {
    showMeasure?: boolean;     // 距离测量
    showArea?: boolean;        // 面积测量
    showLayer?: boolean;       // 图层切换
    showZoomIn?: boolean;      // 地图放大
    showZoomOut?: boolean;     // 地图缩小
    showReset?: boolean;       // 地图复原
  };
  toolsStyle?: CSSProperties;
}

interface DisplayStyle {
  color?: string;
  width?: number;
  fillColor?: string;
}

interface TextStyle {
  fontSize?: number;
  fontFamily?: string;
  offsetX?: number;
  offsetY?: number;
  color?: string;
  backgroundColor?: string;
}


type Merge<T, K> = T & K;

interface IconStyle {
  width?: number;
  height?: number;
  scale?: number;
  opacity?: number;
  anchor?: number[];
  offset?: number[];
}

// 定义回调事件类型
interface DrawCallbackEvent {
  type: 'doing' | 'done';
  coordinates: number[][];  // GeoJSON 格式的坐标
  geometry: Geometry;       // OpenLayers 几何对象
  feature: Feature;         // OpenLayers 要素对象
}

type DrawCallback = (event: DrawCallbackEvent) => void;

interface FeatureOptions {
  id?: string;
  style?: DisplayStyle;
}

interface TextFeatureOptions extends FeatureOptions {
  content: any;
  style?: TextStyle;
}

interface IconFeatureOptions extends FeatureOptions {
  url: string;
  style?: IconStyle;
}

interface CircleFeatureOptions extends FeatureOptions {
  radius: number;
}

class MapDisplay {
  private map: OMap;
  vectorLayer: VectorLayer<VectorSource>;
  private vectorSource: VectorSource;

  constructor(map: OMap) {
    this.map = map;
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      zIndex: 9999
    });
    this.map.addLayer(this.vectorLayer);
  }

  private createStyle(style?: DisplayStyle) {
    return new Style({
      stroke: new Stroke({
        color: style?.color || 'blue',
        width: style?.width || 2
      }),
      fill: new Fill({
        color: style?.fillColor || 'rgba(0, 0, 255, 0.1)'
      }),
      image: new CircleStyle({
        radius: style?.width || 5,
        fill: new Fill({
          color: style?.fillColor || 'blue'
        })
      })
    });
  }

  private createTextStyle(style?: Merge<TextStyle, { content: any }>) {
    return new Style({
      text: new Text({
        text: style?.content,
        font: `${style?.fontSize || 14}px ${style?.fontFamily || 'Arial'}`,
        offsetX: style?.offsetX || 0,
        offsetY: style?.offsetY || 0,
        fill: new Fill({
          color: style?.color || '#333'
        }),
        backgroundFill: style?.backgroundColor ? new Fill({
          color: style?.backgroundColor
        }) : undefined,
        padding: [5, 8, 5, 8]
      }),
      zIndex: 9999
    });
  }

  private createIconStyle(style?: Merge<IconStyle, { url: string }>) {
    let iconStyle: any = {
      src: style?.url,
      opacity: style?.opacity || 1,
      anchor: style?.anchor || [0.5, 1],
      offset: style?.offset || [0, 0]
    }
    if ((style?.width || style?.height) && style.scale) {
      console.warn("You can't set width or height and scale at the same time");
      iconStyle.width = style?.width;
      iconStyle.height = style?.height;
    } else {
      iconStyle.scale = style?.scale || 1;
    }
    return new Style({
      image: new Icon({
        ...iconStyle
      }),
      zIndex: 9999
    });
  }

  polyline(coordinates: number[][], options?: FeatureOptions) {
    const feature = new Feature({
      geometry: new LineString(coordinates.map(coord => fromLonLat(coord)))
    });
    if (options?.id) feature.setId(options.id);
    feature.setStyle(this.createStyle(options?.style));
    this.vectorSource.addFeature(feature);
    return feature;
  }

  polylines(coordinatesArray: number[][][], options?: FeatureOptions & { idPrefix?: string }) {
    return coordinatesArray.map((coords, index) =>
      this.polyline(coords, {
        ...options,
        id: options?.idPrefix ? `${options.idPrefix}_${index}` : options?.id
      })
    );
  }

  polygon(coordinates: number[][], options?: FeatureOptions) {
    const feature = new Feature({
      geometry: new Polygon([coordinates.map(coord => fromLonLat(coord))])
    });
    if (options?.id) feature.setId(options.id);
    feature.setStyle(this.createStyle(options?.style));
    this.vectorSource.addFeature(feature);
    return feature;
  }

  polygons(coordinatesArray: number[][][], options?: FeatureOptions & { idPrefix?: string }) {
    return coordinatesArray.map((coords, index) =>
      this.polygon(coords, {
        ...options,
        id: options?.idPrefix ? `${options.idPrefix}_${index}` : options?.id
      })
    );
  }

  point(coordinate: number[], options?: FeatureOptions) {
    const feature = new Feature({
      geometry: new Point(fromLonLat(coordinate))
    });
    if (options?.id) feature.setId(options.id);
    feature.setStyle(this.createStyle({ width: 5, ...options?.style }));
    this.vectorSource.addFeature(feature);
    return feature;
  }

  circle(center: number[], options: CircleFeatureOptions) {
    const feature = new Feature({
      geometry: new Circle(fromLonLat(center), options.radius)
    });
    if (options?.id) feature.setId(options.id);
    feature.setStyle(this.createStyle(options?.style));
    this.vectorSource.addFeature(feature);
    return feature;
  }

  text(coordinate: number[], options: TextFeatureOptions) {
    if (!options?.content) {
      console.warn('Text content is required');
      return;
    }

    const feature = new Feature({
      geometry: new Point(fromLonLat(coordinate))
    });
    if (options?.id) feature.setId(options.id);
    feature.setStyle(this.createTextStyle({ ...options.style, content: options?.content }));
    this.vectorSource.addFeature(feature);
    return feature;
  }

  img(coordinate: number[], options: IconFeatureOptions) {
    const feature = new Feature({
      geometry: new Point(fromLonLat(coordinate))
    });
    if (options?.id) feature.setId(options.id);
    feature.setStyle(this.createIconStyle({ ...options.style, url: options.url }));
    this.vectorSource.addFeature(feature);
    return feature;
  }

  getFeatureById(id: string): Feature | null {
    return this.vectorSource.getFeatureById(id);
  }

  clearFeatureById(id: string): boolean {
    const feature = this.getFeatureById(id);
    if (feature) {
      this.vectorSource.removeFeature(feature);
      return true;
    }
    return false;
  }

  clear() {
    this.vectorSource.clear();
  }
}

class MapDraw {
  private map: OMap;
  vectorLayer: VectorLayer<VectorSource>;
  private vectorSource: VectorSource;
  draw: Draw | null = null;
  private defaultStyle: Style | null = null;
  private isDrawing: boolean = false;

  constructor(map: OMap) {
    this.map = map;
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      zIndex: 9999
    });
    this.map.addLayer(this.vectorLayer);
  }

  init(style?: DisplayStyle) {
    this.defaultStyle = this.createStyle(style);
    this.vectorLayer.setStyle(this.defaultStyle);
  }

  private createStyle(style?: DisplayStyle) {
    return new Style({
      stroke: new Stroke({
        color: style?.color || 'red',
        width: style?.width || 2
      }),
      fill: new Fill({
        color: style?.fillColor || 'rgba(255, 0, 0, 0.1)'
      }),
      image: new CircleStyle({
        radius: style?.width || 5,
        fill: new Fill({
          color: style?.fillColor || 'red'
        })
      })
    });
  }

  private createTextStyle(style?: Merge<TextStyle, { content: any }>) {
    return new Style({
      text: new Text({
        text: style?.content,
        font: `${style?.fontSize || 14}px ${style?.fontFamily || 'Arial'}`,
        offsetX: style?.offsetX || 0,
        offsetY: style?.offsetY || 0,
        fill: new Fill({
          color: style?.color || '#fff'
        }),
        backgroundFill: style?.backgroundColor ? new Fill({
          color: style?.backgroundColor
        }) : new Fill({
          color: "#000"
        }),
        padding: [5, 8, 5, 8]
      })
    });
  }

  private createIconStyle(style?: IconStyle) {
    return new Style({
      image: new Icon({
        src: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        scale: style?.scale || 1,
        opacity: style?.opacity || 1,
        anchor: style?.anchor || [0.5, 1],
        offset: style?.offset || [0, 0],
      })
    });
  }

  private startDraw(
    type: 'Point' | 'LineString' | 'Polygon' | 'Circle',
    style?: DisplayStyle | IconStyle | TextStyle,
    callback?: DrawCallback,
    geometryFunction?: any
  ) {
    if (this.draw) {
      this.map.removeInteraction(this.draw);
    }

    const drawStyle = style ? this.createStyle(style as DisplayStyle) : this.defaultStyle || undefined;

    this.draw = new Draw({
      source: this.vectorSource,
      type: type,
      style: drawStyle,
      geometryFunction: geometryFunction,
      // condition: (event) => {
      //   // if (event.type === 'dblclick') {
      //   //   return true;
      //   // }
      //   return event.type === 'dblclick';
      // },
      freehandCondition: () => false
    })!;

    this.map.addInteraction(this.draw);

    if (callback) {
      this.draw.on('drawstart', (e: DrawEvent) => {
        this.isDrawing = true;
        e.feature.setStyle(drawStyle);

        const geometry = e.feature.getGeometry()!;
        const coordinates = this.getGeoJSONCoordinates(geometry);

        callback({
          type: 'doing',
          coordinates,
          geometry,
          feature: e.feature
        });
      });

      this.draw.on('drawend', (e: DrawEvent) => {
        this.isDrawing = false;
        e.feature.setStyle(drawStyle);

        const geometry = e.feature.getGeometry()!;
        const coordinates = this.getGeoJSONCoordinates(geometry);

        callback({
          type: 'done',
          coordinates,
          geometry,
          feature: e.feature
        });
      });
    }
  }

  private endDraw() {
    if (this.draw) {
      this.map.removeInteraction(this.draw);
      this.draw = null;  // 清除当前绘制实例
    }
  }

  // 添加坐标转换方法
  private getGeoJSONCoordinates(geometry: Geometry): number[][] {
    if (!geometry) return [];

    let coordinates: number[][] = [];

    if (geometry instanceof Point) {
      const coord = transform(geometry.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
      coordinates = [coord];
    } else if (geometry instanceof LineString) {
      coordinates = geometry.getCoordinates().map(coord =>
        transform(coord, 'EPSG:3857', 'EPSG:4326')
      );
    } else if (geometry instanceof Polygon) {
      coordinates = geometry.getCoordinates()[0].map(coord =>
        transform(coord, 'EPSG:3857', 'EPSG:4326')
      );
    } else if (geometry instanceof Circle) {
      const center = transform(geometry.getCenter(), 'EPSG:3857', 'EPSG:4326');
      coordinates = [center];
    }

    return coordinates;
  }

  cancel() {
    this.endDraw();
  }

  clear() {
    // 结束当前绘制
    this.endDraw();

    // 清除矢量图层上的所有要素
    if (this.vectorSource) {
      this.vectorSource.clear();
    }
  }

  polyline(style?: DisplayStyle, callback?: DrawCallback) {
    this.startDraw('LineString', style, callback);
  }

  polygon(style?: DisplayStyle, callback?: DrawCallback) {
    this.startDraw('Polygon', style, callback);
  }

  rect(style?: DisplayStyle, callback?: DrawCallback) {
    this.startDraw('Circle', style, callback, createBox);
  }

  point(style?: DisplayStyle, callback?: DrawCallback) {
    this.startDraw('Point', { width: 5, ...style }, callback);
  }

  circle(style?: DisplayStyle, callback?: DrawCallback) {
    this.startDraw('Circle', style, callback);
  }

  text(style?: Merge<TextStyle, { content: any }>, callback?: DrawCallback) {
    if (!style?.content) {
      console.warn('Text content is required');
      return;
    }

    this.startDraw('Point', style, (event) => {
      if (callback) callback(event);
      if (event.type === 'done') {
        const feature = event.feature;
        feature.setStyle(this.createTextStyle(style));
      }
    });
  }

  location(style?: IconStyle, callback?: DrawCallback) {
    this.startDraw('Point', style, (event) => {
      if (callback) callback(event);
      if (event.type === 'done') {
        const feature = event.feature;
        feature.setStyle(this.createIconStyle(style));
      }
    });
  }
}

function createBox(coordinates: any, geometry: any) {
  const start = coordinates[0];
  const end = coordinates[1];
  const minX = Math.min(start[0], end[0]);
  const minY = Math.min(start[1], end[1]);
  const maxX = Math.max(start[0], end[0]);
  const maxY = Math.max(start[1], end[1]);

  const ring = [[minX, minY], [minX, maxY], [maxX, maxY], [maxX, minY], [minX, minY]];
  if (!geometry) {
    geometry = new Polygon([ring]);
  } else {
    geometry.setCoordinates([ring]);
  }
  return geometry;
};

/**
 * 图层包装类
 * @class LayerWrapper
 */
class LayerWrapper {
  /**
   * 创建图层包装实例
   * @param {Layer} layer - OpenLayers 图层对象
   * @param {string} id - 图层 ID
   */
  constructor(private layer: Layer, private id: string) {
    // ... 构造函数代码保持不变
  }

  getId() {
    return this.id;
  }

  show() {
    this.layer.setVisible(true);
    return this;
  }

  hide() {
    this.layer.setVisible(false);
    return this;
  }

  setOpacity(opacity: number) {
    this.layer.setOpacity(opacity);
    return this;
  }

  getOpacity() {
    return this.layer.getOpacity();
  }

  getVisible() {
    return this.layer.getVisible();
  }

  toggle() {
    this.layer.setVisible(!this.getVisible());
    return this;
  }

  setVisible(visible: boolean) {
    this.layer.setVisible(visible);
    return this;
  }

  // 新增图层层级控制方法
  getZIndex() {
    return this.layer.getZIndex();
  }

  setZIndex(zIndex: number) {
    this.layer.setZIndex(zIndex);
    return this;
  }

  getLayer() {
    return this.layer;
  }
}

export class OlMap {
  private map: OMap;
  private display: MapDisplay;
  private draw: MapDraw;
  private layerMap: Map<string, LayerWrapper> = new Map();
  private infoElement: HTMLDivElement | null = null;
  private options: OlMapOptions;
  private toolsElement: HTMLDivElement | null = null;
  private initialCenter: number[] | undefined;
  private initialZoom: number | undefined;
  private measureElement: HTMLDivElement | null = null;
  private measuring: boolean = false;
  private measureLayer: VectorLayer<VectorSource>;
  private measureSource: VectorSource;
  private sketch: Feature | null = null;
  private measureIdMap: Map<string, { textId: string, featureId: string }> = new Map();
  private currentMeasureId: string | null = null;
  private currentMeasureType: 'LineString' | 'Polygon' | null = null;  // 添加当前测量类型状态
  private layerControlPopup: HTMLDivElement | null = null;
  private layerControlVisible: boolean = false;
  private events: Map<string, (feature: Feature<Geometry>) => void> = new Map();
  constructor(options: OlMapOptions) {
    this.options = options;
    const { showScale, showZoom, showCoordinate, showResolution } = options.controls || {};
    if (showScale ||
      showZoom ||
      showCoordinate ||
      showResolution) {
      // 创建信息容器
      this.infoElement = document.createElement('div');
      this.infoElement.className = 'ol-map-info';
      this.infoElement.style.cssText = `
        position: absolute;
        left: ${options.controlsStyle?.left + 'px' || '8px'};
        bottom: ${options.controlsStyle?.bottom + 'px' || '8px'};
        background: rgba(255,255,255,0.8);
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        color: #333;
        line-height: 1.5;
        min-width: 190px;
      `;

      // 创建各个信息项
      const items: { [key: string]: HTMLDivElement } = {};

      if (showZoom) {
        items.zoom = document.createElement('div');
        items.zoom.className = 'ol-map-info-item zoom';
      }

      if (showScale) {
        items.scale = document.createElement('div');
        items.scale.className = 'ol-map-info-item scale';
      }

      if (showCoordinate) {
        items.coordinate = document.createElement('div');
        items.coordinate.className = 'ol-map-info-item coordinate';
      }

      if (showResolution) {
        items.resolution = document.createElement('div');
        items.resolution.className = 'ol-map-info-item resolution';
      }

      // 添加到容器
      Object.values(items).forEach(item => {
        this.infoElement?.appendChild(item);
      });
    }

    // 保存初始状态用于复原
    this.initialCenter = options.center;
    this.initialZoom = options.zoom;

    // 创建工具条
    if (options.tools) {  // 如果不是明确禁用，则默认全部开启
      this.toolsElement = document.createElement('div');
      this.toolsElement.className = 'ol-map-tools';
      this.toolsElement.style.cssText = `
        position: absolute;
        bottom: ${options.toolsStyle?.bottom + 'px' || "20"};
        right: ${options.toolsStyle?.right + 'px' || "50"};
        background: rgba(255,255,255,0.8);
        padding: 2px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        gap: 8px;
      `;

      // 创建工具按钮
      const tools = [
        { type: 'length', title: '距离测量', show: options.tools?.showMeasure !== false },
        { type: 'area', title: '面积测量', show: options.tools?.showArea !== false },
        { type: 'layer', title: '图层管理', show: options.tools?.showLayer !== false },
        { type: 'zoomin', title: '放大', show: options.tools?.showZoomIn !== false },
        { type: 'zoomout', title: '缩小', show: options.tools?.showZoomOut !== false },
        { type: 'reset', title: '复原', show: options.tools?.showReset !== false }
      ];

      tools.forEach(tool => {
        if (tool.show) {
          const button = document.createElement('div');
          button.className = 'ol-map-tool-btn';
          button.title = tool.title;
          button.innerHTML = `<svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-${tool.type}"></use>
                              </svg>`;
          button.style.cssText = `
            border: none;
            background: transparent;
            cursor: pointer;
            padding: 8px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 14px;
            height: 14px;
            overflow:hidden;
          `;
          button.addEventListener('mouseover', () => {
            button.style.background = '#fff';
          });
          button.addEventListener('mouseout', () => {
            button.style.background = 'transparent';
          });

          // 绑定事件
          switch (tool.type) {
            case 'length':
              button.onclick = () => this.startMeasure('LineString');
              break;
            case 'area':
              button.onclick = () => this.startMeasure('Polygon');
              break;
            case 'layer':
              button.addEventListener('click', (e) => {
                e.stopPropagation();  // 阻止事件冒泡
                this.showLayerControl(button);
              });
              break;
            case 'zoomin':
              button.onclick = () => this.zoomIn();
              break;
            case 'zoomout':
              button.onclick = () => this.zoomOut();
              break;
            case 'reset':
              button.onclick = () => this.reset();
              break;
          }

          this.toolsElement?.appendChild(button);
        }
      });
    }
    // 初始化测量图层 - 移到 map 初始化之前
    this.measureSource = new VectorSource();
    this.measureLayer = new VectorLayer({
      source: this.measureSource,
      style: new Style({
        fill: new Fill({
          color: 'rgba(0, 153, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: '#0099ff',
          width: 2
        }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: '#0099ff'
          })
        })
      }),
      zIndex: 9999
    });

    this.map = new OMap({
      target: options.target,
      controls: [], // 清空默认控件
      view: new View({
        center: options.center ? fromLonLat(options.center) : undefined,
        zoom: options.zoom,
        projection: options.projection || "EPSG:3857",
        extent: options.extent ? transformExtent(options.extent, 'EPSG:4326', 'EPSG:3857') : undefined,
      }),
      interactions: defaultInteractions({
        doubleClickZoom: false // 禁用双击缩放
      }),

    });
    // 添加测量图层到地图
    this.map.addLayer(this.measureLayer);

    // 添加信息容器到地图
    if (this.infoElement) {
      const targetElement = this.map.getTargetElement();
      targetElement.appendChild(this.infoElement);

      // 监听地图变化
      this.map.on('moveend', () => {
        this.updateMapInfo();
      });

      // 监听鼠标移动
      this.map.on('pointermove', (e) => {
        const coord = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
        const coordText = `坐标: ${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`;
        const coordElement = this.infoElement?.querySelector('.coordinate');
        if (coordElement) {
          coordElement.textContent = coordText;
        }
      });

      // 初始更新信息
      this.updateMapInfo();
    }

    // 添加工具条到地图
    if (this.toolsElement) {
      const targetElement = this.map.getTargetElement();
      targetElement.appendChild(this.toolsElement);
    }

    // 创建测量结果显示元素
    // this.measureElement = document.createElement('div');
    // this.measureElement.className = 'ol-measure-result';
    // this.measureElement.style.cssText = `
    //   position: absolute;
    //   top: 50%;
    //   left: 50%;
    //   transform: translate(-50%, -50%);
    //   background: rgba(0, 0, 0, 0.6);
    //   color: white;
    //   padding: 8px 12px;
    //   border-radius: 4px;
    //   font-size: 14px;
    //   pointer-events: none;
    //   display: none;
    // `;

    // const targetElement = this.map.getTargetElement();
    // targetElement.appendChild(this.measureElement);

    if (options.layers) {
      options.layers.forEach((layer, index) => {
        layer.setZIndex(options.zIndex !== undefined ? options.zIndex + index : index);
        this.addLayer(layer);
      });
    }

    this.display = new MapDisplay(this.map);
    // 创建 Select 交互
    const selectInteraction = new Select({
      condition: click, // 触发条件（点击）
      layers: [this.display.vectorLayer], // 指定监听的图层（可选）
    });

    // 将 Select 交互添加到地图
    this.map.addInteraction(selectInteraction);
    // 监听选中事件
    selectInteraction.on('select', (event) => {
      if (event.selected.length > 0) {
        const selectedFeature = event.selected[0];
        this.events.forEach(event => {
          event?.(selectedFeature);
        })
      }
    });
    this.draw = new MapDraw(this.map);
  }



  public on(eventType: string, cb: (feature: Feature<Geometry>) => void) {
    this.events.set(eventType, cb);
  }

  private updateMapInfo() {
    if (!this.infoElement) return;

    // const items = this.infoElement.children;
    const view = this.getView();
    const resolution = view.getResolution();
    const zoom = view.getZoom();
    const zoomEl = this.infoElement.querySelector('.zoom');
    const scaleEl = this.infoElement.querySelector('.scale');
    const resolutionEl = this.infoElement.querySelector('.resolution');
    // 更新缩放级别
    if (this.options.controls?.showZoom && zoomEl) {
      zoomEl.textContent = `缩放级别: ${zoom?.toFixed(2)}`;
    }

    // 更新比例尺
    if (this.options.controls?.showScale && scaleEl) {
      const scale = resolution ? Math.round(resolution * 3779.527559055) : 0;
      scaleEl.textContent = `比例尺: 1:${scale}`;
    }

    // 坐标在 pointermove 事件中更新

    // 更新分辨率
    if (this.options.controls?.showResolution && resolutionEl) {
      resolutionEl.textContent = `分辨率: ${resolution?.toFixed(2)} 米/像素`;
    }
  }

  getLayer(id: string): LayerWrapper | undefined {
    return this.layerMap.get(id);
  }

  getLayers(): LayerWrapper[] {
    return Array.from(this.layerMap.values());
  }

  addLayer(layer: Layer) {
    const id = layer.get('id');
    if (!id) {
      console.warn('Layer must have an id property');
      return;
    }

    const wrapper = new LayerWrapper(layer, id);
    this.layerMap.set(id, wrapper);

    this.map.addLayer(layer);

    return wrapper;
  }

  addLayers(layers: Layer[]) {
    return layers.map(layer => this.addLayer(layer));
  }

  removeLayer(id: string) {
    const wrapper = this.layerMap.get(id);
    if (wrapper) {
      this.map.removeLayer(wrapper.getLayer());
      this.layerMap.delete(id);
    }
  }

  getView() {
    return this.map.getView();
  }

  getZoom() {
    return this.map.getView().getZoom();
  }

  setZoom(zoom: number) {
    this.map.getView().setZoom(zoom);
  }

  getExtent() {
    return this.map.getView().calculateExtent(this.map.getSize());
  }

  setExtent(extent: number[]) {
    this.map.getView().fit(transformExtent(extent, 'EPSG:4326', 'EPSG:3857'));
  }

  getMapDisplay() {
    return this.display;
  }

  getMapDraw() {
    return this.draw;
  }

  destory() {
    // 清理绘制相关的资源
    if (this.draw) {
      const drawInteraction = this.draw.draw;
      if (drawInteraction) {
        this.map.removeInteraction(drawInteraction);
      }
      const drawLayer = this.draw.vectorLayer;
      if (drawLayer) {
        this.map.removeLayer(drawLayer);
      }
    }

    // 清理显示相关的资源
    if (this.display) {
      const displayLayer = this.display.vectorLayer;
      if (displayLayer) {
        this.map.removeLayer(displayLayer);
      }
    }

    this.map.getLayers().getArray().slice().forEach(layer => {
      this.map.removeLayer(layer);
    });

    // 清理图层映射
    this.layerMap.clear();

    // 移除地图目标元素
    this.map.setTarget(undefined);

    // 清理地图实例
    this.map.dispose();

    if (this.infoElement) {
      this.infoElement.remove();
      this.infoElement = null;
    }

    if (this.toolsElement) {
      this.toolsElement.remove();
      this.toolsElement = null;
    }

    if (this.measureElement) {
      this.measureElement.remove();
      this.measureElement = null;
    }

    // 清理测量相关资源
    this.clearMeasure();
    if (this.measureLayer) {
      this.map.removeLayer(this.measureLayer);
    }

    // 清理图层控制
    if (this.layerControlPopup) {
      this.layerControlPopup = null;
    }
  }

  /**
   * 获取地图中心点坐标
   * @returns {number[]} 返回 [lon, lat] 格式的坐标
   */
  getCenter() {
    const view = this.map.getView();
    const center = view.getCenter();
    if (center) {
      // 将坐标从 EPSG:3857 转换为 EPSG:4326
      return transform(center, 'EPSG:3857', 'EPSG:4326');
    }
    return [0, 0];
  }

  /**
   * 将地图定位到指定中心点
   * @param {number[]} coordinate - [lon, lat] 格式的坐标
   * @param {number} [zoom] - 可选的缩放级别
   * @param {boolean} [animate=true] - 是否开启动画过渡
   */
  centerAt(coordinate: number[], zoom?: number, duration = 500) {
    const view = this.map.getView();
    const center = coordinate[0].toFixed(0).length > 3 ? coordinate : fromLonLat(coordinate);
    // const center = coordinate;

    if (duration) {
      // 使用动画过渡
      if (zoom !== undefined) {
        view.animate({
          center: center,
          zoom: zoom,
          duration
        });
      } else {
        view.animate({
          center: center,
          duration
        });
      }
    } else {
      // 直接设置，不使用动画
      view.setCenter(center);
      if (zoom !== undefined) {
        view.setZoom(zoom);
      }
    }
  }

  protected startMeasure(type: 'LineString' | 'Polygon') {
    // 如果当前正在测量，且测量类型相同，则停止测量并清空结果
    if (this.measuring && this.currentMeasureType === type) {
      this.stopMeasure();
      return;  // 直接返回，不开始新的测量
    }

    // 如果正在测量但类型不同，或者没有在测量，则开始新的测量
    if (this.measuring) {
      this.stopMeasure();
    }

    this.measuring = true;
    this.currentMeasureType = type;  // 设置当前测量类型

    // 生成新的测量 ID
    this.currentMeasureId = `measure_${Date.now()}`;
    const textId = `${this.currentMeasureId}_text`;
    const featureId = `${this.currentMeasureId}_feature`;

    // 存储 ID 关系
    this.measureIdMap.set(this.currentMeasureId, {
      textId,
      featureId
    });

    const drawInteraction = new Draw({
      source: this.measureSource,
      type: type,
      style: new Style({
        fill: new Fill({
          color: 'rgba(0, 153, 255, 0.1)'  // 更透明的填充
        }),
        stroke: new Stroke({
          color: '#0099ff',
          width: 2,
          lineDash: [5, 5]  // 虚线
        }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: '#0099ff'
          })
        })
      })
    });

    this.map.addInteraction(drawInteraction);

    let listener: any;
    drawInteraction.on('drawstart', (evt) => {
      this.sketch = evt.feature;
      if (this.currentMeasureId) {
        const ids = this.measureIdMap.get(this.currentMeasureId);
        this.sketch.setId(ids?.featureId); // 设置绘制要素的 ID
      }

      listener = this.sketch.getGeometry()?.on('change', (e: any) => {
        const geom = e.target;
        let output = '';
        let position: number[] = [];

        if (type === 'LineString') {
          const length = getLength(geom);
          output = length > 1000 ?
            `${(length / 1000).toFixed(2)} km` :
            `${length.toFixed(2)} m`;
          position = geom.getLastCoordinate();
        } else {
          const area = getArea(geom);
          output = area > 1000000 ?
            `${(area / 1000000).toFixed(2)} km²` :
            `${area.toFixed(2)} m²`;
          position = geom.getInteriorPoint().getCoordinates();
        }

        if (this.currentMeasureId) {
          const ids = this.measureIdMap.get(this.currentMeasureId);
          // 清除当前测量的临时文本
          this.display.clearFeatureById(ids?.textId || '');

          // 显示新的测量结果
          this.display.text(transform(position, 'EPSG:3857', 'EPSG:4326'), {
            id: ids?.textId,
            content: output,
            style: {
              fontSize: 12,
              color: '#fff',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              offsetY: -15
            }
          });
        }
      });
    });

    drawInteraction.on('drawend', (evt) => {
      if (this.sketch) {
        this.sketch.un('change', listener);
        // 开始新的测量，生成新的 ID
        this.currentMeasureId = `measure_${Date.now()}`;
        const newTextId = `${this.currentMeasureId}_text`;
        const newFeatureId = `${this.currentMeasureId}_feature`;
        this.measureIdMap.set(this.currentMeasureId, {
          textId: newTextId,
          featureId: newFeatureId
        });
      }
      this.sketch = null;
    });
  }

  stopMeasure() {
    if (this.measuring) {
      const drawInteractions = this.map.getInteractions().getArray()
        .filter(interaction => interaction instanceof Draw);

      // 移除所有绘制交互
      drawInteractions.forEach(interaction => {
        this.map.removeInteraction(interaction);
      });

      this.measuring = false;
      this.currentMeasureId = null;
      this.currentMeasureType = null;  // 重置测量类型
      this.sketch = null;
      this.clearMeasure();
    }
  }

  // 添加两个公共方法用于开始测量
  startLineMeasure() {
    this.startMeasure('LineString');
  }

  startAreaMeasure() {
    this.startMeasure('Polygon');
  }

  // 清除所有测量结果
  clearMeasure() {
    this.measureSource.clear();
    // 清除所有测量相关的文本
    this.measureIdMap.forEach(ids => {
      this.display.clearFeatureById(ids.textId);
      this.display.clearFeatureById(ids.featureId);
    });
    this.measureIdMap.clear();
    this.currentMeasureId = null;
  }

  zoomIn() {
    const view = this.map.getView();
    const zoom = view.getZoom();
    if (zoom !== undefined) {
      view.animate({
        zoom: zoom + 1,
        duration: 250
      });
    }
  }

  zoomOut() {
    const view = this.map.getView();
    const zoom = view.getZoom();
    if (zoom !== undefined) {
      view.animate({
        zoom: zoom - 1,
        duration: 250
      });
    }
  }

  reset() {
    if (this.initialCenter && this.initialZoom) {
      this.centerAt(this.initialCenter, this.initialZoom);
    }
  }

  private initLayerControlPopup() {
    if (this.layerControlPopup) return;

    // 创建图层控制弹出框
    this.layerControlPopup = document.createElement('div');
    this.layerControlPopup.className = 'ol-layer-control-popup';
    this.layerControlPopup.style.cssText = `
      position: absolute;
      right: 40px;
      top: -30px;
      background: rgba(255,255,255,.8);
      padding: 8px 12px;
      border-radius: 4px;
      box-shadow: 0px 7px 30px 0px rgba(100, 100, 111, 0.2);
      min-width: 120px;
      width: fit-content;
      min-height: 0px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 9999;
      display: none;
      font-size: 14px;
      color: #333;
    `;

    // 添加点击事件阻止冒泡
    this.layerControlPopup.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 添加全局点击事件来关闭弹出框
    document.addEventListener('click', (e) => {
      if (this.layerControlVisible && this.layerControlPopup && !this.layerControlPopup.contains(e.target as Node)) {
        this.hideLayerControl();
      }
    });
  }

  private showLayerControl(button: HTMLElement) {
    if (!this.layerControlPopup) {
      this.initLayerControlPopup();
    }

    // 如果已经显示，则隐藏
    if (this.layerControlVisible) {
      this.hideLayerControl();
      return;
    }

    // 显示弹出框
    this.layerControlVisible = true;
    this.layerControlPopup!.style.display = 'block';
    button.appendChild(this.layerControlPopup!);
    this.renderLayerList();
  }

  private hideLayerControl() {
    if (this.layerControlPopup) {
      this.layerControlPopup.style.display = 'none';
      this.layerControlVisible = false;
    }
  }

  private renderLayerList() {
    if (!this.layerControlPopup) return;

    // 清空现有内容
    this.layerControlPopup.innerHTML = '';

    // 获取所有图层
    const layers = this.map.getLayers().getArray();

    layers.forEach(layer => {
      const id = layer.get('id');
      const title = layer.get('title') || id;
      const visible = layer.getVisible();

      if (!id) return;

      // 创建图层项容器
      const itemDiv = document.createElement('div');
      itemDiv.style.cssText = 'margin-bottom: 8px; display:flex;';

      // 创建复选框
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = visible;
      checkbox.style.marginLeft = '8px';
      checkbox.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        layer.setVisible(target.checked);
      });

      // 创建标签
      const label = document.createElement('label');
      label.textContent = title;
      label.style.cursor = 'pointer';
      // label.appendChild(checkbox);
      label.addEventListener('click', (e) => {
        const visible = !layer.getVisible();
        layer.setVisible(visible);
        checkbox.checked = visible;
      });
      itemDiv.appendChild(label);
      itemDiv.appendChild(checkbox);
      this.layerControlPopup?.appendChild(itemDiv);
    });
  }
} 