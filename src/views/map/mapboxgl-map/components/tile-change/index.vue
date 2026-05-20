<template>
  <el-popover placement="left" width="auto">
    <template #reference>
      <MapCtrlIcon :data="mapCtrlData">
      </MapCtrlIcon>
    </template>
    <div class="map-tile-change">
      <div v-for="item in tileConfig" :key="item.id" class="map-tile-change-item clickable"
        :class="{ 'active': currentTile == item.id }" @click="handleChangeTile(item)">
        <img :src="item.img" class="map-tile-change__img"/>
        <div class="map-tile-change__label">
          {{ item.label }}
        </div>
      </div>
    </div>
  </el-popover>

</template>

<script lang="ts" setup>
import MapCtrlIcon from '../map-ctrl-icon/index.vue';
import { inject, PropType, reactive, ref, Ref } from 'vue';

const emits = defineEmits(['change-tile']);

export type TileType = 'vector' | 'image';

const props = defineProps({
  defaultTile: {
    type: String as PropType<TileType>,
    default: 'vector'
  }
})

const { map }: any = inject('mapObj');

const currentTile = ref<TileType>(props.defaultTile);

const mapCtrlData = reactive([{
  action: 'changeTile',
  label: '',
  icon: 'change-map-tile-icon'
}])

interface TileConfigItem {
  id: TileType,
  img: any,
  label: string
}

const tileConfig = ref<TileConfigItem[]>([{
  id: 'vector',
  img: new URL('./images/tile-vector.jpg', import.meta.url).href,
  label: '矢量瓦片地图'
}, {
  id: 'image',
  img: new URL('./images/tile-image.jpg', import.meta.url).href,
  label: '天地图影像地图'
}])

const handleChangeTile = (tileConfigItem: TileConfigItem) => {
  if (currentTile.value == tileConfigItem.id) {
    return ;
  }
  currentTile.value = tileConfigItem.id;
  emits('change-tile', tileConfigItem.id);
}

</script>

<style lang="less" scoped>
.map-tile-change {
  display: flex;
  align-items: center;
  gap: 10px;
}
.map-tile-change-item {
  position: relative;
  border: 2px solid transparent;
  &.active {
    border-color: var(--el-color-primary);
    .map-tile-change__label {
      background: var(--el-color-primary);
    }
  }
}
.map-tile-change__img {
  display: block;
  width: 120px;
}
.map-tile-change__label {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  line-height: 24px;
  font-size: 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
  text-align: center;
}
</style>