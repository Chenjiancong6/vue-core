import { ref, Ref, onMounted, onUnmounted, shallowRef } from 'vue';

interface IArgs {
  containerRef: Ref<HTMLElement>;
  draggableSelector: string;
  autoInit?: boolean;
  dragContainerSelector?: string;
}

/**
 * 可拖拽组件
 * @param containerRef 可拖拽组件的父容器ref
 * @param draggableSelector 可拖拽组件的选择器
 * @param autoInit 是否自动初始化
 * @param dragContainerSelector 限制可拖拽容器的选择器(拖拽区域的范围，默认是整个屏幕) 
 * @returns initDrag 初始化拖拽功能
 */
export function useDraggable({ containerRef, draggableSelector, dragContainerSelector = '', autoInit = true, }: IArgs) {

  let _isInited = false; // 是否已经初始化

  const isDragging = ref(false); // 是否正在拖拽
  const dragDomRef = shallowRef<HTMLElement>(); // 可拖拽元素实例
  const containerWidth = ref(0); // 可拖拽元素的父容器宽度
  const containerHeight = ref(0); // 可拖拽元素的父容器高度
  const dragHandleHeight = ref(0); // 可拖拽元素的触发区域高度

  const dragStartMousePos = ref({ x: 0, y: 0 }); // 拖拽开始时鼠标的位置
  const dragStartComponentPos = ref({ x: 0, y: 0 }); // 拖拽开始时可拖拽元素的位置

  // 计算可拖拽元素的边界位置（X轴和Y轴）重要！
  const _calculateBoundaryPosition = (x: number, y: number) => {
    // 拖拽区域的范围
    let screenWidth = 0;
    let screenHeight = 0;
    // 拖拽区域的范围
    let canDragContainer = null;
    if (dragContainerSelector) {
      canDragContainer = document.querySelector(dragContainerSelector) || null;
      if (canDragContainer) {
        screenWidth = canDragContainer.clientWidth;
        screenHeight = canDragContainer.clientHeight;
      }
    } else {
      // 屏幕的高度和宽度
      screenWidth = window.innerWidth;
      screenHeight = window.innerHeight;
    }

    // X轴：左右最多可隐藏一半
    const maxHiddenX = canDragContainer ? screenWidth / 2 : containerWidth.value / 2;
    const minX = canDragContainer ? maxHiddenX - containerWidth.value : -maxHiddenX;
    // X轴：右最多可隐藏一半
    const maxX = screenWidth - containerWidth.value + maxHiddenX;

    // Y轴：上不能出屏幕，下不能出屏幕
    let dragContainerRectTop = canDragContainer?.getBoundingClientRect().top || 0;
    const minY = canDragContainer ? dragContainerRectTop : 0;
    const maxY = canDragContainer ? screenHeight - dragHandleHeight.value + dragContainerRectTop : screenHeight - dragHandleHeight.value;

    // 计算拖拽后的位置，确保在边界内
    const boundedX = Math.max(minX, Math.min(maxX, x));
    const boundedY = Math.max(minY, Math.min(maxY, y));

    return { x: boundedX, y: boundedY };
  }

  // 拖拽事件- 拖拽中
  const onDrag = (e: MouseEvent) => {
    if (!isDragging.value) return;

    // 当前鼠标位置
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // 鼠标移动的偏移量
    const deltaX = mouseX - dragStartMousePos.value.x;
    const deltaY = mouseY - dragStartMousePos.value.y;

    // 新位置 = 拖拽起始位置 + 偏移量
    let newX = dragStartComponentPos.value.x + deltaX;
    let newY = dragStartComponentPos.value.y + deltaY;

    // 应用边界限制
    const boundedPos = _calculateBoundaryPosition(newX, newY);
    // 更新可拖拽元素的位置
    containerRef.value.style.transform = `translate(${boundedPos.x}px, ${boundedPos.y}px)`;
  }

  // 拖拽事件- 拖拽结束
  const onDragEnd = (e: MouseEvent) => {
    isDragging.value = false;
    dragDomRef.value.style.cursor = 'move';
  }

  // 开始拖拽
  const onDragStart = (e: MouseEvent) => {
    isDragging.value = true;
    dragDomRef.value.style.cursor = 'grabbing';

    // 记录拖拽开始时鼠标的位置
    dragStartMousePos.value = { x: e.clientX, y: e.clientY };

    const rect = containerRef.value.getBoundingClientRect();
    // 记录拖拽开始时可拖拽元素的位置
    dragStartComponentPos.value = { x: rect.left, y: rect.top };

    e.preventDefault();
  }

  // 初始化可拖拽元素的父容器大小和位置
  const _initContainerSizeAndPos = () => {
    if (!containerRef.value) return;
    // 拿到可拖拽元素的父容器宽度和高度
    containerWidth.value = containerRef.value.offsetWidth;
    containerHeight.value = containerRef.value.offsetHeight;

    // 拿到可拖拽元素的父容器大小
    const rect = containerRef.value.getBoundingClientRect();

    // 设置可拖拽元素的父容器的css样式
    containerRef.value.style.position = 'fixed';
    containerRef.value.style.left = '0';
    containerRef.value.style.top = '0';
    // 初始化设置可拖拽元素的父容器的css偏移量位置,这个很重要！
    containerRef.value.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
  }

  // 初始化可拖拽元素的触发区域样式和鼠标事件
  const _initDragHandleStyleAndEvent = () => {
    // 拿到可拖拽元素的触发区域dom 元素
    dragDomRef.value = document.querySelector(draggableSelector) as HTMLElement;

    if (!dragDomRef.value) return;

    // 拿到可拖拽元素的触发区域高度
    dragHandleHeight.value = dragDomRef.value.clientHeight;

    dragDomRef.value.style.cursor = 'move'; // 添加鼠标移动光标

    // 给可拖拽元素的触发区域添加鼠标事件 （鼠标按下时）
    dragDomRef.value.addEventListener('mousedown', onDragStart);

    onUnmounted(() => {
      dragDomRef.value.removeEventListener('mousedown', onDragStart);
    });
  }


  // 初始化拖拽功能
  function initDrag() {
    if (_isInited) return;
    _isInited = true;

    _initContainerSizeAndPos();
    _initDragHandleStyleAndEvent();

    // 添加鼠标事件
    document.addEventListener('mousemove', onDrag); // 鼠标移动时触发拖拽事件
    document.addEventListener('mouseup', onDragEnd); // 鼠标松开时触发拖拽结束事件
    // 组件卸载时移除鼠标事件
    onUnmounted(() => {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', onDragEnd);
    });
  };

  // 初始化拖拽功能
  if (autoInit) {
    onMounted(() => {
      initDrag();
    });
  }
  return {
    initDrag,
  }
}