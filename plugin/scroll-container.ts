import type { ScrollContext, StickyScrollTarget } from './type';
import { isHTMLElement } from './utils';
import { safeQuerySelector, warn } from './dom';

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
      return {
        element: target,
        isWindow: false,
      };
    }

    if (typeof target !== 'string') {
      warn('v-sticky scrollTarget must be a selector, HTMLElement, or window.');
      return undefined;
    }

    const element = safeQuerySelector<HTMLElement>(document, target);
    if (!element) {
      warn(`v-sticky scrollTarget selector "${target}" did not match any element.`);
      return undefined;
    }

    return {
      element,
      isWindow: false,
    };
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
