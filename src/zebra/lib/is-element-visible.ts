

/**
 *  @description 判断元素是否在父容器的可视范围内（简化版）
 * @param { HTMLElement } el DOM元素
 * @param { HTMLElement } parent 父容器元素
 * @returns boolean 元素是否完全在父容器的可视范围内,是返回true,否返回false
 * @example
 * const elDiv = document.querySelector('.el-div');
 * isElementVisible(elDiv); // true
 */
export const isElementVisible = (el: HTMLElement, parent: HTMLElement | null = null) => {
  // 参照容器
  const scrollParent = parent || findScrollParent(el);
  
  // 如果传入父节点和当前的el元素都找不到参照容器，则以document.body作为参照容器
  // 如果scrollParent不存在（比如el是body的直接子元素，且所有祖先的overflow都是visible），则检查元素是否​​完全在浏览器视口内​
  if(!scrollParent) {
    const rect = el.getBoundingClientRect();
    // 检查元素是否完全在浏览器视口内
     return (
      rect.top >= 0 &&          // 元素顶部不超出视口顶部
      rect.left >= 0 &&         // 元素左侧不超出视口左侧
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && // 元素底部不超出视口底部
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)       // 元素右侧不超出视口右侧
    );
  };

  // 相对于父容器的检查
  const parentRect = scrollParent.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return (
    elRect.top >= parentRect.top && // 元素顶部不超出父容器顶部
    elRect.left >= parentRect.left && // 元素左侧不超出父容器左侧
    elRect.bottom <= parentRect.bottom && // 元素底部不超出父容器底部
    elRect.right <= parentRect.right // 元素右侧不超出父容器右侧
  );

}


// ​​查找给定 DOM 元素最近的「可滚动祖先元素」
function findScrollParent(element:HTMLElement) {
  if(!element) return null;

  // 1. 初始化：从目标元素的直接父节点开始
  let parent = element.parentElement;

  // 2. 循环查找：逐级向上遍历父节点，直到找到可滚动祖先或到达文档根节点
  while(parent) {
    // 3. 获取当前祖先节点的「最终计算样式」（包含继承/浏览器默认样式）
    const computedStyle = window.getComputedStyle(parent);
    // 4. 拼接 overflow 相关的三个样式属性（overflow/overflowX/overflowY）
    //    例如：overflow=hidden, overflowY=scroll → 拼接结果为 "hiddenscroll"
    const overflowCombination = computedStyle.overflow + computedStyle.overflowX + computedStyle.overflowY;

    // 5. 正则测试：判断是否包含 auto 或 scroll（这两个值表示「可滚动」）
    const isScrollable = /(auto|scroll)/.test(overflowCombination);;

    // 6. 如果当前节点可滚动，直接返回（找到最近的可滚动父元素）
    if(isScrollable) return parent;

    // 7. 如果没有找到，继续向上遍历
    parent = parent.parentElement
  }

  // 8. 遍历完所有祖先都没找到可滚动节点，返回 null
  return null;
};