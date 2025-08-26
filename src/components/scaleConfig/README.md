# config 字体、echarts字体、页面缩放大小的配置项

~~~javascript

  // 字体和页面缩放配置,默认缩放为1倍
  fontSizeScale: 1,
  sizeScale: 1,

// echarts 字体和模块大小缩放配置， 默认缩放为1倍
  echarts: {
    fontSizeScale: 1,
    sizeScale: 1,
    theme: ''
  }


/**
*  setConfig方法，修改缩放倍率
* 业务代码中，凡是用设计稿的尺寸来写的，包括style echarts等，都使用config.sizeScale来做缩放
*比如某文字在设计稿是32px，则style的fontSize就是：32 * config.sizeScale + 'px'
**/
setConfig({
   fontSizeScale: 1.2,
  sizeScale: 1.2,
  echarts: {
    fontSizeScale: 1.2,
    sizeScale: 1.2,
  }
})




~~~
