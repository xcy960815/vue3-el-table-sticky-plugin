import type { ComponentInternalInstance, DirectiveBinding, Ref, VNode } from "vue";

type VNodeRef = string | Ref | ((ref: object | null, refs: Record<string, any>) => void);

export interface Option {

    el: HTMLElement,

    binding: StickyDirectiveBinding

    vnode?: VNode

    installOption?: InstallOption

    eventType?: "componentUpdate" | "resize"

}

export interface TableSticky {

    initTableStickyConfig(option: Option): void

    updateTableStickyConfig(option: Option): void

    setTableHeadWrapperDomWidth(option: Option): void

    setTableHeaderStyleFixed(option: Option): void

    removeTableHeaderStyleFixed(option: Option): void

    handleScrollWrapperDomOnScroll(option: Option): void

    getPositionPreviousElementSiblings(element: HTMLElement, previousSiblings: Array<HTMLElement>, condition: (previousSibling: HTMLElement) => boolean): void

    watched(option: Option): void
}

interface TableStickyConfigOption extends Record<string, number | string | EventListener | HTMLElement | { top: number, height: number }> {
    top: number,
    parent: string,
    tableHeaderWrapperDom: HTMLElement
    tableBodyWrapperDom: HTMLElement
    scrollWrapperDom: HTMLElement
    scrollWrapperRect: {
        top: number,
        height: 0
    }
    tableHeaderWrapperDomRect: {
        top: number
        height: number
    }
    handleScrollWrapperDomOnScroll: EventListener | undefined, // 用于存放滚动容器的监听scroll事件的方法
    handleWindowOnResize: EventListener | undefined, // 用于存放页面resize后重新计算head宽度事件的方法
}

export interface TableStickyConfigs extends Record<string, any> {
    [key: string]: TableStickyConfigOption
}

export type StickyDirectiveBinding = DirectiveBinding<{ parent: string, top: number }>

export type InstallOption = { parent?: string, top?: number }

export type VNodeNormalizedRefAtom = {
    i: ComponentInternalInstance;
    r: VNodeRef;
    f?: boolean;
}