import{d as n,a,c as r,G as s,b as l,u as c,h as i}from"./index-CJ0lrX-z.js";const p={class:"markdown-body"},u=n({__name:"README",setup(o,{expose:t}){return t({frontmatter:{},excerpt:void 0}),(d,e)=>(a(),r("div",p,[...e[0]||(e[0]=[s(`<h2>组件说明</h2><p>基于axios的二次封装，用于在项目中发起http请求。</p><h2>组件安装</h2><pre><code class="language-javascript">pnpm i @cjc/axios
</code></pre><h2>方法说明</h2><h3>config</h3><p>用于全局配置请求的参数，比如：请求前缀、默认的header、默认的数据类型等</p><table><thead><tr><th>参数名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>requestPre</td><td>String</td><td>‘’</td><td>请求的前缀。使用Request的全部请求都会带上requestPre，然后在vite.config.ts 转发到真实的baseURL上。除非请求参数中包含needPre: false</td></tr><tr><td>headers</td><td>Object</td><td>{}</td><td>给axios.default.headers设置新的属性或者值，具体参考axios文档</td></tr><tr><td>contentType</td><td>String</td><td>form</td><td>可选值有：form、json。对应的请求数据格式分别为：application/x-www-form-urlencoded、application/json。</td></tr><tr><td>globalData</td><td>Object</td><td>{}</td><td>全局请求数据。该对象会被拼到所有的接口的请求参数中</td></tr></tbody></table><p>globalData参数示例</p><pre><code class="language-javascript">// src/global/js/request.js中 执行，然后在main.ts 进行全局注册
import request from &#39;@cjc/axios&#39;; 
request.config({ 
  requestPre: import.meta.env.VITE_API_BASEPATH, 
  globalData: { moduleId: &#39;transpaas&#39; },
})

// 然后接口中就会携带globalData的参数，比如 https:// www.xxx.com?moduleId=transpaas
</code></pre><h3>getConfig</h3><p>无参数。获取使用config方法设置的配置。可用于使用非request场景时，但是也需要一些头部或者globalData的场景。</p><h3>cancel</h3><table><thead><tr><th>参数名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>cancelId</td><td>String</td><td>Symbol</td><td>要取消的请求的cancelId，不传则取消全部的请求。cancelId在get、post、delete、put等请求中作为参数带上，该值开发者自己定义。</td></tr></tbody></table><p>TIP</p><p>建议使用Symbol定义cancelId</p><pre><code class="language-javascript">const cancelId = Symbol(); 
request.post({ url: &#39;/xxx&#39;, cancelId: cancelId });
request.cancel(cancelId);
</code></pre><h3>post | get | delete | put | patch</h3><table><thead><tr><th>参数名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>url</td><td>String</td><td>‘’</td><td>请求地址</td></tr><tr><td>needPre</td><td>Boolean</td><td>true</td><td>当前请求是否带上前缀</td></tr><tr><td>loading</td><td>Boolean</td><td>true</td><td>是否显示loading</td></tr><tr><td>context</td><td>dom节点</td><td>null</td><td>如果有loading时，loading的作用范围。默认是作用在全局，如果需要作用在局部，可以传入例如：btnRef的dom节点</td></tr><tr><td>data</td><td>Object</td><td>null</td><td>请求的数据，一般是json格式（如果是get请求，数组参数会做扁平化处理，sort:[‘time#desc’,‘name#asc’] 的格式会被转换成sort:time#desc,sort:name#asc）</td></tr><tr><td>params</td><td>Object</td><td>null</td><td>拼接在url后面的参数。例如：params:{name:1}，url会变成:/xxx?name=1</td></tr><tr><td>contentType</td><td>String</td><td>form</td><td>可选值有：form、json。对应的请求数据格式分别为：application/x-www-form-urlencoded、application/json。一般项目全局定义即可，除非接口需要特别定义。</td></tr><tr><td>cancel</td><td>Boolean</td><td>true</td><td>是否允许取消该请求</td></tr><tr><td>cancelId</td><td>String, Symbol</td><td>‘’</td><td>该请求用于取消请求的id，例如：cancelId=123;调用request.cancel(‘123’)就会取消该请求</td></tr><tr><td>globalDataDisabled</td><td>Boolean</td><td>flase</td><td>当前接口是否禁用globalData全局请求参数</td></tr></tbody></table><p>上面几个方法返回的都是promise对象。</p><h3>upload</h3><p>使用multipart方式上传文件，详情使用方式查看下方示例代码</p><h3>getStaticFile</h3><table><thead><tr><th>参数名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>url</td><td>string</td><td>‘’</td><td>需要在工程配置中添加打包路径： VITE_BASE_PATH ，比如VITE_BASE_PATH = / 。加载工程public目录下的文件，支持路由为history模式。url是public目录下的文件相对public的路径，例如：某文件路径是public/static/test.json，则这里要传：static/test.json</td></tr></tbody></table><p>方法使用示例：</p><pre><code class="language-javascript">import { getStaticFile } from &#39;@cjc/axios&#39;; 
getStaticFile(&#39;test.json&#39;).then( res =&gt; { // res就是静态文件的内容 });
</code></pre><h3>createAxios</h3><p>用于创建不被工程的请求配置影响的干净的请求实例。</p><table><thead><tr><th>参数名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>option</td><td>Object</td><td>{}</td><td>参数的属性参考axios.create(opens new window)方法的参数</td></tr></tbody></table><p>方法使用示例：</p><pre><code class="language-javascript">import { createAxios } from &#39;@cjc/axios&#39;;
 const axios = createAxios(); 
</code></pre><h3>configLoading</h3><p>配置请求的loading实例，允许在请求发生时，触发一个loading动画,一般在 src/global/js/request.js 中配置</p><pre><code class="language-javascript">import { configLoading } from &#39;@cjc/axios&#39;; 
import Loading from &#39;@cjc/vue3-loading&#39;;
 configLoading(Loading)
</code></pre><p>TIP</p><p>移动端和pc端的loading动画效果不一样。移动端是基于vant的toast，组件是：@cjc/vue3-loading-mobile。pc端是基于element-plus的loading，组件是：@cjc/vue3-loading。如果要自行实现一个loading，则定义一个对象，并实现几个接口方法即可：add remove clear setGlobalContext</p><h2>使用示例</h2><h3>项目全局定义请求参数</h3><p>一般放在src/global/js/request.js中,然后在main.ts 中 全局注册使用</p><pre><code class="language-javascript">// 初始化配置全局请求，全局的数据格式和全局的头部
 // 一般放在src/global/js/request.js中 
request.config({
 requestPre: import.meta.env.VITE_API_BASEPATH,
 contentType: &#39;json&#39; 
});
</code></pre><h3>组件的请求定义在同级目录的api.js</h3><p>api.js内容示例</p><pre><code class="language-javascript">import request from &#39;@cjc/axios&#39;; 
loadData(options) { 
  return request.get({ url: &#39;/xxx&#39;, ...options })
 }
saveData(options) { 
  return request.post({ url: &#39;/xxx&#39;, ...options })
}, 
getData(options) { 
  return request.post({ 
    url: &#39;/xxx&#39;, 
  // 不显示loading
   loading: false,
   ...options 
}) 
}
</code></pre><h3>组件调用api.js代码示例</h3><pre><code class="language-javascript">&lt;template&gt;
&lt;div ref=&quot;loadingRef&quot;&gt;
    &lt;el-button&gt;点击按钮&lt;/el-button&gt;
  &lt;/div&gt;
&lt;/template&gt;
&lt;script setup&gt;
import { ref } from &#39;vue&#39;;
// 在业务代码中调用同级目录的api.js
import api from &#39;./api.js&#39;;
const loadingRef = ref();
const loadData = async () =&gt; {
 // loadRes就是接口请求结果
  const loadRes = await api.loadData({
    data: {
      xxx: &#39;xxx&#39;
    },
    // 让loading作用在局部，不传context则loading作用在全局
    context: loadingRef.value,
    // 当路由切换时，是否允许该请求被取消，默认是true，允许取消
    cancel: false
  });
}
&lt;/script&gt;
</code></pre><h3>文件上传示例</h3><pre><code class="language-javascript">&lt;template&gt;
&lt;input ref=&quot;fileRef&quot; @change=&quot;uploadData&quot;/&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from &#39;vue&#39;;
// 上传文件示例
// 获取选择的文件
const fileRef = ref();
const uploadData = async () =&gt; {
  let file = fileRef.files[0];
  let formData = new FormData();
  formData.append(&quot;myFiles&quot;, file);
  /**
   * 上传多个文件的代码示例如下：
   * for(let file of fileRes.files) {
   *   formData.append(&#39;myFiles&#39;, file);
   * }
   **/ 
  let uploadRes = await request.upload({
    // 上传url
    url: \`/music/uploadAttachments\`,
    data: formData,
    loading: false,
    timeout: 1000000,
    onUploadProgress: progressEvent =&gt; {
      // this.fileUploadProgress = progressEvent.loaded / progressEvent.total * 100 | 0;
    }
  });
}
&lt;/script&gt;
</code></pre><h2>Q &amp; A</h2><h3>获取axios对象</h3><pre><code class="">import { axios } from &#39;@cjc/axios&#39;;
</code></pre><h3>添加自定义拦截器</h3><pre><code class="language-javascript">import request, {
  axios
} from &#39;@cjc/axios&#39;;

// 这段是根据项目的实际配置写
// 参考以下示例修改src/global/js/request.js的内容：
request.config({
  requestPre: import.meta.env.VITE_API_BASEPATH,
  contentType: &#39;json&#39;,
});

// --------- 业务添加自定义拦截器开始 ----------
// 允许业务自定义返回的拦截器
axios.interceptors.request.use(function(config) {
  // 添加请求自定义拦截逻辑
  return config;
}, function(error) {
  return Promise.reject(error);
});
axios.interceptors.response.use(function(response) {
  // 添加返回值自定义拦截逻辑
  return response;
}, function(error) {
  return Promise.reject(error);
})
// --------- 业务添加自定义拦截器结束 ----------



------------ 接口内的自定义拦截器 ----------------
    const response = await request.get({
      url: &#39;xxxx&#39;,
      responseType: &#39;blob&#39;,
      cancelId,
      // 接口内 请求拦截器
      requestInterceptor: {
        callback: (config) =&gt; {
          return config;
        },
        errorCallback: (error) =&gt; {
          return Promise.reject(error);
        }
      },
      // 接口内响应拦截器
      responseInterceptor:{
        callback: (response) =&gt; {
          return response;
        },
        errorCallback: (error) =&gt; {
          return Promise.reject(error);
        }
      }
    });


</code></pre><h3>打开全局loading</h3><pre><code class="language-javascript">// 在 src/global/request.ts中编写如下代码 
import request from &#39;@cjc/axios&#39;; 
request.config({ loading: true })
</code></pre><h3>单个接口设置加载loading</h3><p>接口内的loading 优先级最高，只要接口内设置了loading为 true 或者 false, 就会优先触发</p><pre><code class="language-javascript">const response = await request.get({
  url: &#39;xxxx&#39;,
  loading: true
});
</code></pre>`,57)])]))}}),g={class:"request-axios-body"},h=n({__name:"index",setup(o){return(t,d)=>(a(),r("div",g,[l(c(u))]))}}),f=i(h,[["__scopeId","data-v-8b90c5ce"]]);export{f as default};
//# sourceMappingURL=index-CUYwbvVo.js.map
