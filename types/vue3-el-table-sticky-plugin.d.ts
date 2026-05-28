import { App } from 'vue';

type StickyElementTarget = string | HTMLElement;
type StickyScrollTarget = StickyElementTarget | Window;
type StickyBoundaryTarget = 'table' | 'scroll-container' | StickyElementTarget;
type StickyOffsetTop = number | (() => number);
type StickyStrategy = 'auto' | 'fixed' | 'sticky';
interface DirectiveBindingValue {
  top?: number;
  parent?: string;
  willBeChangeElementClasses?: string[];
  offsetTop?: StickyOffsetTop;
  scrollTarget?: StickyScrollTarget;
  boundary?: StickyBoundaryTarget;
  observe?: StickyElementTarget[];
  strategy?: StickyStrategy;
  zIndex?: number | 'auto';
  activeClass?: string;
}
interface InstallOption {
  parent?: string;
  top?: number;
  offsetTop?: StickyOffsetTop;
  scrollTarget?: StickyScrollTarget;
  boundary?: StickyBoundaryTarget;
  observe?: StickyElementTarget[];
  strategy?: StickyStrategy;
  zIndex?: number | 'auto';
  activeClass?: string;
}

declare const install: (app: App<HTMLElement>, installOption?: InstallOption) => void;

declare const _default: {
  install: (app: App<HTMLElement>, installOption?: InstallOption) => void;
};

export { _default as default, install as vue3TableStickyPlugin };
export type { InstallOption, DirectiveBindingValue as StickyOptions };
