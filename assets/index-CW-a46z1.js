import{d as n,a as o,c as s,G as c,b as r,u as i,h as p}from"./index-CJ0lrX-z.js";const l={class:"markdown-body"},g=n({__name:"README",setup(d,{expose:e}){return e({frontmatter:{},excerpt:void 0}),(t,a)=>(o(),s("div",l,[...a[0]||(a[0]=[c(`<h2>组件说明</h2><p>统一处理界面loading的组件, 基于Vant4 的 toast轻提示 组件二次封装</p><h3>组件安装</h3><pre><code class="language-javascript">pnpm i @cjc/vue3-loading-mobile
</code></pre><h3>在组件内使用</h3><pre><code class="language-javascript">import request from &#39;@cjc/axios&#39;;

const response = await request.get({
    url: &#39;XXXXXX&#39;,
    loading: true, // 开启loading
    context: {
      message: &#39;自定义loading提示&#39;,
    },
});
</code></pre><h3>方法说明</h3><h4>add</h4><pre><code class="language-javascript">
增加一个loading
import Loading from &#39;@cjc/vue3-loading-mobile&#39;;

// loading作用在全局
Loading.add()

// loading的ToastOptions配置项修改
Loading.add({message: &#39;loading提示文字&#39;})
</code></pre><h4>remove</h4><p>移除一个loading</p><pre><code class="language-javascript">// 关闭加载中的loading
Loading.remove()


</code></pre>`,12)])]))}}),_={class:"vue3-loading-body"},m=n({__name:"index",setup(d){return(e,t)=>(o(),s("div",_,[r(i(g))]))}}),h=p(m,[["__scopeId","data-v-30ddfbaf"]]);export{h as default};
//# sourceMappingURL=index-CW-a46z1.js.map
