import type { App, DirectiveBinding, VNode } from "vue"

import type { InstallOption, VNodeNormalizedRefAtom } from "./type"

import { tableSticky, tableStickyConfigs } from "./table-sticky-config"


const install = (app: App, installOption?: InstallOption) => {

    app.directive('sticky', {
        /**
         * @desc 当被绑定的元素插入到DOM中
         * @param {HTMLElement} el 
         * @param {{ top: number, parent: string }} binding 
         * @param {VNode} vnode 
         */
        mounted(el: HTMLElement, binding: DirectiveBinding<{ top: number, parent: string }>, vnode: VNode) {
            const option = { el, binding, vnode, installOption }
            // 初始化数据
            tableSticky.initTableStickyConfig(option)
            // 监听父级的某些变量
            tableSticky.watched(option)
        },

        /**
         * @desc 组件更新后。重新计算表头宽度
         * @param { HTMLElement } el 
         * @param { { top: number, parent: string } } binding 
         * @param { VNode } vnode 
         */
        updated(el: HTMLElement, binding: DirectiveBinding<{ top: number, parent: string }>, vnode: VNode) {

            // 当页面尺寸发生变更的时候 重新记录 tableStickyConfig 数据
            tableSticky.updateTableStickyConfig({ el, vnode, binding, installOption, eventType: "componentUpdate" })

            // 重新设置表头宽度
            tableSticky.setTableHeadWrapperDomWidth({ el, binding, vnode, installOption })

        },

        /**
         * @desc 节点取消绑定时 移除各项监听事件。
         * @param {HTMLElement} _el 
         * @param {{ top: number, parent: string }} binding 
         * @param {VNode} vnode 
         */
        unmounted(el: HTMLElement, binding: DirectiveBinding<{ top: number, parent: string }>, vnode: VNode) {

            const uid = (vnode.ref as VNodeNormalizedRefAtom).i.uid

            const parent = (binding.value && binding.value.parent) ? binding.value.parent : (installOption && installOption.parent) ? installOption.parent : ""

            window.removeEventListener('resize', tableStickyConfigs[uid].handleWindowOnResize!)

            const scrollWrapperDom = document.querySelector(parent) || document.body

            scrollWrapperDom.removeEventListener('scroll', tableStickyConfigs[uid].handleScrollWrapperDomOnScroll!)

        }
    })
}

export { InstallOption }
export { install as vue3TableStickyPlugin }


export default {
    install
}