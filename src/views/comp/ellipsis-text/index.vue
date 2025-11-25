<template>
 <div class="ellipsis-text__content">
  <!-- 文本没有出现省略 -->
  <div class="no-ellipsis">
    <EllipsisText text="文本没有出现省略" />
  </div>
  <!-- 文本出现省略 -->
  <div class="ellipsis">
    <EllipsisText text="文本出现省略显示tooltip" />
  </div>
  <!-- 自定义文本内容 -->
   <div class="custom-text">
    <EllipsisText text="文本内容">{{ '自定义文本内容' }}</EllipsisText>
   </div>
   <!-- 自定义文本内容,出现tooltop -->
   <div class="custom-ellipsis">
    <EllipsisText text="出现省略号">
      {{ '自定义省略号文本内容' }}
    </EllipsisText>
   </div>
 </div>
</template>
<script setup lang="ts">
import EllipsisText from '@cjc/ellipsis-text';

</script>
<style lang="less" scoped>
.ellipsis-text__content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
.no-ellipsis {
  width: 120px;
}
.ellipsis {
  margin-left: 150px;
  width: 150px;
}
.custom-text {
  margin-left: 150px;
}
.custom-ellipsis {
  margin-left: 150px;
  width: 130px;
}
</style>