import type { App, DirectiveBinding, VNode } from 'vue';

import type { InstallOption, DirectiveBindingValue } from './type';

import { TableStickyPlugin } from './table-sticky-plugin';

const install = (app: App, installOption?: InstallOption) => {
  const tableStickyPlugin = new TableStickyPlugin();

  app.directive('sticky', {
    /**
     * @desc 当被绑定的元素插入到DOM中
     * @param {HTMLElement} tableElement
     * @param {{ top: number, parent: string }} binding
     * @param {VNode} vnode
     */
    mounted(
      tableElement: HTMLElement,
      binding: DirectiveBinding<DirectiveBindingValue>,
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
     * @param tableElement {HTMLElement}
     * @param binding  {{ top: number, parent: string }}
     * @param vnode  {VNode}
     */
    updated(
      tableElement: HTMLElement,
      binding: DirectiveBinding<DirectiveBindingValue>,
      vnode: VNode,
    ) {
      tableStickyPlugin.updated({
        tableElement,
        binding,
        vnode,
        installOption,
      });
    },
    // /**
    //  * @description 指令所在组件的 VNode 及其子 VNode 全部更新后调用
    //  * @param tableElement {HTMLElement}
    //  * @param binding {{ top: number, parent: string }}
    //  * @param vnode {VNode}
    //  */
    // unmounted(
    //   tableElement: HTMLElement,
    //   binding: DirectiveBinding<DirectiveBindingValue>,
    //   vnode: VNode
    // ) {
    //   // tableSticky.unmounted({ tableElement, binding, vnode, installOption });
    // },
  });
};

export { InstallOption };

export { install as vue3TableStickyPlugin };

export default {
  install,
};
