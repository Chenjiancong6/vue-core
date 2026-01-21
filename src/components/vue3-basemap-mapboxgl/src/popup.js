export default function Popup(option) {
  this.title = option.title || "";

  const popupSizeClass = (option.size || "normal") + "-size";
  let defaultClassName = `bs-basemap--mapboxgl__popup ${popupSizeClass}`;

  if (option.title) {
    defaultClassName += " with-title";
  }

  if (option.className) {
    option.className += " " + defaultClassName;
  } else {
    option.className = defaultClassName;
  }

  if (!option.maxWidth) {
    option.maxWidth = "532px";
  }

  if (option.focusAfterOpen === undefined) {
    option.focusAfterOpen = false;
  }

  this.popup = new mapboxgl.Popup(option);

  const setHTML1 = this.popup.setHTML;
  const setDOMContent1 = this.popup.setDOMContent;

  this.title = option.title || "";

  this.popup.setHTML = (htmlStr) => {
    this.htmlStr = htmlStr;
    setHTML1.call(this.popup, this.htmlStr);
    return this.popup;
  };

  this.popup.setDOMContent = (dom) => {
    this.dom = dom;

    var popupDom = document.createElement("div");
    popupDom.classList = ["baoshe-mapboxgl-popup__inner"];

    var titleDom = document.createElement("div");
    titleDom.classList = ["baoshe-mapboxgl-popup__title"];
    titleDom.innerText = this.title;

    var contentDom = document.createElement("div");
    contentDom.classList = ["baoshe-mapboxgl-popup__content"];
    contentDom.appendChild(dom);

    popupDom.appendChild(titleDom);
    popupDom.appendChild(contentDom);

    setDOMContent1.call(this.popup, popupDom);
    return this.popup;
  };

  this.popup.setTitle = (newTitle) => {
    // addClassName只在popup显示时才生效
    if (this.popup.isOpen()) {
      if (newTitle) {
        this.popup.addClassName("with-title");
      } else {
        this.popup.removeClassName("with-title");
      }
    }

    this.title = newTitle;
    return this.popup;
  };

  this.popup.on("open", () => {
    if (this.title) {
      this.popup.addClassName("with-title");
    } else {
      this.popup.removeClassName("with-title");
    }
  });

  return this.popup;
}
