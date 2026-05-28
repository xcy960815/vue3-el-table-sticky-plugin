import type { StickyMeasurement, StickyState } from './type';
import { getScrollContextRect, resolveElementTarget, warn } from './dom';

export class StickyGeometry {
  /**
   * @description 刷新表头在表格内部的自然偏移。
   * @param {StickyState} state 需要刷新表头偏移的吸顶状态。
   * @returns {void}
   */
  public refreshHeaderOffset(state: StickyState): void {
    const wasStuck = state.phase !== 'inactive';

    if (wasStuck) {
      const styles = state.tableHeaderElement.style;
      styles.position = state.styles.header.position;
      styles.left = state.styles.header.left;
      styles.right = state.styles.header.right;
      styles.top = state.styles.header.top;
      styles.width = state.styles.header.width;
    }

    const tableRect = state.tableElement.getBoundingClientRect();
    const headerRect = state.tableHeaderElement.getBoundingClientRect();
    state.headerOffsetWithinTable = headerRect.top - tableRect.top;
  }

  /**
   * @description 解析控制吸顶释放的边界元素。
   * @param {StickyState} state 包含边界配置的吸顶状态。
   * @returns {HTMLElement} 吸顶测量使用的边界元素。
   */
  public resolveBoundaryElement(state: StickyState): HTMLElement {
    const boundary = state.options.boundary;

    if (boundary === 'table') return state.tableElement;
    if (boundary === 'scroll-container') return state.scrollContext.element;

    const root = state.scrollContext.isWindow ? document : state.scrollContext.element;
    const element = resolveElementTarget(boundary, root);

    if (!element) {
      warn(`v-sticky boundary selector "${boundary}" did not match any element.`);
      return state.tableElement;
    }

    return element;
  }

  /**
   * @description 测量当前吸顶阶段和渲染坐标。
   * @param {StickyState} state 需要测量的吸顶状态。
   * @returns {StickyMeasurement} 当前吸顶测量结果。
   */
  public measure(state: StickyState): StickyMeasurement {
    const tableRect = state.tableElement.getBoundingClientRect();
    const boundaryRect = state.boundaryElement.getBoundingClientRect();
    const scrollRect = getScrollContextRect(state.scrollContext);
    const offsetTop = this.resolveOffsetTop(state);
    const stickyTop = scrollRect.top + offsetTop;
    const headerNaturalTop = tableRect.top + state.headerOffsetWithinTable;
    const headerHeight = state.tableHeaderElement.offsetHeight;
    const bodyRect = state.tableBodyElement.getBoundingClientRect();
    const width = bodyRect.width || tableRect.width;
    const left = bodyRect.left || tableRect.left;
    const releaseTop = boundaryRect.bottom - headerHeight;

    if (headerNaturalTop >= stickyTop) {
      return this.createMeasurement(state, 'inactive', offsetTop, headerNaturalTop, left, width);
    }

    if (releaseTop <= stickyTop) {
      return this.createMeasurement(state, 'released', offsetTop, releaseTop, left, width);
    }

    return this.createMeasurement(state, 'stuck', offsetTop, stickyTop, left, width);
  }

  /**
   * @description 解析配置的吸顶顶部偏移。
   * @param {StickyState} state 包含偏移配置的吸顶状态。
   * @returns {number} 相对当前滚动视口顶部的数值偏移。
   */
  public resolveOffsetTop(state: StickyState): number {
    const offsetTop = state.options.offsetTop;

    if (typeof offsetTop === 'function') {
      return offsetTop();
    }

    return offsetTop;
  }

  /**
   * @description 创建完整的吸顶测量对象。
   * @param {StickyState} state 用于推导高度和 z-index 的吸顶状态。
   * @param {StickyMeasurement['phase']} phase 当前吸顶阶段。
   * @param {number} offsetTop 数值化后的吸顶偏移。
   * @param {number} top 表头顶部坐标。
   * @param {number} left 表头左侧坐标。
   * @param {number} width 表头宽度。
   * @returns {StickyMeasurement} 吸顶测量对象。
   */
  private createMeasurement(
    state: StickyState,
    phase: StickyMeasurement['phase'],
    offsetTop: number,
    top: number,
    left: number,
    width: number,
  ): StickyMeasurement {
    return {
      phase,
      offsetTop,
      top,
      left,
      width,
      headerHeight: state.tableHeaderElement.offsetHeight,
      zIndex: this.resolveZIndex(state),
    };
  }

  /**
   * @description 解析吸顶表头使用的 z-index。
   * @param {StickyState} state 包含 z-index 配置的吸顶状态。
   * @returns {number} 数值化后的 z-index。
   */
  private resolveZIndex(state: StickyState): number {
    if (typeof state.options.zIndex === 'number') {
      return state.options.zIndex;
    }

    return this.getMaxZIndex(state.tableElement) + 1;
  }

  /**
   * @description 查找表格内部最大的数值 z-index。
   * @param {HTMLElement} tableElement 表格根元素。
   * @returns {number} 表格后代元素中最大的数值 z-index。
   */
  private getMaxZIndex(tableElement: HTMLElement): number {
    return Array.from(tableElement.querySelectorAll('*')).reduce((maxZIndex, element) => {
      const zIndex = Number(window.getComputedStyle(element as HTMLElement).zIndex);
      return Math.max(maxZIndex, Number.isFinite(zIndex) ? zIndex : 0);
    }, 0);
  }
}
