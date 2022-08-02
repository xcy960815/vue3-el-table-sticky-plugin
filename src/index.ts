import type { App, DirectiveBinding, VNode } from "vue"

import type { InstallOption } from "./type"

import { TableSticky } from "./table-sticky"

const install = (app: App, installOption?: InstallOption) => {

    const tableSticky = new TableSticky()

    app.directive('sticky', {
        /**
         * @desc 当被绑定的元素插入到DOM中
         * @param {HTMLElement} tableElement 
         * @param {{ top: number, parent: string }} binding 
         * @param {VNode} vnode 
         */
        mounted(tableElement: HTMLElement, binding: DirectiveBinding<{ top: number, parent: string }>, vnode: VNode) {
            tableSticky.tableMounted({ tableElement, binding, vnode, installOption })
        },
        updated(tableElement: HTMLElement, binding: DirectiveBinding<{ top: number, parent: string }>, vnode: VNode) {
            tableSticky.tableUpdated({ tableElement, binding, vnode, installOption })
        },
        unmounted(tableElement: HTMLElement, binding: DirectiveBinding<{ top: number, parent: string }>, vnode: VNode) {
            tableSticky.tableUnmounted({ tableElement, binding, vnode, installOption })
        }
    })
}

export { InstallOption }

export { install as vue3TableStickyPlugin }

export default {
    install
}