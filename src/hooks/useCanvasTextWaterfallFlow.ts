// canvas 文字瀑布流
export const useCanvasTextWaterfallFlow = () => {

  const canvasTextWaterfallFlow = () => {
    const canvas = document.querySelector('canvas');
    if(!canvas) {
      throw new Error("需要有一个canvas节点");
    }
    // 获取了 2D 渲染上下文
    const ctx = canvas.getContext('2d');

    // 设置canvas的宽高
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    drawCanvas(canvas,ctx)
    console.log('ctx',ctx);
  };

  // 描绘cancas
  const drawCanvas = (canvas:any,ctx:any) => {
    ctx.fillStyle = '#fff'
    ctx.fillText('hello world', canvas.width / 2, canvas.height / 2)
  }


  return {
    canvasTextWaterfallFlow
  }
}