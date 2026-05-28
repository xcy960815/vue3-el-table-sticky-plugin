import type { StickyElementTarget, StickyState } from './type';
import { resolveElementTarget, warn } from './dom';

export class ObserverManager {
  /**
   * @description 绑定滚动、窗口尺寸和监听元素的观察器。
   * @param {StickyState} state 需要观察的吸顶状态。
   * @param {() => void} requestUpdate 用于调度渲染的回调。
   * @param {() => void} refreshLayout 用于重新计算吸顶布局的回调。
   * @returns {void}
   */
  public attach(state: StickyState, requestUpdate: () => void, refreshLayout: () => void): void {
    state.scrollContext.element.style.overflowAnchor = 'none';

    const scrollTarget: HTMLElement | Window = state.scrollContext.isWindow
      ? window
      : state.scrollContext.element;

    scrollTarget.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', refreshLayout);

    state.cleanups.push(() => {
      scrollTarget.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', refreshLayout);
    });

    this.attachTableResizeObserver(state, refreshLayout);
    this.attachWatchedElementObservers(state, refreshLayout);
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
      const element = resolveElementTarget(target, root);

      if (!element) {
        warn(`v-sticky observe target "${target}" did not match any element.`);
        return elements;
      }

      elements.push({ target, element });
      return elements;
    }, []);
  }
}
