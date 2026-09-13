import type { ScrollContext, StickyScrollTarget } from './type';
import { isHTMLElement } from './utils';
import { warn } from './dom';

export class ScrollContainerResolver {
  /**
   * @description 解析配置的滚动目标，或推断最近的滚动父级。
   * @param {StickyScrollTarget | undefined} target 配置的滚动目标。
   * @param {HTMLElement} tableElement 用于推断滚动父级的表格根元素。
   * @returns {ScrollContext | undefined} 解析后的滚动上下文；目标无效时返回 undefined。
   */
  public resolve(
    target: StickyScrollTarget | undefined,
    tableElement: HTMLElement,
  ): ScrollContext | undefined {
    if (!target) {
      return this.resolveNearestScrollParent(tableElement);
    }

    if (target === window) {
      return {
        element: this.getDocumentScrollElement(),
        isWindow: true,
      };
    }

    if (isHTMLElement(target)) {
      if (!target.contains(tableElement)) {
        warn('v-sticky scrollTarget element must contain the table element.');
        return undefined;
      }

      return {
        element: target,
        isWindow: false,
      };
    }

    if (typeof target !== 'string') {
      warn('v-sticky scrollTarget must be a selector, HTMLElement, or window.');
      return undefined;
    }

    const element = this.resolveSelectorTarget(target, tableElement);
    if (!element) {
      warn(
        `v-sticky scrollTarget selector "${target}" did not match any element that contains the table.`,
      );
      return undefined;
    }

    return {
      element,
      isWindow: false,
    };
  }

  /**
   * @description 将选择器解析为当前表格所在的最近祖先。滚动容器必须包含表格才能参与吸顶计算，凡包含表格的匹配元素必然是其祖先，closest 命中即同时保证了包含关系与就近性，避免页面存在多个同名滚动容器时误命中外层容器。
   * @param {string} target 滚动容器选择器。
   * @param {HTMLElement} tableElement 当前表格根元素。
   * @returns {HTMLElement | null} 解析到的滚动容器元素；无匹配祖先时返回 null。
   */
  private resolveSelectorTarget(target: string, tableElement: HTMLElement): HTMLElement | null {
    try {
      return tableElement.closest<HTMLElement>(target);
    } catch {
      warn(`v-sticky selector "${target}" is not a valid CSS selector.`);
      return null;
    }
  }

  /**
   * @description 查找最近一个 overflow-y 可形成滚动容器的祖先元素。
   * @param {HTMLElement} tableElement 表格根元素。
   * @returns {ScrollContext} 最近的滚动上下文；找不到时回退到文档滚动元素。
   */
  private resolveNearestScrollParent(tableElement: HTMLElement): ScrollContext {
    let element = tableElement.parentElement;

    while (element && element !== document.body && element !== document.documentElement) {
      const style = window.getComputedStyle(element);
      const overflowY = style.overflowY;
      const canScroll = /(auto|scroll|overlay)/.test(overflowY);

      if (canScroll) {
        return {
          element,
          isWindow: false,
        };
      }

      element = element.parentElement;
    }

    return {
      element: this.getDocumentScrollElement(),
      isWindow: true,
    };
  }

  /**
   * @description 获取文档级滚动元素。
   * @returns {HTMLElement} 文档滚动元素。
   */
  private getDocumentScrollElement(): HTMLElement {
    return (document.scrollingElement || document.documentElement) as HTMLElement;
  }
}
