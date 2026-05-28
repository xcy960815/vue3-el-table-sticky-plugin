import { App } from 'vue';

interface InstallOption {
  parent?: string;
  top?: number;
}

declare const install: (app: App<HTMLElement>, installOption?: InstallOption) => void;

declare const _default: {
  install: (app: App<HTMLElement>, installOption?: InstallOption) => void;
};

export { _default as default, install as vue3TableStickyPlugin };
export type { InstallOption };
