import type { ComponentInternalInstance, DirectiveBinding, Ref, VNode } from "vue";
type VNodeRef = string | Ref | ((ref: object | null, refs: Record<string, any>) => void);
export interface Option {
    tableElement: HTMLElement,
    binding: StickyDirectiveBinding
    vnode?: VNode
    installOption?: InstallOption
}
export interface TableStickyConfig extends Record<string, number | { [P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P] } | EventListener | HTMLElement> {
    fixedTop: number
    tableHeaderElement: HTMLElement
    tableHeaderOriginalTop: number
    tableHeaderOriginalStyle: { [P in Exclude<keyof CSSStyleDeclaration, Exclude<keyof CSSStyleDeclaration, "position" | "zIndex" | "top" | "transition">>]: CSSStyleDeclaration[P] },
    tableBodyElement: HTMLElement
    tableBodyOriginalStyle: { [P in Exclude<keyof CSSStyleDeclaration, Exclude<keyof CSSStyleDeclaration, "marginTop">>]: CSSStyleDeclaration[P] },
    scrollElement: HTMLElement
    tableWidth: number
    handleScrollElementOnScroll: EventListener
}
export type TableStickyConfigs = Map<string, TableStickyConfig>
export type StickyDirectiveBinding = DirectiveBinding<{ parent: string, top: number }>
export type InstallOption = { parent?: string, top?: number }
export type VNodeNormalizedRefAtom = {
    i: ComponentInternalInstance;
    r: VNodeRef;
    f?: boolean;
}