export const loadScript = (src, target) => {
  return new Promise( resolve => {

    if (target) {
      resolve();
      return ;
    }
    
    let script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    document.head.appendChild(script);
  })
}