type MapCoors = 'gcj02' | 'wgs84' | 'bd09';

declare interface MapConfig {
  cors: MapCoors;
}

declare interface EchartsConfig {
  fontSizeScale?: number;
  sizeScale?: number;
  theme?: string;
}

export declare interface Config {
  map: MapConfig;
  echarts?: EchartsConfig;
  fontSizeScale?: number;
  sizeScale?: number;
}

export declare function setConfig(newConfig: Config): void;

declare const _default: Config;

export default _default;