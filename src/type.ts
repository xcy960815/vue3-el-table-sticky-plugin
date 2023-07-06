import type {
  ComponentInternalInstance,
  DirectiveBinding,
  Ref,
  VNode,
} from "vue";
type VNodeRef =
  | string
  | Ref
  | ((ref: object | null, refs: Record<string, any>) => void);
export interface Option {
  tableElement: HTMLElement;
  binding: StickyDirectiveBinding;
  vnode?: VNode;
  installOption?: InstallOption;
  uploadType?: "init" | "update" | "watch";
}
export interface TableStickyConfig
  extends Record<
    string,
    | number
    | { [P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P] }
    | EventListener
    | HTMLElement
    | ResizeObserver
  > {
  fixedTop: number;
  tableInnerWapperElement: HTMLElement;
  tableHeaderElement: HTMLElement;
  tableHeaderElementOriginalTop: number;
  tableHeaderElementOriginalStyle: {
    [P in Exclude<
      keyof CSSStyleDeclaration,
      Exclude<
        keyof CSSStyleDeclaration,
        "position" | "zIndex" | "top" | "transition"
      >
    >]: CSSStyleDeclaration[P];
  };
  tableBodyElement: HTMLElement;
  tableInnerWapperElementOriginalStyle: {
    [P in Exclude<
      keyof CSSStyleDeclaration,
      Exclude<keyof CSSStyleDeclaration, "marginTop">
    >]: CSSStyleDeclaration[P];
  };
  scrollElement: HTMLElement;
  tableWidth: string;
  scrollElementOnScroll: EventListener;
  resizeObserver?: ResizeObserver;
}
export type TableStickyConfigs = Map<string, TableStickyConfig>;
export type StickyDirectiveBinding = DirectiveBinding<{
  parent: string;
  top: number;
}>;
export type InstallOption = { parent?: string; top?: number };

export type VNodeNormalizedRefAtom = {
  i: ComponentInternalInstance;
  r: VNodeRef;
  f?: boolean;
};
