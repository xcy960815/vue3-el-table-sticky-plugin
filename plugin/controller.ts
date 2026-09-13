import type { ResolvedStickyOptions, StickyState, TableElements } from './type';
import { warn } from './dom';
import { StickyGeometry } from './geometry';
import { ObserverManager } from './observer';
import { ScrollContainerResolver } from './scroll-container';
import { StickyRenderer } from './renderer';

export class StickyController {
  private geometry = new StickyGeometry();
  private observerManager = new ObserverManager();
  private renderer = new StickyRenderer();
  private scrollContainerResolver: ScrollContainerResolver;

  constructor(scrollContainerResolver?: ScrollContainerResolver) {
    this.scrollContainerResolver = scrollContainerResolver ?? new ScrollContainerResolver();
  }

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
      styles: this.renderer.captureStyles(tableElements),
      phase: 'inactive',
      addedFixedClass: false,
      appliedActiveClass: options.activeClass,
      headerOffsetWithinTable: 0,
      cachedZIndex: null,
      appliedZIndex: null,
      placeholderElement,
      rafId: null,
      watchedElementObservers: [],
      cleanups: [],
      disposed: false,
    };

    state.boundaryElement = this.geometry.resolveBoundaryElement(state);
    this.geometry.refreshHeaderOffset(state);
    this.warnReservedStrategy(options);
    this.warnIfTableScrollsInternally(state);

    return state;
  }

  /**
   * @description strategy 'sticky' 为预留配置，当前引擎仅支持 fixed 定位渲染，显式提示避免静默忽略。
   * @param {ResolvedStickyOptions} options 已解析的吸顶配置。
   * @returns {void}
   */
  private warnReservedStrategy(options: ResolvedStickyOptions): void {
    if (options.strategy === 'sticky') {
      warn(
        "v-sticky strategy 'sticky' is reserved but not implemented yet; falling back to the fixed rendering engine.",
      );
    }
  }

  /**
   * @description 检测表格 body 是否在内部滚动（通常是给 el-table 设置了 height），此时吸顶跟随外层容器，内部滚动不会触发表头吸顶。
   * @param {StickyState} state 吸顶状态。
   * @returns {void}
   */
  private warnIfTableScrollsInternally(state: StickyState): void {
    const wrappers = [state.tableBodyElement];
    const scrollbarWrap = state.tableBodyElement.querySelector<HTMLElement>('.el-scrollbar__wrap');
    if (scrollbarWrap) wrappers.push(scrollbarWrap);

    const scrollsInternally = wrappers.some((element) => {
      const overflowY = window.getComputedStyle(element).overflowY;
      return /(auto|scroll)/.test(overflowY) && element.scrollHeight > element.clientHeight;
    });

    if (scrollsInternally) {
      warn(
        'v-sticky detected an internally scrolling table body (usually caused by a fixed height on el-table); the sticky header follows the outer scroll container instead.',
      );
    }
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
    state.cachedZIndex = null;
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
    this.observerManager.disconnectWatchedElementObservers(state);
    this.detachListeners(state);
    state.placeholderElement.remove();
  }

  /**
   * @description 测量并渲染当前吸顶阶段；渲染前校验滚动上下文是否因 DOM 搬移而失效。
   * @param {StickyState} state 需要渲染的吸顶状态。
   * @returns {void}
   */
  private render(state: StickyState): void {
    if (state.disposed) return;

    if (this.revalidateScrollContext(state)) return;

    const measurement = this.geometry.measure(state);
    this.renderer.render(state, measurement);
  }

  /**
   * @description 校验表格是否仍在已绑定的滚动容器内；表格被搬移到其他容器时自动重新解析并迁移滚动监听，搬移前只会静默失效。
   * @param {StickyState} state 吸顶状态。
   * @returns {boolean} 本轮渲染是否已被重解析流程接管（需要跳过常规测量）。
   */
  private revalidateScrollContext(state: StickyState): boolean {
    if (state.scrollContext.element.contains(state.tableElement)) return false;

    this.renderer.reset(state);

    if (!state.tableElement.isConnected) return true;

    const nextContext = this.scrollContainerResolver.resolve(
      state.options.scrollTarget,
      state.tableElement,
    );
    if (!nextContext || nextContext.element === state.scrollContext.element) return true;

    this.detachListeners(state);
    state.scrollContext = nextContext;
    state.boundaryElement = this.geometry.resolveBoundaryElement(state);
    state.cachedZIndex = null;
    this.attach(state);

    return true;
  }

  /**
   * @description 执行并清空当前状态的监听清理回调（滚动、resize、ResizeObserver 与 overflow-anchor 占用）。
   * @param {StickyState} state 吸顶状态。
   * @returns {void}
   */
  private detachListeners(state: StickyState): void {
    state.cleanups.forEach((cleanup) => cleanup());
    state.cleanups = [];
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
