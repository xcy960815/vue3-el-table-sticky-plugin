import type { App } from 'vue';

declare const _default: {
  install: (app: App<any>, installOption?: InstallOption) => void;
};
export default _default;

export declare interface InstallOption {
  parent?: string;
  top?: number;
}

export declare const vue3TableStickyPlugin: (app: App, installOption?: InstallOption) => void;

export {};
