import type { ComponentInternalInstance, DirectiveBinding, Ref, VNode } from 'vue';

type VNodeRef = string | Ref | ((ref: object | null, refs: Record<string, any>) => void);

export interface DirectiveBindingValue {
  top: number;
  parent: string;
  willBeChangeElementClasses: Array<string>;
}
export interface Option {
  tableElement: HTMLElement;
  binding: DirectiveBinding<DirectiveBindingValue>;
  vnode: VNode;
  installOption: InstallOption;
}
export interface StickyConfig {
  fixedTopValue: number;
  tableHeaderElement: HTMLElement;
  tableHeaderElementOriginalTop: number;
  tableHeaderElementOriginalStyle: Pick<
    CSSStyleDeclaration,
    'position' | 'zIndex' | 'top' | 'transition'
  >;
  tableInnerWapperElement: HTMLElement;
  tableInnerWapperElementOriginalStyle: Pick<CSSStyleDeclaration, 'marginTop'>;
  tableBodyElement: HTMLElement;
  scrollElement: HTMLElement;
  tableElementOriginalWidth: string;
  handleScrollElementOnScroll: EventListener;
  tableElementResizeObserver?: ResizeObserver;
  willChangeElementsOriginalHeight?: string[];
  willChangeElementsResizeObserver?: ResizeObserver[];
}

export interface StickyConfigs extends Map<string, StickyConfig> {}
export interface InstallOption {
  parent?: string;
  top?: number;
}

export interface VNodeNormalizedRefAtom {
  i: ComponentInternalInstance;
  r: VNodeRef;
  f?: boolean;
}
