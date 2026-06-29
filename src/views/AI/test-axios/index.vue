<template>
 <div>
  <el-button type="primary" @click="handleClickDownload">点击下载文档</el-button>
  <el-button type="primary" @click="handleClickCancel">点击取消下载</el-button>
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import request from "@/axios-request/index";

console.log('axios.defaults.baseURL', axios.defaults.baseURL);
const cancelId = Symbol();
async function referenceDownloadRequest(data: { dataset_id: string; document_id: string; document_name: string }) {
  try {
    const { dataset_id, document_id, document_name } = data;
 
    const response = await request.get({
      url: `/datasets/${dataset_id}/documents/${document_id}`,
      responseType: 'blob',
      cancelId,
      needPre: false,
      // timeout: 10000,
    });
    
    console.log('下载请求',response);
    // 创建 blob 对象并下载
    const blob = response.data;
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = document_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return { success: true, document_name };
  } catch (error) {
    console.error('下载文档失败:', error);
    throw error;
  }
}

const handleClickDownload = () => {
  referenceDownloadRequest({
    dataset_id: "80bbc1546e0b11f1ad948bb20dc46ede",
    document_id: "88e73afc6e0b11f1ad948bb20dc46ede",
    document_name: "陈健聪-前端开发.pdf",
  }).then(res => {
    console.log("测试下载文档",res);
  });
}

const handleClickCancel = () => {
  request.cancel(cancelId);
}
</script>
<style lang="less" scoped>

</style>