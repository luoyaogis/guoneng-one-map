import { OlMap } from '@/utils/OlMap';

declare global {
  interface Window {
    map: OlMap;
  }
}
// 声明 OpenLayers 模块类型
declare module 'ol' {
  export * from 'ol/index';
}

export {}; 