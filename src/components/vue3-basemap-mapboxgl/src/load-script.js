function loadMapboxglScriptAndCss() {
  return new Promise((resolve) => {
    // 兼容老的项目，老的项目mapboxgl还是一次性加载的
    if (typeof mapboxgl != "undefined") {
      resolve();
      return;
    }

    if (window.__BAOSHE_VAR_IS_MAPBOXGL_LOADING) {
      const checkoutMapboxglReady = () => {
        if (typeof mapboxgl != "undefined") {
          resolve();
          return;
        }
        requestAnimationFrame(checkoutMapboxglReady);
      };
      checkoutMapboxglReady();
      return;
    }

    window.__BAOSHE_VAR_IS_MAPBOXGL_LOADING = true;

    const loadScript = new Promise((resolve) => {
      if (!window.__BAOSHE_VAR_MAPBOXGL) {
        console.error(
          // @cjc/vite-plugin-lib-static-import
          "找不到变量window.__BAOSHE_VAR_MAPBOXGL的定义，请确保项目已经使用@cjc/vite-plugin-lib-static-import处理第三方库"
        );
        resolve();
        return;
      }

      let script = document.createElement("script");
      // __BAOSHE_VAR_MAPBOXGL变量由@sutpc/lib-static-import包提供
      script.src = window.__BAOSHE_VAR_MAPBOXGL;
      script.type = "module";
      script.onload = resolve;
      document.body.appendChild(script);
    });
    const loadCss = new Promise((resolve) => {
      if (!window.__BAOSHE_VAR_MAPBOXGL_CSS) {
        console.error(
          "找不到变量window.__BAOSHE_VAR_MAPBOXGL_CSS的定义，请确保项目已经使用@sutpc/lib-static-import-plugin处理第三方库"
        );
        resolve();
        return;
      }

      let link = document.createElement("link");
      link.rel = "stylesheet";
      // __BAOSHE_VAR_MAPBOXGL_CSS变量由@sutpc/lib-static-import包提供
      link.href = window.__BAOSHE_VAR_MAPBOXGL_CSS;
      link.onload = resolve;
      document.head.appendChild(link);
    });
    Promise.all([loadScript, loadCss]).then(resolve);
  });
}

export var getMapboxgl = loadMapboxglScriptAndCss;
