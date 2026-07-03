<template>
 <div ref="downloadRef">
  <el-button type="primary" @click="handleClickDownload" >点击下载文档</el-button>
  <el-button type="primary" @click="handleClickCancel">点击取消下载</el-button>
  <el-button type="primary" @click="handleClickPost">园区post 请求</el-button>
  <el-button type="primary" @click="handleClickUpload">上传文件</el-button>
  <el-button type="primary" @click="handleClickRequestInterceptor">请求拦截器</el-button>
  <el-button type="primary" @click="handleClickDownloadStaticFile">下载静态资源</el-button>
  <el-button type="primary" @click="handleClickLoadingMobile">移动端loading加载</el-button>
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { joinPaths } from '@cjc/zebra';
// import request, { getStaticFile } from "@/axios-request/index";
import request, { getStaticFile } from "@cjc/axios";

const downloadRef = ref(null);

const callCykjcsApi = async (apiOption, requestOption = null) => {

  const callUrl = joinPaths('/cykjcs-api/call', apiOption.url);

  delete apiOption.url;

  let res = null;
  try {
    res = await request.post({
      url: callUrl,
      headers: {
        'Web_authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl93ZWJVc2VyX2tleSI6IjlmN2RhMGZhLWNiMjctNGM0ZC04ZjA1LWVkODBmMDllODAwYyIsInVzZXJJZCI6IjEzODEwOTQzIn0.JzU52d5yopne8N5DUtMcJ5lDiepqNuK-aQcVw0G6IIY7jV6uKt0StqP_sPiorL_KN3Jp87eY4JIIS-mcXa5vPQ`
      },
      data: apiOption,
      ...requestOption,
      responseInterceptor:{
        callback: (response) => {
          console.log('响应拦截器',response);
          return response;
        },
        errorCallback: (error) => {
          // console.log('响应拦截器错误',error);
          return Promise.reject(error);
        }
      }
    });
  } catch (e) {
    throw e;
  }
  return res;
}

const cancelId = Symbol();
async function referenceDownloadRequest(data: { dataset_id: string; document_id: string; document_name: string }) {
  try {
    const { dataset_id, document_id, document_name } = data;
 
    const response = await request.get({
      url: `/datasets/${dataset_id}/documents/${document_id}`,
      responseType: 'blob',
      cancelId,
      needPre: false,
      loading: true,
      context: downloadRef.value,
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

const handleClickPost = async () => {
  const res = await callCykjcsApi(
    {
      url: "/cycs-api-pro/platformOpenApi/parkQuery",
      method: "post",
      data: {"yqmc":"","fymc":"","fwlx":"","sfqh":"","remen":[],"zklx":"","qslx":"","shptss":"","sfyht":"","yqfwlx":"","sfywsclss":null,"sfypfqxt":null,"sfyxhpt":null,"sfyhctd":null,"sfsdmdyyq":null,"sfytcc":null,"sfyktpqxt":null,"sfydzk":null,"sfywhpzjc":null,"sfsldgdyq":"","isDjyq":"","xmId":"","cylx":"","bwcybzf":"","searchZdyq":"","sfscxxcyyf":"","yqgnlb":"","dzhkj":"","sgxjzzyhzq":"","ckzjStart":"","ckzjEnd":"","cksjStart":"","cksjEnd":"","czmjStart":"","czmjEnd":"","csmjStart":"","csmjEnd":"","lfgdStart":"","lfgdEnd":"","sccgStart":"","sccgEnd":"","lccgStart":"","lccgEnd":"","scczStart":"","scczEnd":"","bzcczStart":"","bzcczEnd":"","streetBm":""},
    },
  );
  console.log("测试园区post 请求",res);
};


const uploadBase64file = (base64: string) => {
  let formData = new FormData();
  formData.append("base64", base64);
  // 这里改成multipart
  return request.upload({
    url: '/qyhp/api/uploadFileVm',
    data: formData,
  })
};

const handleClickUpload = async () => {
  const res = await uploadBase64file("base64字符串");
  console.log("测试上传文件",res);
}

const handleClickRequestInterceptor = async () => {
  const dataset_id = "80bbc1546e0b11f1ad948bb20dc46ede";
  const document_id = "88e73afc6e0b11f1ad948bb20dc46ede";
      const response = await request.get({
      url: `/datasets/${dataset_id}/documents/${document_id}`,
      responseType: 'blob',
      cancelId,
      requestInterceptor: {
        callback: (config) => {
          return config;
        },
        errorCallback: (error) => {
          return Promise.reject(error);
        }
      },
      responseInterceptor:{
        callback: (response) => {
          return response;
        },
        errorCallback: (error) => {
          return Promise.reject(error);
        }
      }
    });
}

const handleClickDownloadStaticFile = async () => {
  const res = await getStaticFile('static/js/mapbox-gl.js');
  console.log("1测试下载静态资源",res);
}

const handleClickLoadingMobile = async () => {
  const dataset_id = "80bbc1546e0b11f1ad948bb20dc46ede";
  const document_id = "88e73afc6e0b11f1ad948bb20dc46ede";
  const response = await request.get({
    url: `/datasets/${dataset_id}/documents/${document_id}`,
    responseType: 'blob',
    loading: true, // 开启loading
    // context: {
    //   message: '自定义loading提示',
    // },
  });
}


</script>
<style lang="less" scoped>

</style>