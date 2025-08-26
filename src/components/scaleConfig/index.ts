
import { Config } from './lib';
import { _merge } from './merge-utils';


let defaultConfig: Config = {
  // 地图配置
  map: {
    cors: 'gcj02'
  },
  // 字体和页面缩放配置,默认缩放为1倍
  fontSizeScale: 1,
  sizeScale: 1,
  // echarts 字体和模块大小缩放配置， 默认缩放为1倍
  echarts: {
    fontSizeScale: 1,
    sizeScale: 1,
    theme: ''
  }
}

let _defaultConfig: Config = defaultConfig;

/**
 * 设置配置,在外边调用setConfig 函数传入配置,会合并到默认配置中
 * 以达到修改fontSizeScale 和 sizeScale 缩放比例的目的
 * 同时也会修改echarts 字体和模块大小缩放比例
 * 最终在业务代码中读取_defaultConfig 配置，就能根据页面缩放动态的读取fontSizeScale 和 sizeScale 缩放比例
 * @param config 
 */
export function setConfig(config: Config) {
  _defaultConfig = _merge(defaultConfig, _defaultConfig, config);
}

/**
 * 把值按照配置的缩放倍数进行缩放
 * 例如：配置的sizeScale为2时
 * scale(12) 24
 * scale('12') '24'
 * scale('12px') '24px'
 * scale([12, '12', '12px']) [24, '24', '24px']
 * @param value 待缩放的值，支持数字、字符串 和 数字或字符串数组
 */
export function scale(value: number | string | (number | string)[]) {
  const _fontScale = _defaultConfig.sizeScale;

  // 处理单个缩放的值
  function _scaleOneValue(value: number | string) {
    // 数字
    if (typeof value === 'number') {
      return value * _fontScale;
    }

    // 字符串，但是里面还是数字
    if (!isNaN(Number(value)) && value.trim() !== '') {
      return _fontScale * Number(value) + '';
    }

    // 字符串，但是里面包含单位, 比如 '12px'
    if (typeof value === 'string') {
      // 用parseFloat 解析字符串中的数字,'12px' 会解析为 12
      const num = parseFloat(value);
      // 拿到数字后面的字符串单位,比如 'px'
      let unit = value.replace(num + '', '');
      if (Number.isNaN(num)) {
        return Number.NaN;
      }
      return _fontScale * num + unit;
    }

    return Number.NaN;
  };

  // 数组
  if (Array.isArray(value)) {
    return value.map(item => {
      return _scaleOneValue(item);
    });
  }

  return _scaleOneValue(value);
}

// 导出默认配置
export default _defaultConfig;





