import { Feature, Map, View } from "ol";
import { fromLonLat, transform } from "ol/proj";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Icon, Stroke } from "ol/style";
import { getDistance } from "ol/sphere";

class TrajectoryAnimation {
  constructor(options) {
    this.options = options;
    this.path = options.path.map((p) => fromLonLat(p)); // 转换为地图坐标（EPSG:3857）
    this.speed = options.speed || 5; // 单位：米/秒（需根据实际地理距离计算）
    this.iconUrl = options.iconUrl;
    this.repeat = options.repeat || false;

    // 初始化要素和图层
    this.feature = new Feature({
      geometry: new Point(this.path[0]),
    });
    this.source = new VectorSource({ features: [this.feature] });
    this.layer = new VectorLayer({ source: this.source });

    // 动画状态
    this.currentIndex = 0;
    this.animationId = null;
    this.startTime = null;
    this.isRunning = false;
    this.segmentDistance = 0; // 当前段的地理距离（米）
    this.segmentDuration = 0; // 当前段需要的总时间（毫秒）

    this.setIconStyle();

    // 初始化轨迹要素（新增）
    this.trajectoryLayer = new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            geometry: new LineString(this.path),
            name: "animation-trajectory", // 添加标识属性
          }),
        ],
      }),
      style: new Style({
        stroke: new Stroke({
          color: options.trajectoryColor || "#FF5722",
          width: options.trajectoryWidth || 3,
        }),
      }),
    });
    this.trajectoryLayer.set("id", "track_polyline");
    this.trajectoryLayer.setZIndex(9);
  }

  // 新增自动缩放方法
  zoomToTrajectory(padding = [100, 100, 100, 100]) {
    const extent = this.trajectoryLayer
      .getSource()
      .getFeatures()
      .find((f) => f.get("name") === "animation-trajectory")
      .getGeometry()
      .getExtent();

    window.map.getView().fit(extent, {
      padding: padding,
      duration: 1000, // 1秒缩放动画
    });
  }

  // 设置图标样式
  setIconStyle(rotation = 0) {
    this.feature.setStyle(
      new Style({
        image: new Icon({
          src: this.iconUrl,
          // scale: 0.5,
          width: 50,
          height: 50,
          rotateWithView: true,
          rotation: -rotation, // 修正角度方向
        }),
      })
    );
  }

  // 计算两点之间的角度（弧度）
  getAngle(start, end) {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    return Math.atan2(dy, dx);
  }

  // 初始化当前段数据
  initSegment() {
    const start = this.path[this.currentIndex];
    const end = this.path[this.currentIndex + 1];

    // 计算地理距离（单位：米）
    this.segmentDistance = getDistance(
      transform(start, "EPSG:3857", "EPSG:4326"),
      transform(end, "EPSG:3857", "EPSG:4326")
    );

    // 计算该段需要的总时间（毫秒）
    this.segmentDuration = (this.segmentDistance / this.speed) * 1000;
    this.startTime = Date.now();
  }

  start() {
    if (this.isRunning || this.path.length < 2) return;
    // 自动缩放到轨迹范围（新增）
    window.map.addLayer(this.trajectoryLayer);
    this.zoomToTrajectory();
    this.isRunning = true;
    this.currentIndex = 0;
    this.initSegment();
    this.animate();
  }

  animate() {
    if (!this.isRunning) return;

    const elapsed = Date.now() - this.startTime;
    let ratio = elapsed / this.segmentDuration;

    // 限制比例不超过1
    if (ratio >= 1) ratio = 1;

    // 计算当前点
    const start = this.path[this.currentIndex];
    const end = this.path[this.currentIndex + 1];
    const x = start[0] + (end[0] - start[0]) * ratio;
    const y = start[1] + (end[1] - start[1]) * ratio;

    // 更新位置和角度
    this.feature.getGeometry().setCoordinates([x, y]);
    const angle = this.getAngle(start, end);
    this.setIconStyle(angle);

    // 判断当前段是否完成
    if (ratio >= 1) {
      this.currentIndex++;

      // 是否循环或结束
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

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

export default TrajectoryAnimation;
