### 使用前注意

mapbox-gl库按照静态全量引入的方式

#### [#](https://www.szbadg.com:8000/dev-center/components/frontend/vue3/map/baoshe-vue3-basemap-mapboxgl.html#vite%E5%B7%A5%E7%A8%8B%E7%9A%84%E5%A2%9E%E5%8A%A0%E5%A6%82%E4%B8%8B%E9%85%8D%E7%BD%AE-%E5%A6%82%E6%9E%9C%E5%B7%B2%E7%BB%8F%E5%AD%98%E5%9C%A8%E5%88%99%E5%BF%BD%E7%95%A5)vite工程的增加如下配置，如果已经存在则忽略

```bash
pnpm i @cjc/vite-plugin-lib-static-import -D
```

```js
import vitePluginLibStaticImport from "@cjc/vite-plugin-lib-static-import";

export default defineConfig({
    plugins: [
        vitePluginLibStaticImport()
    ]
})
```

### [#](https://www.szbadg.com:8000/dev-center/components/frontend/vue3/map/baoshe-vue3-basemap-mapboxgl.html#%E7%BB%84%E4%BB%B6%E4%BE%9D%E8%B5%96)组件依赖

mapbox-gl 1.x [查看mapbox-gl官方文档(opens new window)](https://docs.mapbox.com/mapbox-gl-js/api/)

### [#](https://www.szbadg.com:8000/dev-center/components/frontend/vue3/map/baoshe-vue3-basemap-mapboxgl.html#%E7%BB%84%E4%BB%B6%E5%AE%89%E8%A3%85)组件安装

```bash
pnpm add @cjc/vue3-basemap-mapboxgl
```

### [#](https://www.szbadg.com:8000/dev-center/components/frontend/vue3/map/baoshe-vue3-basemap-mapboxgl.html#%E7%BB%84%E4%BB%B6props)组件props


| 名称             | 类型     | 默认值                                                                                                                                                                                                             | 说明                                                                                         |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| option           | Object   | {**center**: [110.38822, 21.20464],**zoom**: 11,**pitch**: 45,**tileOpacity**: 1,**loadTile**: true,**tileUrl**: "http://webrd01.is.autonavi.com/appmaptile?lang=zh\_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"} | 地图的基础配置信息                                                                           |
| beforeLoadAction | Function | null                                                                                                                                                                                                               | 允许业务在`map实例创建后`和 `load事件触发前`实现自定义操作。方法回调时传入的参数是 `map实例` |

TIP

option的进一步说明：外部传入option时，会跟默认的option进行合并，优先取外部的option的字段的值。同时把合并后的option作为new mapboxgl.Map的参数。也就是说，option还支持所有的new mapboxgl.Map的参数的其他字段。例如：option: {style: 'style://map.xxx'}

### [#](https://www.szbadg.com:8000/dev-center/components/frontend/vue3/map/baoshe-vue3-basemap-mapboxgl.html#%E7%BB%84%E4%BB%B6%E6%96%B9%E6%B3%95)组件方法


| 名称      | 参数                        | 返回值             | 说明                                                                                                                                                                                                                                                      |
| --------- | --------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getMap    | 无                          | mapbox-gl的map实例 | 用于获取mapbox-gl的map实例                                                                                                                                                                                                                                |
| loadWms   | {id: '',url: '',layers: ''} | 无                 | 加载wms                                                                                                                                                                                                                                                   |
| fitBounds | bounds, options             | 无                 | mapbox-gl本身没有提供友好的fitBounds方法，这里做了一次封装。bounds参数可以是geojson，也可以是lnglat数组。options是mapbox-gl的fitBounds方法的options，[详见mapbox-gl文档 **(opens new window)**](https://docs.mapbox.com/mapbox-gl-js/api/#map#fitbounds)] |
| getCenter | bounds                      | {lng, lat}         | 获取区域的中心经纬度，bounds是type为`polygon 或 multiPolygon`的geojson的coordinates                                                                                                                                                                       |

### [#](https://www.szbadg.com:8000/dev-center/components/frontend/vue3/map/baoshe-vue3-basemap-mapboxgl.html#%E7%BB%84%E4%BB%B6%E4%BA%8B%E4%BB%B6)组件事件


| 名称     | 参数 | 说明                                                |
| -------- | ---- | --------------------------------------------------- |
| mapReady | 无   | 地图就绪后触发，是在mapbox-gl的load事件中emit出来的 |

### [#](https://www.szbadg.com:8000/dev-center/components/frontend/vue3/map/baoshe-vue3-basemap-mapboxgl.html#%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B)使用示例

业务代码 `index.vue`的内容示例如下：

```vue
<template>
    <base-map>
        <!-- 地图就绪后才渲染组件 -->
        <test-layer />
    </base-map>
</template>

<script setup>
import BaseMap from '@cjc/vue3-basemap-mapboxgl';
import TestLayer from './components/test-layer.vue';
</script>
```

`./components/test-layer.vue`的内容示例如下：

```vue
<template>
</template>

<script setup>
import { inject } from 'vue';

// 这个map就是mapbox-gl实例
const map = inject('map');

// 这个baseMap是base-map实例
const baseMap = inject('baseMap');

// 地图聚焦
map.flyTo({
    center: [113.9542664, 22.5318036],
    zoom: 16
});

</script>
```

### [#](https://www.szbadg.com:8000/dev-center/components/frontend/vue3/map/baoshe-vue3-basemap-mapboxgl.html#%E5%9B%BE%E5%B1%82%E5%BC%80%E5%8F%91%E8%A7%84%E8%8C%83%E3%80%90%E5%BE%88%E9%87%8D%E8%A6%81%E3%80%91)图层开发规范【很重要】

为了提高地图代码的可复用性，以及提升逻辑的组织能力，地图的开发一个按照逻辑放在一个独立的组件，例如：`./components/map-layer/index.vue`，在 `base-map`组件中包含进去，例如使用地图的代码如下：

```vue
<template>
    <div>
        <base-map>
            <map-layer />
        </base-map>
    </div>
</template>

<script setup>
import BaseMap from '@cjc/vue3-basemap-mapboxgl';
import MapLayer from './components/map-layer/index.vue';
</script>
```

`./components/map-layer/index.vue`的代码示例如下：

```vue
<template>
</template>

<script setup>
import { inject } from 'vue';

const { map, baseMap } = inject('mapObj');

onMounted(() => {
    // 地图聚焦
    map.flyTo({
        center: [113.9542664, 22.5318036],
        zoom: 16
    });
});

// 在这里，使用map和baseMap去完成各种业务逻辑即可

</script>
```
