/**
 * 自定义指令的使用时机:只有当所需功能只能通过直接的 DOM 操作来实现时，才应该使用自定义指令
 * 列表滑动上升动画指令
 * 指令参数:
 *  v-slide-in:distance="300" 传入元素滑动的距离，默认值为 100px
 *  v-slide-in:duration="500" 传入动画时间，默认值为 500ms
 */

const DISTANCE = 100; // 元素滑动的距离
const DURATION = 500; // 动画时间

// 建立一个动画映射，用于存储元素的动画
const animationMap = new WeakMap();

/**
 * intersectionObserver API
 * 监听元素是否进入视口
 * 元素进入视口时，触发动画
 */
const observer = new IntersectionObserver((entries) => {
  for(let entry of entries) {
    if (entry.isIntersecting) {
      // 元素进入视口，触发动画,从队列中取出动画对象
      const animation = animationMap.get(entry.target);
      // 触发动画
      animation && animation.play();
      // 元素触发一次动画后，取消监听
      observer.unobserve(entry.target);
    }
  }
});

/**
 * 判断元素是否在视口以下
 */
function isBelowViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top > window.innerHeight;
};

export default {
  mounted(el: HTMLElement, binding) {
  // 初始化时，元素只有在视口以下才触发动画
  if(!isBelowViewport(el)) return;

    /**
     * animate api
     * 参数是一个数组
     * 第一个参数是设置关键帧动画
     * 第二个参数是设置动画的时间和缓动函数（动画配置）
     */
    const animation = el.animate([
      { transform: `translateY(${binding.arg === 'distance' ? binding.value : DISTANCE}px)`, opacity: 0.5 },
      { transform: `translateY(0px)`, opacity: 1 }
    ], {
      duration: binding.arg === 'duration' ? binding.value : DURATION,
      easing: 'ease-out',
      fill: 'forwards' // 动画结束后保持最后一帧的状态
    });
    // 把动画对象存储到队列中
    animationMap.set(el, animation);
    // 初始化先暂停动画，等待触发
    animation.pause();
    // 监听元素进入视口
    observer.observe(el);
  },
  unmounted(el: HTMLElement) {
    // 元素移除时，取消监听
    observer.unobserve(el);
  }
}