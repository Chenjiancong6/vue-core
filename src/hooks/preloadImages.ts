const images = [
  'http://localhost:8088/images/1.jpg',
  'http://localhost:8088/images/2.jpg',
  'http://localhost:8088/images/3.jpg',
  'http://localhost:8088/images/4.jpg',
  'http://localhost:8088/images/5.jpg',
  'http://localhost:8088/images/6.jpg',
]

export const preloadImages = (num= 3) => {
  let imagesUrl = [...images]

  function loadImage() {
    let src = imagesUrl.shift()
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      link.onload = resolve;
      link.onerror = reject;

      setTimeout(() => {
        reject(new Error('图片加载超时'));
      }, 5000);
    })
  };

  function _preloadImages() {
    loadImage().finally(() => {
      if(imagesUrl.length > 0) {
        _preloadImages()
      }
    })
  }

  for(let i = 0; i < num; i++) {
    _preloadImages()
  }
}