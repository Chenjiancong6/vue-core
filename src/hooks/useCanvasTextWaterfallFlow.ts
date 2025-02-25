import { onUnmounted } from "vue";

let timerId = null;
// canvas 文字瀑布流
export const useCanvasTextWaterfallFlow = (timer = 30) => {
  
  const canvasTextWaterfallFlow = (textColor = '#6be445') => {
    const canvas = document.querySelector('canvas');
    if(!canvas) {
      throw new Error("需要有一个canvas节点");
    }
    // 获取了 2D 渲染上下文
    const ctx = canvas.getContext('2d');

    // 设置canvas的宽高
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    // 设置字体大小
    const fontSize = 10 * devicePixelRatio;
    ctx.font = `${fontSize}px Arial`;

    // 计算有多少列字
    const columnCount = Math.floor(canvas.width / fontSize);
    // 每列字的y轴高度的数字 [5,8,3], 表示第0列字的高度是5，第1列字的高度是8，第2列字的高度是3
    const charIndexArr = new Array(columnCount).fill(0);

    // 生成0到z之间的随机整数
    const getRandomChar = () => {
      const str = '0123456789abcdefghijklmnopqrstuvwxyz';
      return str[Math.floor(Math.random() * str.length)];
    };

      // 描绘canvas
    const drawCanvas = () => {
      // 每次设置一个新的背景色，盖住之前的内容
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 设置字体颜色
      ctx.fillStyle = textColor;
      // 设置字体对齐方式
      ctx.textBaseline = 'top';
      // 遍历总列数，给每一列添加文字
      for (let i = 0; i < columnCount; i++) {
        // 获取随机数字
        const text = getRandomChar();
        // 计算X轴坐标
        const x = i * fontSize;
        // 获取当前列字的y轴坐标
        const y = charIndexArr[i] * fontSize;
        // 绘制文字
        ctx.fillText(text, x, y);

        // 给临界值，更新当前列字的y轴坐标
        // 如果y轴坐标大于canvas的高度，则重置为0
        // 如果y轴坐标小于canvas的高度，则y轴坐标+1
        // Math.random() > 0.99 是个巧妙的方式，可以让文字的y轴坐标在0和canvas的高度之间随机变化
        if(y > canvas.height && Math.random() > 0.99){
          charIndexArr[i] = 0;
        }else {
          charIndexArr[i]++;
        }
      };
    };

    // 初始化执行一次
    drawCanvas();
    // 设置定时器，每隔一段时间执行一次
    timerId = setInterval(drawCanvas, timer);
  };

  onUnmounted(() => {
    timerId && clearInterval(timerId);
    timerId = null;
  });

  return {
    canvasTextWaterfallFlow
  }
}