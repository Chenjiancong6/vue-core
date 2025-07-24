<template>
 <div class="form-builder--wrap">
    <el-form :model="modelValve" :rules="rules" ref="formInstance">
      <el-form-item 
        v-for="item in formItems"
        :key="item.key"
        :label="item.label"
        :prop="item.key"
      >
      <!--如果传入插槽，用插槽的内容-->
      <slot :name="item.key">
        <component 
          :is="getComponent(item)" 
          v-model="modelValve[item.key]"
          v-bind="setProperty(item)"
          :customAttrs="item"
        >
         <!-- 添加 ElOption 子组件 -->
          <template v-if="item.type === 'select' && item.props?.options">
            <el-option
              v-for="option in item.props.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </template>
        </component>
       </slot>
      </el-form-item>
    </el-form>
 </div>
</template>
<script setup lang="ts">
import { ref, PropType } from 'vue';
import { ElInput, ElInputNumber, ElSelect } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

interface IFormItem {
  key: string,
  label: string,
  type: string,
  props?: object | any;
  placeholder?: string
}

const props = defineProps({
  formItems:{
    type: Array as PropType<IFormItem[]>,
    default: () => []
  },
  rules: {
   type: Object as PropType<FormRules>, 
    default: () => ({})
  }
});

const formInstance = ref<FormInstance>();

const modelValve = defineModel();

const componentMap = {
  input: ElInput,
  number: ElInputNumber,
  select: ElSelect
};

/**
 * 设置动态表单绑定的属性
 * 如果没有传props 对象属性，就把除[key,label,type]外的值当成是表单要绑定的属性
 */
const excludePropertyArr = ['key','label','type'];

 const setProperty = (itemObj:IFormItem) => {
  if(itemObj?.props) return itemObj.props;
  const newProperty = {};
  for(const keys in itemObj) {
    if(!excludePropertyArr.includes(keys)) {
      newProperty[keys] = itemObj[keys]
    }
  };
  return newProperty;
 };

 /**
  * 支持传入自定义组件 
  */
 const getComponent = (itemObj) => {
  if(itemObj.type && typeof itemObj.type !== 'string') {
    return itemObj.type
  }
  return componentMap[itemObj.type] || 'input'
 };

 const validate = (...args: any[]) => {
  if (!formInstance.value) return;
  return formInstance.value.validate();
};

const resetFields = () => {
  if (!formInstance.value) return;
  return formInstance.value.resetFields();
};

 defineExpose({
  validate,
  resetFields
 })

</script>
<style lang="less" scoped>

</style>