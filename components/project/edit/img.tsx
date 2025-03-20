import { Button, Upload } from "antd";
import styles from "./img.module.scss";

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

const ProjectImg = () => {
  return (
    <div className={styles.imgContainer}>
      <div className={styles.header}>
        <div className={styles.title}>图片（共10张）</div>
        <div className={styles.action}>
          <span className={styles.tip}>大小不超过10M，已开启图片水印</span>
          <Upload accept=".jpg,.jpeg,.png,.webp,.gif">
            <Button type="primary">上传</Button>
          </Upload>
        </div>
      </div>
      <div className={styles.content}>
        {imgs.map((img) => {
          return (
            <div className={styles.img} key={img}>
              <img src={`/index/project/${img}.jpg`} alt="" />
              <div className={styles.imgName}>{img}.jpg</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectImg;
