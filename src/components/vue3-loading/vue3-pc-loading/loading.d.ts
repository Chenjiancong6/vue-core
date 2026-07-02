export declare interface LoadingConfig {
  setGlobalContext: (context?: HTMLElement) => void,
  add: (context?: HTMLElement) => void,
  remove: (context?: HTMLElement) => void,
  clear: () => void,
  setGlobalLoadingStyle: (style: any) => void,
}

declare const _default: LoadingConfig;

export default _default;
