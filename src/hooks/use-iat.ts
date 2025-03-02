import CryptoJS from 'crypto-js';
import { onUnmounted, ref } from 'vue';

// 定义一个函数loadScript，用于加载外部脚本
const loadScript = (url) => {
  // 返回一个Promise对象
  return new Promise((resolve) => {
    // 创建一个script元素
    let scriptDom = document.createElement("script");
    scriptDom.src = url;
    // 当script元素加载完成后，调用resolve函数
    scriptDom.onload = resolve;
    document.body.appendChild(scriptDom);
  });
};

/**
 * 迅飞语音听写（流式版）WebAPI
 * @returns 
 */
export const useIat = () => {
  const APPID = "95db8944";
  const API_SECRET = "MzI1Y2Y1Njg2NTBkYTA0YWQyOWFhMjMx";
  const API_KEY = "11f68ddcc0862863f69214227ffb3d79";

  // 执行状态
  const wsStatus = ref("UNDEFINED"); // "UNDEFINED" "CONNECTING" "OPEN" "CLOSING" "CLOSED"
  // 录音状态
  const isRecordReady = ref(false);
  // 语音听写websocket
  const iatWS = ref(null);
  // 语音转文字
  const iatText = ref("");
  // 临时语音转文字存储
  const resultTextTemp = ref("");

  // RecorderManager实例
  let recorder = null; 

  const handleScriptReady = () => {
    // 引入科大讯飞语音包;'static/iat' : 语音包文件夹
    recorder = new RecorderManager('static/iat');
    initRecorder(recorder);
  };
  // 加载外部脚本后，执行回调函数，才能拿到recorder实例
  loadScript('static/iat/index.umd.js').then(handleScriptReady)

  // 初始化recorder对象实例
  function initRecorder(recorder) {
    // 语音包初始化
    recorder.onStart = () => {
      changeWsStatus("OPEN");
    };
    // 录音回调
    recorder.onFrameRecorded = ({ isLastFrame, frameBuffer }) => {
      if (iatWS.value.readyState === iatWS.value.OPEN) {
        iatWS.value.send(
          JSON.stringify({
            data: {
              status: isLastFrame ? 2 : 1,
              format: "audio/L16;rate=16000",
              encoding: "raw",
              audio: toBase64(frameBuffer),
            },
          })
        );
        if (isLastFrame) {
          changeWsStatus("CLOSING");
        }
      }
    };
  };

  /**
   * 获取websocket url
   * 该接口需要后端提供，这里为了方便前端处理
   */
  function getWebSocketUrl() {
    // 请求地址根据语种不同变化
    let url = "wss://iat-api.xfyun.cn/v2/iat";
    let host = "iat-api.xfyun.cn";
    let apiKey = API_KEY;
    let apiSecret = API_SECRET;
    let date = new Date().toGMTString();
    let algorithm = "hmac-sha256";
    let headers = "host date request-line";
    let signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
    let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    let signature = CryptoJS.enc.Base64.stringify(signatureSha);
    let authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    let authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    return url;
  };

  // 将ArrayBuffer转为base64
  function toBase64(buffer) {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // ws状态
  function changeWsStatus(status) {
    wsStatus.value = status;
    if (status === "CONNECTING") {
      isRecordReady.value = true;
      iatText.value = "";
      resultTextTemp.value = "";
    } else if (status === "OPEN") {
      isRecordReady.value = true;
    } else if (status === "CLOSING") {
      isRecordReady.value = false;
    } else if (status === "CLOSED") {
      isRecordReady.value = false;
    }
  };

  // 渲染识别结果
  function renderResult(resultData) {
    // 识别结束
    let jsonData = JSON.parse(resultData);
    if (jsonData.data && jsonData.data.result) {
      let data = jsonData.data.result;
      let str = "";
      let ws = data.ws;
      for (let i = 0; i < ws.length; i++) {
        str = str + ws[i].cw[0].w;
      }
      // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
      // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
      if (data.pgs) {
        if (data.pgs === "apd") {
          // 将resultTextTemp同步给iatText
          iatText.value = resultTextTemp.value;
        }
        // 将结果存储在resultTextTemp中
        resultTextTemp.value = iatText.value + str;
      } else {
        iatText.value = iatText.value + str;
      }
    }
    if (jsonData.code === 0 && jsonData.data.status === 2) {
      iatWS.value.close();
    }
    if (jsonData.code !== 0) {
      iatWS.value.close();
    }
  };

  // 连接websocket
  function connectWebSocket() {
    const websocketUrl = getWebSocketUrl();
    if ("WebSocket" in window) {
      iatWS.value = new WebSocket(websocketUrl);
    } else if ("MozWebSocket" in window) {
      iatWS.value = new MozWebSocket(websocketUrl);
    } else {
      alert("浏览器不支持WebSocket");
      return;
    }
    changeWsStatus("CONNECTING");
    iatWS.value.onopen = (e) => {
      // 开始录音
      recorder.start({
        sampleRate: 16000,
        frameSize: 1280,
      });
      let params = {
        common: {
          app_id: APPID,
        },
        business: {
          language: "zh_cn",
          domain: "iat",
          accent: "mandarin",
          vad_eos: 5000,
          dwa: "wpgs",
        },
        data: {
          status: 0,
          format: "audio/L16;rate=16000",
          encoding: "raw",
        },
      };
      iatWS.value.send(JSON.stringify(params));
    };
    // 接收websocket消息
    iatWS.value.onmessage = (e) => {
      renderResult(e.data);
    };
    // 关闭websocket
    iatWS.value.onerror = (e) => {
      console.error(e);
      recorder.stop();
      changeWsStatus("CLOSED");
    };
    // 关闭websocket
    iatWS.value.onclose = (e) => {
      recorder.stop();
      changeWsStatus("CLOSED");
    };
  };

  // 连接语音听写
  const startConnectReady = () => {
    if (wsStatus.value === "UNDEFINED" || wsStatus.value === "CLOSED") {
      connectWebSocket();
    }
  };

  // 关闭语音听写
  const closeConnect = () =>{
    if(iatWS.value && recorder) {
      // 关闭websocket
      recorder.stop();
      iatWS.value.close();
      changeWsStatus("CLOSED");
    }
  };

  onUnmounted(()=> {
    iatWS.value && iatWS.value.close();
    iatWS.value = null;
    iatText.value = "";
    recorder = null;
  });

  return {
    startConnectReady,
    closeConnect,
    iatText,
    isRecordReady
  }
}