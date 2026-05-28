import type { DirectiveBinding, VNode } from 'vue';
import type { CancelableFunction } from './utils';

export interface DirectiveBindingValue {
  top?: number;
  parent?: string;
  willBeChangeElementClasses?: string[];
}

export interface Option {
  tableElement: HTMLElement;
  binding: DirectiveBinding<DirectiveBindingValue | undefined>;
  vnode: VNode;
  installOption?: InstallOption;
}

export interface InstallOption {
  parent?: string;
  top?: number;
}

export interface TableElements {
  tableElement: HTMLElement;
  tableHeaderElement: HTMLElement;
  tableInnerWrapperElement: HTMLElement;
  tableBodyElement: HTMLElement;
}

export interface ResolvedStickyOptions {
  fixedTopValue: number;
  defaultTop: boolean;
  parent?: string;
  willBeChangeElementClasses: string[];
}

export interface StyleSnapshot {
  header: Pick<CSSStyleDeclaration, 'position' | 'zIndex' | 'top' | 'transition' | 'width'>;
  innerWrapper: Pick<CSSStyleDeclaration, 'marginTop'>;
  scrollElement: Pick<CSSStyleDeclaration, 'overflowAnchor'>;
}

export interface WatchedElementObserver {
  selector: string;
  element: HTMLElement;
  observer: ResizeObserver;
}

export interface StickyState extends TableElements {
  scrollElement: HTMLElement;
  options: ResolvedStickyOptions;
  styles: StyleSnapshot;
  isFixed: boolean;
  addedFixedClass: boolean;
  headerOffsetWithinTable: number;
  scrollHandler: EventListener;
  refreshLayout: CancelableFunction;
  checkSticky: CancelableFunction;
  tableResizeObserver?: ResizeObserver;
  watchedElementObservers: WatchedElementObserver[];
  cleanups: Array<() => void>;
  disposed: boolean;
}
