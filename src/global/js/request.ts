// import request, { axios, configLoading } from  "@/axios-request/index";
// import Loading from "@/components/vue3-loading/vue3-pc-loading/index";
// import Loading from "@/components/vue3-loading/vue3-mobile-loading/index";
import request, { axios, configLoading } from  "@cjc/axios";
// import Loading from "@cjc/vue3-mobile-loading";
import Loading from "@cjc/vue3-loading";



request.config({
  // requestPre: import.meta.env.VITE_RAGFOLW_URL,
  requestPre: import.meta.env.VITE_API_RAGFOLW_BASEPATH,
  // requestPre: import.meta.env.VITE_API_BASEPATH,
  // loading: true,
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_RAGFOLW_API_KEY}`,
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  //  globalData: {
  //   moduleId: 'transpaas'
  // }
});

// 设置loading 配置
configLoading(Loading);

// 设置全局loading 样式
// Loading.setGlobalLoadingStyle({
//   background: 'rgba(0, 0, 0, 0.5)',
// });


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
