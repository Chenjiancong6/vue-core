import request from  "@/axios-request/index";
import axios from "axios";

request.config({
  // requestPre: import.meta.env.VITE_RAGFOLW_URL,
  requestPre: import.meta.env.VITE_API_RAGFOLW_BASEPATH,
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_RAGFOLW_API_KEY}`,
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  //  globalData: {
  //   moduleId: 'transpaas'
  // }
})

// request.addResponseInterceptor(function(response) {
//   // 添加返回值自定义拦截逻辑
//   console.log('添加返回值自定义拦截逻辑', response);
//   return response;
// }, function(error) {
//   return Promise.reject(error);
// })
// request.addRequestInterceptor(function(config) {
//   // 添加请求自定义拦截逻辑
//   console.log('添加请求自定义拦截逻辑', config);
//   return config;
// }, function(error) {
//   return Promise.reject(error);
// })
