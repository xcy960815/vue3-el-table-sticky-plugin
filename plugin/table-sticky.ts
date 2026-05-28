import { nextTick } from 'vue';

import { ElementPlusTableAdapter } from './adapter';
import { StickyController } from './controller';
import { ScrollContainerResolver } from './scroll-container';
import type { Option, ResolvedStickyOptions, StickyState } from './type';

export class TableStickyPlugin {
  private states = new WeakMap<HTMLElement, StickyState>();
  private tableAdapter = new ElementPlusTableAdapter();
  private scrollContainerResolver = new ScrollContainerResolver();
  private stickyController = new StickyController();

  /**
   * @description 处理单个表格的 Vue 指令 mounted 钩子。
   * @param {Option} option 指令生命周期参数。
   * @returns {void}
   */
  public mounted(option: Option): void {
    nextTick(() => {
      const state = this.createState(option);
      if (!state) return;

      this.states.set(option.tableElement, state);
      this.stickyController.attach(state);
      this.stickyController.requestUpdate(state);
    });
  }

  /**
   * @description 处理单个表格的 Vue 指令 updated 钩子。
   * @param {Option} option 指令生命周期参数。
   * @returns {void}
   */
  public updated(option: Option): void {
    nextTick(() => {
      const state = this.states.get(option.tableElement);
      if (!state || state.disposed) return;

      const options = this.resolveOptions(option);

      if (state.options.scrollTarget !== options.scrollTarget) {
        this.stickyController.dispose(state);
        this.states.delete(option.tableElement);

        const nextState = this.createState(option);
        if (!nextState) return;

        this.states.set(option.tableElement, nextState);
        this.stickyController.attach(nextState);
        this.stickyController.requestUpdate(nextState);
        return;
      }

      this.stickyController.updateOptions(state, options);
    });
  }

  /**
   * @description 处理单个表格的 Vue 指令 unmounted 钩子。
   * @param {Option} option 指令生命周期参数。
   * @returns {void}
   */
  public unmounted(option: Option): void {
    const state = this.states.get(option.tableElement);
    if (!state) return;

    this.stickyController.dispose(state);
    this.states.delete(option.tableElement);
  }

  /**
   * @description 根据指令参数创建吸顶状态。
   * @param {Option} option 指令生命周期参数。
   * @returns {StickyState | undefined} 创建后的吸顶状态；缺少必要 DOM 时返回 undefined。
   */
  private createState(option: Option): StickyState | undefined {
    const tableElements = this.tableAdapter.resolve(option.tableElement);
    if (!tableElements) return undefined;

    const options = this.resolveOptions(option);
    const scrollContext = this.scrollContainerResolver.resolve(
      options.scrollTarget,
      option.tableElement,
    );
    if (!scrollContext) return undefined;

    return this.stickyController.createState(tableElements, scrollContext, options);
  }

  /**
   * @description 将指令参数和安装参数解析为标准化吸顶配置。
   * @param {Option} option 指令生命周期参数。
   * @returns {ResolvedStickyOptions} 标准化后的吸顶配置。
   */
  private resolveOptions(option: Option): ResolvedStickyOptions {
    const bindingValue = option.binding.value;
    const installOption = option.installOption;
    const offsetTop =
      bindingValue?.offsetTop ??
      bindingValue?.top ??
      installOption?.offsetTop ??
      installOption?.top ??
      this.getTableHeaderCurrentTop(option.tableElement);

    return {
      offsetTop,
      scrollTarget:
        bindingValue?.scrollTarget ??
        bindingValue?.parent ??
        installOption?.scrollTarget ??
        installOption?.parent,
      boundary: bindingValue?.boundary ?? installOption?.boundary ?? 'table',
      observe: [
        ...(installOption?.observe ?? []),
        ...(bindingValue?.observe ?? bindingValue?.willBeChangeElementClasses ?? []),
      ],
      strategy: bindingValue?.strategy ?? installOption?.strategy ?? 'auto',
      zIndex: bindingValue?.zIndex ?? installOption?.zIndex ?? 'auto',
      activeClass: bindingValue?.activeClass ?? installOption?.activeClass ?? 'fixed',
    };
  }

  /**
   * @description 读取当前表头顶部坐标，作为兼容旧配置的兜底偏移。
   * @param {HTMLElement} tableElement 表格根元素。
   * @returns {number} 当前表头顶部坐标。
   */
  private getTableHeaderCurrentTop(tableElement: HTMLElement): number {
    const tableHeaderElement = tableElement.querySelector<HTMLElement>('.el-table__header-wrapper');
    return tableHeaderElement?.getBoundingClientRect().top || 0;
  }
}
