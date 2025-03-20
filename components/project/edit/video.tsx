import { Button, Upload } from "antd";
import styles from "./video.module.scss";
import { PlayCircleOutlined } from "@ant-design/icons";

const imgs = [
  "IMG_20230321_093451",
  "IMG_20230321_130353",
  "IMG_20230321_130358",
  "IMG_20230321_134641",
  "IMG_20230321_134705",
  "IMG_20230321_141012",
  "IMG_20230321_141019",
  "IMG_20230321_141024",
  "IMG_20230321_141041",
  "IMG_20230321_141110",
];

const ProjectVideo = () => {
  return (
    <div className={styles.videoContainer}>
      <div className={styles.header}>
        <div className={styles.title}>视频（共10条）</div>
        <div className={styles.action}>
          <span className={styles.tip}>大小不超过100M</span>
          <Upload accept=".mp4,.avi">
            <Button type="primary">上传</Button>
          </Upload>
        </div>
      </div>
      <div className={styles.content}>
        {imgs.map((img) => {
          return (
            <div className={styles.video} key={img}>
              <img src={`/index/project/${img}.jpg`} alt="" />
              <PlayCircleOutlined className={styles.playBtn} />
              <div className={styles.duration}>22分钟</div>
              <div className={styles.videoName}>{img}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectVideo;
