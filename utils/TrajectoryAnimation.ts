import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat, transform } from 'ol/proj';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon, Stroke } from 'ol/style';
import { getDistance } from 'ol/sphere';
import { Geometry } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import { FeatureLike } from 'ol/Feature';

// 定义配置项接口
interface TrajectoryAnimationOptions {
  path: Coordinate[];              // 轨迹点数组（经纬度坐标）
  speed?: number;                  // 移动速度（米/秒）
  iconUrl: string;                 // 图标URL
  repeat?: boolean;                // 是否循环
  trajectoryColor?: string;        // 轨迹线颜色
  trajectoryWidth?: number;        // 轨迹线宽度
}

class TrajectoryAnimation {
  private options: TrajectoryAnimationOptions;
  private path: Coordinate[];      // 存储转换后的地图坐标（EPSG:3857）
  private speed: number;
  private iconUrl: string;
  private repeat: boolean;

  // OpenLayers 对象
  private feature: Feature<Point>;
  private source: VectorSource;
  private layer: VectorLayer<VectorSource>;
  private trajectoryLayer: VectorLayer<VectorSource>;

  // 动画状态
  private currentIndex: number = 0;
  private animationId: number | null = null;
  private startTime: number | null = null;
  private isRunning: boolean = false;
  private segmentDistance: number = 0;     // 当前段地理距离（米）
  private segmentDuration: number = 0;     // 当前段持续时间（毫秒）

  constructor(options: TrajectoryAnimationOptions) {
    this.options = options;
    this.path = options.path.map(p => fromLonLat(p));
    this.speed = options.speed || 5;
    this.iconUrl = options.iconUrl;
    this.repeat = options.repeat || false;

    // 初始化移动要素
    this.feature = new Feature<Point>({
      geometry: new Point(this.path[0])
    });
    this.source = new VectorSource({ features: [this.feature] });
    this.layer = new VectorLayer({ source: this.source });
    this.layer.set("id", "track");
    this.layer.setZIndex(9);
    // 初始化轨迹图层
    this.trajectoryLayer = new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature<LineString>({
            geometry: new LineString(this.path),
            name: "animation-trajectory"
          })
        ]
      }),
      style: new Style({
        stroke: new Stroke({
          color: options.trajectoryColor || "#FF5722",
          width: options.trajectoryWidth || 3
        })
      })
    });
    this.trajectoryLayer.set("id", "track_polyline");
    this.trajectoryLayer.setZIndex(9);
  }

  // 自动缩放到轨迹范围
  public zoomToTrajectory(padding: number[] = [100, 100, 100, 100]): void {
    // const extent = (this.trajectoryLayer.getSource()!
    //   .getFeatures()
    //   .find(f => f.get("name") === "animation-trajectory")!
    //   .getGeometry() as VectorSource)
    //   .getExtent();

    const extent = this.trajectoryLayer.getSource()!
      .getExtent();

    // 假设 map 已挂载到 window 对象
    (window as any).map.getView().fit(extent, {
      padding,
      duration: 1000
    });
  }

  // 设置图标样式
  private setIconStyle(rotation = 180): void {
    this.feature.setStyle(new Style({
      image: new Icon({
        src: this.iconUrl,
        width: 50,
        height: 50,
        rotateWithView: true,
        // rotation: -rotation
      })
    }));
  }

  // 计算两点之间的弧度角
  private getAngle(start: Coordinate, end: Coordinate): number {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    return Math.atan2(dy, dx);
  }

  // 初始化当前段参数
  private initSegment(): void {
    const start = this.path[this.currentIndex];
    const end = this.path[this.currentIndex + 1];

    // 计算地理距离（单位：米）
    this.segmentDistance = getDistance(
      transform(start, 'EPSG:3857', 'EPSG:4326'),
      transform(end, 'EPSG:3857', 'EPSG:4326')
    );

    // 计算持续时间（毫秒）
    this.segmentDuration = (this.segmentDistance / this.speed) * 1000;
    this.startTime = Date.now();
  }

  // 启动动画
  public start(): void {
    if (this.isRunning || this.path.length < 2) return;

    // 添加轨迹图层并缩放
    (window as any).map.addLayer(this.trajectoryLayer);
    (window as any).map.addLayer(this.layer);
    this.zoomToTrajectory();

    this.isRunning = true;
    this.currentIndex = 0;
    this.initSegment();
    this.animate();
  }

  // 动画循环
  private animate(): void {
    if (!this.isRunning) return;

    const elapsed = Date.now() - (this.startTime!);
    let ratio = elapsed / this.segmentDuration;
    ratio = Math.min(ratio, 1);

    // 计算当前位置
    const start = this.path[this.currentIndex];
    const end = this.path[this.currentIndex + 1];
    const x = start[0] + (end[0] - start[0]) * ratio;
    const y = start[1] + (end[1] - start[1]) * ratio;

    // 更新要素位置和方向
    this.feature.getGeometry()!.setCoordinates([x, y]);
    this.setIconStyle(this.getAngle(start, end));

    // 判断段是否完成
    if (ratio >= 1) {
      this.currentIndex++;

      if (this.currentIndex >= this.path.length - 1) {
        if (this.repeat) {
          this.currentIndex = 0;
          this.initSegment();
        } else {
          this.stop();
          return;
        }
      } else {
        this.initSegment();
      }
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  // 停止动画
  public stop(): void {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

export default TrajectoryAnimation;