import{d as o,a,c as t,G as r,b as i,u as s,h as c}from"./index-CJ0lrX-z.js";const p={class:"markdown-body"},g=o({__name:"README",setup(l,{expose:n}){return n({frontmatter:{},excerpt:void 0}),(d,e)=>(a(),t("div",p,[...e[0]||(e[0]=[r(`<h2>组件说明</h2><p>统一处理界面loading的组件, 基于Element-plus 的loading加载组件二次封装</p><h3>组件安装</h3><pre><code class="language-javascript">pnpm i @cjc/vue3-loading
</code></pre><h3>方法说明</h3><h4>setGlobalLoadingStyle</h4><p>支持修改Element-plus 的loading加载组件的样式</p><pre><code class="language-javascript">import Loading from &quot;@cjc/vue3-loading&quot;

// 设置全局loading 样式
 Loading.setGlobalLoadingStyle({ background: &#39;rgba(0, 0, 0, 0.5)&#39; });
</code></pre><h4>setGlobalContext</h4><p>用于设置全局loading作用域。一般写在<code class="">layout/index.vue</code>中，示例如下：</p><pre><code class="language-javascript">&lt;template&gt;
  &lt;div class=&quot;layout-wrap&quot;&gt;
    &lt;!-- 这里可能放头部、侧边栏菜单等元素 --&gt;
    &lt;div class=&quot;router-wrap&quot; ref=&quot;routerWrapRef&quot;&gt;
      &lt;router-view v-if=&quot;isLoadingGlobalContextReady&quot;/&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref, onMounted } from &#39;vue&#39;;
import Loading from &#39;@cjc/vue3-loading&#39;;

const routerWrapRef = ref(null);

const isLoadingGlobalContextReady = ref(false);

onMounted(() =&gt; {
  // 让路由的内容在全局作用域设置后才渲染，确保它生效
  Loading.setGlobalContext(routerWrapRef.value);
  isLoadingGlobalContextReady.value = true;
});

&lt;/script&gt;

&lt;style lang=&quot;less&quot; scoped&gt;
.layout-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.router-wrap {
  flex: 1;
  height: 0;
}
&lt;/style&gt;
</code></pre><h4>add</h4><p>增加一个loading</p><pre><code class="language-javascript">import Loading from &#39;@cjc/vue3-loading&#39;;

// loading作用在全局
Loading.add()

// loading作用在具体的dom节点
Loading.add(domRef.value)
</code></pre><h4>remove</h4><p>移除一个loading</p><pre><code class="language-javascript">// 加载完毕，需要手动移除loading
// 移除一次全局的loading
Loading.remove()

// 移除一次dom节点的loading
Loading.remove(domRef.value)
</code></pre><h4>clear</h4><p>清除全部的loading，一般用于路由切换时调用</p><pre><code class="language-javascript">import Loading from &#39;@cjc/vue3-loading&#39;;

// 定义路由

// 创建路由


router.beforeEach((to, from, next) =&gt; {
    Loading.clear();
    next();
});

</code></pre>`,20)])]))}}),u={class:"vue3-loading-body"},m=o({__name:"index",setup(l){return(n,d)=>(a(),t("div",u,[i(s(g))]))}}),v=c(m,[["__scopeId","data-v-f53074f1"]]);export{v as default};
//# sourceMappingURL=index-DLqN4Erh.js.map
