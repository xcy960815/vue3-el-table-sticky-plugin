import type { ResolvedStickyOptions, StickyState, TableElements } from './type';
import { StickyGeometry } from './geometry';
import { ObserverManager } from './observer';
import { StickyRenderer } from './renderer';

export class StickyController {
  private geometry = new StickyGeometry();
  private observerManager = new ObserverManager();
  private renderer = new StickyRenderer();

  /**
   * @description 为单个表格实例创建吸顶运行时状态。
   * @param {TableElements} tableElements 已解析的 Element Plus 表格元素。
   * @param {StickyState['scrollContext']} scrollContext 用于吸顶计算的滚动上下文。
   * @param {ResolvedStickyOptions} options 已解析的吸顶配置。
   * @returns {StickyState} 创建后的吸顶状态。
   */
  public createState(
    tableElements: TableElements,
    scrollContext: StickyState['scrollContext'],
    options: ResolvedStickyOptions,
  ): StickyState {
    const placeholderElement = this.renderer.createPlaceholder();
    const state: StickyState = {
      ...tableElements,
      scrollContext,
      boundaryElement: tableElements.tableElement,
      options,
      styles: this.renderer.captureStyles(tableElements, scrollContext.element),
      phase: 'inactive',
      addedFixedClass: false,
      appliedActiveClass: options.activeClass,
      headerOffsetWithinTable: 0,
      placeholderElement,
      rafId: null,
      watchedElementObservers: [],
      cleanups: [],
      disposed: false,
    };

    state.boundaryElement = this.geometry.resolveBoundaryElement(state);
    this.geometry.refreshHeaderOffset(state);

    return state;
  }

  /**
   * @description 为吸顶状态绑定观察器和滚动监听。
   * @param {StickyState} state 需要绑定的吸顶状态。
   * @returns {void}
   */
  public attach(state: StickyState): void {
    this.renderer.mountPlaceholder(state);
    this.observerManager.attach(
      state,
      () => this.requestUpdate(state),
      () => this.refreshLayout(state),
    );
  }

  /**
   * @description 应用更新后的吸顶配置，并刷新受影响的观察器。
   * @param {StickyState} state 需要更新的吸顶状态。
   * @param {ResolvedStickyOptions} options 新的已解析吸顶配置。
   * @returns {void}
   */
  public updateOptions(state: StickyState, options: ResolvedStickyOptions): void {
    const shouldRefreshWatchedElements = !this.isSameTargetList(
      state.options.observe,
      options.observe,
    );
    const shouldRefreshBoundary = state.options.boundary !== options.boundary;

    state.options = options;

    if (shouldRefreshBoundary) {
      state.boundaryElement = this.geometry.resolveBoundaryElement(state);
    }

    if (shouldRefreshWatchedElements) {
      this.observerManager.disconnectWatchedElementObservers(state);
      this.observerManager.attachWatchedElementObservers(state, () => this.refreshLayout(state));
    }

    this.refreshLayout(state);
  }

  /**
   * @description 重新计算布局相关几何信息，并调度一次渲染。
   * @param {StickyState} state 需要刷新的吸顶状态。
   * @returns {void}
   */
  public refreshLayout(state: StickyState): void {
    if (state.disposed) return;

    this.geometry.refreshHeaderOffset(state);
    this.requestUpdate(state);
  }

  /**
   * @description 在下一帧调度一次吸顶渲染。
   * @param {StickyState} state 需要渲染的吸顶状态。
   * @returns {void}
   */
  public requestUpdate(state: StickyState): void {
    if (state.disposed || state.rafId !== null) return;

    state.rafId = requestAnimationFrame(() => {
      state.rafId = null;
      this.render(state);
    });
  }

  /**
   * @description 清理监听器、观察器、待执行帧以及已应用的 DOM 改动。
   * @param {StickyState} state 需要销毁的吸顶状态。
   * @returns {void}
   */
  public dispose(state: StickyState): void {
    state.disposed = true;

    if (state.rafId !== null) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }

    this.renderer.reset(state);
    this.renderer.restoreScrollElementStyles(state);
    this.observerManager.disconnectWatchedElementObservers(state);
    state.cleanups.forEach((cleanup) => cleanup());
    state.cleanups = [];
    state.placeholderElement.remove();
  }

  /**
   * @description 测量并渲染当前吸顶阶段。
   * @param {StickyState} state 需要渲染的吸顶状态。
   * @returns {void}
   */
  private render(state: StickyState): void {
    if (state.disposed) return;

    const measurement = this.geometry.measure(state);
    this.renderer.render(state, measurement);
  }

  /**
   * @description 按引用和顺序比较两个目标列表。
   * @param {unknown[]} left 第一个目标列表。
   * @param {unknown[]} right 第二个目标列表。
   * @returns {boolean} 当两个列表按相同顺序包含相同目标时返回 true。
   */
  private isSameTargetList(left: unknown[], right: unknown[]): boolean {
    return left.length === right.length && left.every((target, index) => target === right[index]);
  }
}
