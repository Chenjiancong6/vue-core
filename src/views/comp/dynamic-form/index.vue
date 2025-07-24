<template>
 <div>动态表单</div>
 <FormBuilder :formItems="formItems" v-model="formItemsData" :rules="rules" ref="formBuilder">
  <template #custom-slot>
    <div>使用slot 插槽</div>
  </template>
 </FormBuilder>
  <el-button type="primary" @click="submitForm"> 确认</el-button>
  <el-button @click="resetForm">重置</el-button>
</template>
<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef, watch, h } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import FormBuilder from './formBuilder.vue';
import Custom from './custom.vue';

const formBuilder = useTemplateRef('formBuilder');

const formItems = computed(() => {
  return [
    {
      key:'name',
      label:'姓名',
      type: 'input',
      props:{
        placeholder:'请输入姓名'
      }
    },
    {
      key:'age',
      label:'年龄',
      type: 'number',
      placeholder:'请输入年龄'
    },
    {
      key:'sex',
      label: '性别',
      type:'select',
      props:{
        placeholder:'请输入性别',
        options: [
          {
            label: '男',
            value: 1
          },
          {
            label: '女',
            value: 2
          },
        ]
      }
    },
    {
      key:'custom',
      label:'引入自定义组件',
      type: Custom
    },
    {
      key:'hCom',
      label:'h函数组件',
      type: () => h('div',null, 'h函数描述')
    },
    {
      key:'custom-slot',
      label:'slot 插槽',
    }
  ]
});

const rules = reactive<FormRules>({
  age:[
    { required: true, message: '请输入年龄', trigger: 'blur' },
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  sex: [{ required: true, message: 'Please select Activity count', trigger: 'change',}],
})

const formItemsData = reactive({
  age:undefined,
  name: undefined,
  sex: undefined,
  custom:'custom-自定义'
});

const submitForm = async () => {
  try {
    await formBuilder.value?.validate();
    console.log('表单验证通过', formItemsData);
  } catch (error) {
    console.log('表单验证失败', error);
  }
};

const resetForm = () => {
  formBuilder.value.resetFields()
}

watch(formItemsData, (val)=> {
  console.log('valllll',val);
})

</script>
<style lang="less" scoped>

</style>