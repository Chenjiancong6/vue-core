<template>
  <div class="">

  </div>
</template>

<script setup>
import { inject, onMounted, onUnmounted } from "vue";

const { map } = inject("mapObj");

onMounted(() => {
  // console.log(map, "11111111")
})
var marker = new AMap.Marker({
  position: new AMap.LngLat(114.0566674, 22.5372753),
  icon: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
  anchor: 'bottom-center',
  title: '我是自定义标题',
  label: {
    offset: new AMap.Pixel(0, 0), //设置文本标注偏移量
    content: "<div class='info'>我是自定义文本标注</div>", //设置文本标注内容
  }
});
map.add(marker);

// 文本标记
var text = new AMap.Text({
  position: new AMap.LngLat(114.0329847, 22.542456),
  anchor: 'bottom-center',
  text: '我是文本标记',
  // style: {
  //   'background-color': 'red',
  //   'border-radius': '50%',
  //   'color': '#fff',
  //   'font-size': '12px',
  //   'padding': '5px',
  //   'text-align': 'center'
  // },
  // style: { 'background-color': 'red' },
});
map.add(text);


// 创建一个 LabelMarker 实例
var labelMarker = new AMap.LabelMarker({
  position: [114.0058741, 22.5427438],
  opacity: 1,
  zIndex: 2,
  // icon: {
  //   image: 'https://a.amap.com/jsapi_demos/static/images/poi-marker.png',
  //   anchor: 'bottom-center',
  //   size: [25, 34],
  //   clipOrigin: [459, 92],
  //   clipSize: [50, 68]
  // },
  text: {
    content: '香猪坊',
    direction: 'right',
    style: {
      fontSize: 15,
      fillColor: '#fff',
      strokeColor: 'rgba(255,0,0,0.5)',
      strokeWidth: 2,
      padding: [3, 10],
      backgroundColor: 'yellow',
      borderColor: '#ccc',
      borderWidth: 3,
    }
  }
});
// 创建一个 LabelsLayer 实例来承载 LabelMarker，[LabelsLayer 文档](https://lbs.amap.com/api/jsapi-v2/documentation#labelslayer)
var labelsLayer = new AMap.LabelsLayer({
  collision: true,
});
// 将 LabelMarker 实例添加到 LabelsLayer 上
labelsLayer.add(labelMarker);
// 将 LabelsLayer 添加到地图上
map.add(labelsLayer);

// 创建矢量图层
var vectorLayer = new AMap.VectorLayer();

// 将矢量图层添加到地图
map.add(vectorLayer);

// GeoJSON 数据
var geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [116.397428, 39.90923]
      },
      "properties": {
        "name": "北京"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [116.407428, 39.91923]
      },
      "properties": {
        "name": "天安门"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [116.417428, 39.92923]
      },
      "properties": {
        "name": "故宫"
      }
    }
  ]
};

// 加载 GeoJSON 数据
var geoJSON = new AMap.GeoJSON({
  geoJSON: geojsonData, // GeoJSON 数据
  getMarker: function (feature) {
    // 根据 GeoJSON 的 properties 生成文本标识
    var marker = new AMap.Marker({
      position: feature.geometry.coordinates,
      content: `<div style="background: #fff; padding: 5px; border: 1px solid #000; border-radius: 3px;">${feature.properties.name}</div>`,
      offset: new AMap.Pixel(-15, -15), // 偏移量，使文本居中
    });
    return marker;
  },
});

// 将 GeoJSON 数据添加到地图
map.add(geoJSON);

fetch('https://a.amap.com/jsapi_demos/static/geojson/chongqing.json').then(response => response.json()).then(geoJSON => {

  var geojson = new AMap.GeoJSON({
    geoJSON: geoJSON,
    // 还可以自定义getMarker和getPolyline
    getPolygon: function (geojson, lnglats) {
      // 计算面积
      var area = AMap.GeometryUtil.ringArea(lnglats[0])

      return new AMap.Polygon({
        path: lnglats,
        fillOpacity: 1 - Math.sqrt(area / 8000000000),// 面积越大透明度越高
        strokeColor: 'white',
        fillColor: 'red'
      });
    }
  });
  map.add(geojson);
  console.log('GeoJSON 数据加载完成')


})


</script>

<style lang="less" scoped></style>
