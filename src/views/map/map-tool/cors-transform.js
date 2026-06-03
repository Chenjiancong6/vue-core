import {
  bd09ToGcj02,
  gcj02ToBd09,
  gcj02ToWgs84,
  wgs84ToGcj02,
} from "@cjc/zebra";
import baosheConfig from '@cjc/scaleConfig';
import { ElMessage } from "element-plus";

// 转换函数对象
const FUNOBJ = {
  bd09_gcj02: bd09ToGcj02,
  bd09_wgs84: (lng, lat) => gcj02ToWgs84(...bd09ToGcj02(lng, lat)),
  gcj02_bd09: gcj02ToBd09,
  gcj02_wgs84: gcj02ToWgs84,
  wgs84_gcj02: wgs84ToGcj02,
  wgs84_bd09: (lng, lat) => gcj02ToBd09(...wgs84ToGcj02(lng, lat)),
};


/**
 * 把传入的经纬度，根据数据坐标系和地图坐标系进行转换，得到能在地图正确的位置显示的经纬度
 * @param {number|string} lng 经度
 * @param {number|string} lat 纬度
 * @param {string} [dataCors=gcj02] 经纬度坐标系，默认是：gcj02，可选项有：wgs84 gcj02 bd09
 * @param {string} [mapCoordinates=true] 这个参数默认是 true，逻辑： 1. 地图底图坐标系转其他坐标系为 true 2. 其他坐标系转地图底图坐标系为 false
 * @returns {array} [lng, lat] 转换后的经纬度数组
 * @example
 * const [lng, lat] = corsTransform(114.22, 22.334, 'bd09', true);
 */
export const corsTransform = (lng, lat, dataCors = "gcj02", mapCoordinates = true) => {
  lng = Number(lng);
  lat = Number(lat);
  
  let newDataCors = dataCors;
  
  // CGCS2000（中国2000国家大地坐标系）和WGS 84（世界大地测量系统）不是完全相同的坐标系，但在绝大多数日常应用中可以视为等同。
  if(dataCors === 'CGCS2000') {
    newDataCors = 'wgs84';
  }

  // 获取地图的坐标系
  const mapCors = baosheConfig.map.cors;

  // 地图坐标系和其他坐标系相同，直接返回原始经纬度坐标
  if (mapCors === newDataCors) {
    return [lng, lat];
  };

  let fun = null;
  // 地图坐标系转其他坐标系
  if(mapCoordinates) {
    fun = FUNOBJ[`${mapCors}_${newDataCors}`];
  }else {
    // 其他坐标系转地图坐标系
    fun = FUNOBJ[`${newDataCors}_${mapCors}`];
  }

  if (!fun) {
    ElMessage.error(`无法把数据从坐标系${dataCors}转换为${mapCors}`);
    return;
  }

  return fun(lng, lat);
};
