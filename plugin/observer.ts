import type { StickyElementTarget, StickyState } from './type';
import { resolveElementTarget, warn } from './dom';

interface OverflowAnchorUsage {
  count: number;
  original: string;
}

// 同一滚动容器可能被多个表格共享，引用计数避免各表格的样式快照互相覆盖或提前恢复。
const overflowAnchorUsages = new WeakMap<HTMLElement, OverflowAnchorUsage>();

export class ObserverManager {
  /**
   * @description 绑定滚动、窗口尺寸和监听元素的观察器。
   * @param {StickyState} state 需要观察的吸顶状态。
   * @param {() => void} requestUpdate 用于调度渲染的回调。
   * @param {() => void} refreshLayout 用于重新计算吸顶布局的回调。
   * @returns {void}
   */
  public attach(state: StickyState, requestUpdate: () => void, refreshLayout: () => void): void {
    this.acquireOverflowAnchor(state.scrollContext.element);

    const scrollTarget: HTMLElement | Window = state.scrollContext.isWindow
      ? window
      : state.scrollContext.element;

    scrollTarget.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', refreshLayout);

    state.cleanups.push(() => {
      scrollTarget.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', refreshLayout);
      this.releaseOverflowAnchor(state.scrollContext.element);
    });

    this.attachTableResizeObserver(state, refreshLayout);
    this.attachWatchedElementObservers(state, refreshLayout);
    this.attachReparentObserver(state, requestUpdate);
  }

  /**
   * @description 监听全局 DOM 变动，兜底捕捉表格被搬移出当前滚动容器的情况。纯搬移不改变尺寸，不会触发 ResizeObserver，也不会派发滚动事件，若不主动检查，换容器后的吸顶会静默失效；回调只做轻量 contains 检查，确认失联后才调度重解析。
   * @param {StickyState} state 需要观察的吸顶状态。
   * @param {() => void} requestUpdate 用于调度渲染（内含滚动上下文重解析）的回调。
   * @returns {void}
   */
  private attachReparentObserver(state: StickyState, requestUpdate: () => void): void {
    const mutationObserver = new MutationObserver(() => {
      if (!state.disposed && !state.scrollContext.element.contains(state.tableElement)) {
        requestUpdate();
      }
    });

    mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
    state.cleanups.push(() => mutationObserver.disconnect());
  }

  /**
   * @description 观察会影响吸顶几何信息的表格尺寸变化。
   * @param {StickyState} state 需要观察表格尺寸的吸顶状态。
   * @param {() => void} refreshLayout 用于重新计算吸顶布局的回调。
   * @returns {void}
   */
  public attachTableResizeObserver(state: StickyState, refreshLayout: () => void): void {
    const observer = new ResizeObserver(refreshLayout);

    observer.observe(state.tableElement);
    observer.observe(state.tableHeaderElement);
    state.tableResizeObserver = observer;
    state.cleanups.push(() => observer.disconnect());
  }

  /**
   * @description 观察配置中会影响吸顶布局的外部元素。
   * @param {StickyState} state 包含监听目标的吸顶状态。
   * @param {() => void} refreshLayout 用于重新计算吸顶布局的回调。
   * @returns {void}
   */
  public attachWatchedElementObservers(state: StickyState, refreshLayout: () => void): void {
    state.watchedElementObservers = this.resolveWatchedElements(state).map(
      ({ target, element }) => {
        const observer = new ResizeObserver(refreshLayout);

        observer.observe(element);
        return { target, element, observer };
      },
    );
  }

  /**
   * @description 断开所有监听元素的 ResizeObserver 实例。
   * @param {StickyState} state 包含监听观察器的吸顶状态。
   * @returns {void}
   */
  public disconnectWatchedElementObservers(state: StickyState): void {
    state.watchedElementObservers.forEach(({ observer }) => {
      observer.disconnect();
    });
    state.watchedElementObservers = [];
  }

  /**
   * @description 将配置的 observe 目标解析为已存在的元素。
   * @param {StickyState} state 包含监听目标和滚动上下文的吸顶状态。
   * @returns {Array<{ target: StickyElementTarget; element: HTMLElement }>} 解析后的监听元素。
   */
  private resolveWatchedElements(
    state: StickyState,
  ): Array<{ target: StickyElementTarget; element: HTMLElement }> {
    const root = state.scrollContext.isWindow ? document : state.scrollContext.element;

    return state.options.observe.reduce<
      Array<{ target: StickyElementTarget; element: HTMLElement }>
    >((elements, target) => {
      const element = resolveElementTarget(target, root, state.tableElement);

      if (!element) {
        warn(`v-sticky observe target "${target}" did not match any element.`);
        return elements;
      }

      elements.push({ target, element });
      return elements;
    }, []);
  }

  /**
   * @description 为滚动容器启用 overflow-anchor: none；按引用计数共享同一容器。
   * @param {HTMLElement} element 滚动容器元素。
   * @returns {void}
   */
  private acquireOverflowAnchor(element: HTMLElement): void {
    const usage = overflowAnchorUsages.get(element);

    if (usage) {
      usage.count += 1;
      return;
    }

    overflowAnchorUsages.set(element, { count: 1, original: element.style.overflowAnchor });
    element.style.overflowAnchor = 'none';
  }

  /**
   * @description 释放滚动容器的 overflow-anchor 占用，最后一个释放者恢复原始内联样式。
   * @param {HTMLElement} element 滚动容器元素。
   * @returns {void}
   */
  private releaseOverflowAnchor(element: HTMLElement): void {
    const usage = overflowAnchorUsages.get(element);
    if (!usage) return;

    usage.count -= 1;

    if (usage.count <= 0) {
      element.style.overflowAnchor = usage.original;
      overflowAnchorUsages.delete(element);
    }
  }
}
