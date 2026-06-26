import request from  "@/axios-request/index";

request.config({
  requestPre: import.meta.env.VITE_RAGFOLW_URL,
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_RAGFOLW_API_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  responseType: 'blob',
})