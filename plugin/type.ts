import type { DirectiveBinding, VNode } from 'vue';

export type StickyElementTarget = string | HTMLElement;
export type StickyScrollTarget = StickyElementTarget | Window;
export type StickyBoundaryTarget = 'table' | 'scroll-container' | StickyElementTarget;
export type StickyOffsetTop = number | (() => number);
export type StickyStrategy = 'auto' | 'fixed' | 'sticky';

export interface DirectiveBindingValue {
  /**
   * @deprecated Use offsetTop instead.
   */
  top?: number;
  /**
   * @deprecated Use scrollTarget instead.
   */
  parent?: string;
  /**
   * @deprecated Use observe instead.
   */
  willBeChangeElementClasses?: string[];
  offsetTop?: StickyOffsetTop;
  scrollTarget?: StickyScrollTarget;
  boundary?: StickyBoundaryTarget;
  observe?: StickyElementTarget[];
  strategy?: StickyStrategy;
  zIndex?: number | 'auto';
  activeClass?: string;
}

export interface Option {
  tableElement: HTMLElement;
  binding: DirectiveBinding<DirectiveBindingValue | undefined>;
  vnode: VNode;
  installOption?: InstallOption;
}

export interface InstallOption {
  /**
   * @deprecated Use scrollTarget instead.
   */
  parent?: string;
  /**
   * @deprecated Use offsetTop instead.
   */
  top?: number;
  offsetTop?: StickyOffsetTop;
  scrollTarget?: StickyScrollTarget;
  boundary?: StickyBoundaryTarget;
  observe?: StickyElementTarget[];
  strategy?: StickyStrategy;
  zIndex?: number | 'auto';
  activeClass?: string;
}

export interface TableElements {
  tableElement: HTMLElement;
  tableHeaderElement: HTMLElement;
  tableInnerWrapperElement: HTMLElement;
  tableBodyElement: HTMLElement;
}

export interface ResolvedStickyOptions {
  offsetTop: StickyOffsetTop;
  scrollTarget?: StickyScrollTarget;
  boundary: StickyBoundaryTarget;
  observe: StickyElementTarget[];
  strategy: StickyStrategy;
  zIndex: number | 'auto';
  activeClass: string;
}

export interface StyleSnapshot {
  header: Pick<
    CSSStyleDeclaration,
    'left' | 'position' | 'right' | 'top' | 'transition' | 'width' | 'zIndex'
  >;
  placeholder: Pick<CSSStyleDeclaration, 'display' | 'height'>;
  scrollElement: Pick<CSSStyleDeclaration, 'overflowAnchor'>;
}

export interface WatchedElementObserver {
  target: StickyElementTarget;
  element: HTMLElement;
  observer: ResizeObserver;
}

export interface ScrollContext {
  element: HTMLElement;
  isWindow: boolean;
}

export type StickyPhase = 'inactive' | 'stuck' | 'released';

export interface StickyMeasurement {
  phase: StickyPhase;
  offsetTop: number;
  top: number;
  left: number;
  width: number;
  headerHeight: number;
  zIndex: number;
}

export interface StickyState extends TableElements {
  scrollContext: ScrollContext;
  boundaryElement: HTMLElement;
  options: ResolvedStickyOptions;
  styles: StyleSnapshot;
  phase: StickyPhase;
  addedFixedClass: boolean;
  appliedActiveClass: string;
  headerOffsetWithinTable: number;
  placeholderElement: HTMLDivElement;
  rafId: number | null;
  tableResizeObserver?: ResizeObserver;
  watchedElementObservers: WatchedElementObserver[];
  cleanups: Array<() => void>;
  disposed: boolean;
}
