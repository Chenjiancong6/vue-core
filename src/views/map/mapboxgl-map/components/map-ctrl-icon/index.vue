<template>
  <div class="map-ctrl-item-list">
    <el-tooltip placement="right" v-for="item in data" :content="getTooltipContent(item)"
      :disabled="getTooltipDisabled(item)">
      <div class="map-ctrl-item "
        :class="{ active: item.isActive, disabled: item.isDisabled, clickable: !item.isDisabled }"
        @click="handleClickItem(item)">
        <Icon class="map-ctrl-item__icon" :icon="'svg-icon:' + item.icon" v-if="showNormalIcon(item)" />
        <Icon class="map-ctrl-item__icon" :icon="'svg-icon:' + item.activeIcon" v-if="showActiveIcon(item)" />
        <div class="map-ctrl-item__label" :class="{'map-ctrl-item__label--active': showActiveIcon(item)}">
          {{ item.label }}
        </div>
      </div>
    </el-tooltip>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import Icon from '@cjc/vue3-svg-icon';

const emits = defineEmits(['item-click', 'disabled-click']);

interface IPropData {
  icon: string;
  activeIcon?: string;
  img?: string,
  type?: string,
  action: string;
  label?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  tooltip?: string;
  disabledTooltip?: string;
}

interface IProp {
  data: IPropData[];
}

const props = withDefaults(defineProps<IProp>(), {
  data: () => []
});

const handleClickItem = (item: IPropData) => {
  if (item.isDisabled) {
    emits('disabled-click', item.action);
    return;
  }
  emits('item-click', item.action);
};

const getTooltipContent = (item: IPropData) => {
  if (item.isDisabled) {
    if (item.disabledTooltip) {
      return item.disabledTooltip;
    }
    return;
  }
  return item.tooltip;
}

const getTooltipDisabled = (item: IPropData) => {
  if (item.isDisabled) {
    return !item.disabledTooltip;
  }
  return !item.tooltip;
}

const showNormalIcon = (item: IPropData) => {
  if (!item.activeIcon) {
    return true;
  }
  return !item.isActive;
}
const showActiveIcon = (item: IPropData) => {
  if (!item.activeIcon) {
    return false;
  }
  return item.isActive;
}
</script>

<style lang="less" scoped>
.map-ctrl-item-list {
  position: relative;
  border-radius: 4px;
  background: #fff;
  box-shadow: var(--box-shadow);
  width: var(--map-ctrl-width);
  pointer-events: all;
  user-select: none;

  +.map-ctrl-item-list {
    margin-top: 10px;
  }
}

.map-ctrl-item {
  min-height: var(--map-ctrl-width);
  padding: 8px 0;
  font-size: 14px;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  color: #333;

  .map-ctrl-item__label {
    font-weight: 400;
    font-size: 14px;
    &--active {
      color: var(--el-color-primary);
    }
  }

  +.map-ctrl-item {
    position: relative;

    &::before {
      position: absolute;
      left: 50%;
      top: 0;
      content: '';
      width: 60%;
      height: 1px;
      transform: translateX(-50%);
      background: var(--el-border-color);
    }
  }

  &:active {
    opacity: 0.8;
  }

  &:hover,
  &.active {
    color: var(--van-primary-color);
  }

  &.disabled {
    color: #c4c4c4;
    cursor: not-allowed;

    &:active {
      opacity: 1;
    }
  }
}

.map-ctrl-item__icon {
  font-size: 18px;
}
</style>
