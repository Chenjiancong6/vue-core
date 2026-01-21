import { ref, shallowRef, onBeforeUnmount, watch, onUnmounted } from "vue";
import ResizeObserver from "@cjc/dom-resize-observer";
import { get, merge, debounce } from "lodash-es";
import { getMapboxgl } from "./load-script";
import baosheConfig from "@cjc/scaleConfig";
// import { useTheme } from "@cjc/vue3-hooks";
import { flattern } from "./util";

const MapTileLayerId: string = "__tileLayer";

export default function ({ option, beforeLoadAction, externalLib }) {
  const map = shallowRef();
  const isMapReady = ref(false);
  // const { theme, themeMapboxgl } = useTheme();
  const themeMapboxgl = ref(null);

  // 原始的地图移动图层方法
  let _sourceMoveLayer = null;
  let _sourceAddLayer = null;
  let _sourceRemoveLayer = null;

  const businessLayerIdList = [];

  const defaultMapOption = {
    center: [114.20631, 22.64317],
    zoom: 11,
    style: {
      version: 8,
      sources: {},
      layers: [],
    },
    pitch: 45,
    tileOpacity: 1,
    loadTile: true,
    tileUrl: [
      `${location.protocol}//webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}`,
      `${location.protocol}//webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}`,
      `${location.protocol}//webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}`,
      `${location.protocol}//webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}`,
    ],
    localIdeographFontFamily: "'宋体', '楷体', '微软雅黑'",
  };

  // 全局的地图配置项
  const globalMapOption = get(baosheConfig, "map.mapboxglOption");

  const finalMapOption = merge(defaultMapOption, globalMapOption, option);

  const initMap = async (dom?: HTMLDivElement) => {
    ResizeObserver.resizeObserver(dom, resizeMap);
    onBeforeUnmount(() => {
      ResizeObserver.unobserve(dom);
    });

    onBeforeUnmount(() => {
      if (map.value.getLayer(MapTileLayerId)) {
        map.value.removeLayer(MapTileLayerId);
      }
    });

    if (!externalLib) {
      await getMapboxgl();
    }

    map.value = new mapboxgl.Map({
      container: dom,
      ...finalMapOption,
    });

    // 重载addLayer方法
    // 记录图层的id到业务图层id列表中
    _sourceAddLayer = map.value.addLayer.bind(map.value);
    map.value.addLayer = (layer, beforeId) => {
      if (beforeId) {
        let beforeIndex = businessLayerIdList.indexOf(beforeId);
        businessLayerIdList.splice(beforeIndex, 0, layer.id);
      } else {
        businessLayerIdList.push(layer.id);
      }
      _sourceAddLayer(layer, beforeId);
    };

    // 重载moveLayer方法
    // 修改业务图层id列表中2个id的位置
    _sourceMoveLayer = map.value.moveLayer.bind(map.value);
    map.value.moveLayer = (id, beforeId) => {
      let idIndex = businessLayerIdList.indexOf(id);
      businessLayerIdList.splice(idIndex, 1);
      let beforeIdInedx = businessLayerIdList.indexOf(beforeId);
      businessLayerIdList.splice(beforeIdInedx, 0, id);
      _sourceMoveLayer(id, beforeId);
    };

    // 重载removeLayer方法
    _sourceRemoveLayer = map.value.removeLayer.bind(map.value);
    map.value.removeLayer = (id) => {
      let beforeIndex = businessLayerIdList.indexOf(id);
      businessLayerIdList.splice(beforeIndex, 1);
      _sourceRemoveLayer(id);
    };

    beforeLoadAction && beforeLoadAction(map.value);

    map.value.on("load", mapReady);

    onUnmounted(() => {
      if (map.value) {
        map.value.remove();
      }
    })
  };

  const mapReady = () => {
    // 加载底图
    // 如果存在主题配置，则按照主题的配置去加载
    // if (themeMapboxgl.value) {
    //   resetMapStyleOrTileWithTheme();
    // }
    // 如果不存在主题配置，则看是否要加载tileLayer，是的话则去加载
    // else {
      const { loadTile, tileUrl, tileOpacity, tilePaint } = finalMapOption;

      if (loadTile) {
        let tiles = tileUrl;
        if (typeof tileUrl === "string") {
          tiles = [tileUrl];
        }
        _sourceAddLayer({
          id: MapTileLayerId,
          type: "raster",
          source: {
            type: "raster",
            tiles,
            tileSize: 256,
          },
          paint: {
            "raster-opacity": tileOpacity,
            ...tilePaint
          },
        });
      }
      isMapReady.value = true;
    // }
  };

  const resetMapStyleOrTileWithTheme = () => {
    if (map.value.getLayer(MapTileLayerId)) {
      _sourceRemoveLayer(MapTileLayerId);
      map.value.removeSource(MapTileLayerId);
    }

    const { style, tileLayer } = themeMapboxgl.value;
    // 如果设置主题用的是style，则移除__tileLayer
    // 该style的实现存在问题，因为一旦setStyle，会把业务的图层也全部删除掉
    if (style) {
      map.value.setStyle(style);
      // 等style加载完成后，获取style，把它的layer都设置在业务添加的layer之前
      const checkStyleLoaded = () => {
        const styleLoaded = map.value.isStyleLoaded();
        if (!styleLoaded) {
          requestAnimationFrame(checkStyleLoaded);
          return;
        }

        isMapReady.value = true;

        let styleJson = map.value.getStyle();
        for (let businessLayerId of businessLayerIdList) {
          for (let styleLayer of styleJson.layers) {
            _sourceMoveLayer(businessLayerId, styleLayer.id);
          }
        }
      };
      checkStyleLoaded();
    } else if (tileLayer) {
      _sourceAddLayer({
        id: MapTileLayerId,
        ...tileLayer,
      });

      // 主题变化时，把所有的业务图层，按照顺序都移到底图的前面去
      for (let businessLayerId of businessLayerIdList) {
        _sourceMoveLayer(businessLayerId);
      }

      isMapReady.value = true;
    }
  };

  // watch(theme, () => {
  //   resetMapStyleOrTileWithTheme();
  // });

  const resizeMap = debounce(() => {
    map.value?.resize();
  }, 100);

  const fitBounds = (bounds, options, eventData) => {
    options = {
      padding: 10,
      bearing: map.value.getBearing(),
      pitch: map.value.getPitch(),
      // maxZoom: 14,
      ...options,
    };

    if (bounds.geometry) {
      bounds = {
        features: [
          bounds
        ]
      }
    }

    if (bounds.features) {
      var realBounds = [];
      bounds.features.forEach(function (feature) {
        let flatternBounds = flattern(feature.geometry.coordinates);
        realBounds = [...realBounds, ...flatternBounds];
      });
      if (realBounds.length < 2) {
        return;
      }
      var finalBounds = realBounds.reduce(function (bounds, coord) {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(realBounds[0], realBounds[0]));

      map.value.fitBounds(finalBounds, options, eventData);
    }
    if (Array.isArray(bounds)) {
      let realBounds = bounds.reduce(function (bounds, coord) {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(bounds[0], bounds[0]));

      map.value.fitBounds(realBounds, options, eventData);
    }
  };

  return {
    map,
    initMap,
    isMapReady,
    fitBounds,
  };
}
