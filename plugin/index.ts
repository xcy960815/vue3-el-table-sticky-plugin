import type { App, DirectiveBinding, VNode } from 'vue';

import type { InstallOption, DirectiveBindingValue } from './type';

import { TableStickyPlugin } from './table-sticky';

/**
 * @description 安装 v-sticky 指令。
 * @param {App<HTMLElement>} app Vue 应用实例。
 * @param {InstallOption | undefined} installOption 全局插件配置。
 * @returns {void}
 */
const install = (app: App<HTMLElement>, installOption?: InstallOption) => {
  const tableStickyPlugin = new TableStickyPlugin();

  app.directive('sticky', {
    /**
     * @desc 当被绑定的元素插入到DOM中
     * @param {HTMLElement} tableElement Element Plus 表格根元素。
     * @param {DirectiveBinding<DirectiveBindingValue | undefined>} binding Vue 指令绑定对象。
     * @param {VNode} vnode Vue 指令所在的 vnode。
     */
    mounted(
      tableElement: HTMLElement,
      binding: DirectiveBinding<DirectiveBindingValue | undefined>,
      vnode: VNode,
    ) {
      tableStickyPlugin.mounted({
        tableElement,
        binding,
        vnode,
        installOption,
      });
    },
    /**
     * @description 指令所在组件的 VNode 更新时调用
     * @param {HTMLElement} tableElement Element Plus 表格根元素。
     * @param {DirectiveBinding<DirectiveBindingValue | undefined>} binding Vue 指令绑定对象。
     * @param {VNode} vnode Vue 指令所在的 vnode。
     */
    updated(
      tableElement: HTMLElement,
      binding: DirectiveBinding<DirectiveBindingValue | undefined>,
      vnode: VNode,
    ) {
      tableStickyPlugin.updated({
        tableElement,
        binding,
        vnode,
        installOption,
      });
    },
    /**
     * @description 指令所在组件的 VNode 及其子 VNode 全部更新后调用
     * @param {HTMLElement} tableElement Element Plus 表格根元素。
     * @param {DirectiveBinding<DirectiveBindingValue | undefined>} binding Vue 指令绑定对象。
     * @param {VNode} vnode Vue 指令所在的 vnode。
     */
    unmounted(
      tableElement: HTMLElement,
      binding: DirectiveBinding<DirectiveBindingValue | undefined>,
      vnode: VNode,
    ) {
      tableStickyPlugin.unmounted({ tableElement, binding, vnode, installOption });
    },
  });
};

export type { InstallOption, DirectiveBindingValue as StickyOptions };

export { install as vue3TableStickyPlugin };

export default {
  install,
};
