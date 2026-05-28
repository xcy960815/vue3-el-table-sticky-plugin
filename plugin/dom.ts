import type { ScrollContext, StickyElementTarget } from './type';
import { isHTMLElement } from './utils';

export function warn(message: string): void {
  console.warn(`[vue3-el-table-sticky-plugin] ${message}`);
}

/**
 * @description 查询元素，并将无效选择器错误转换为插件警告。
 * @param {Document | HTMLElement} root 用于查询的根节点。
 * @param {string} selector 需要解析的 CSS 选择器。
 * @returns {T | null} 匹配到的元素；没有匹配时返回 null。
 */
export function safeQuerySelector<T extends Element>(
  root: Document | HTMLElement,
  selector: string,
): T | null {
  try {
    return root.querySelector<T>(selector);
  } catch {
    warn(`v-sticky selector "${selector}" is not a valid CSS selector.`);
    return null;
  }
}

/**
 * @description 将选择器或 HTMLElement 解析为 HTMLElement。
 * @param {StickyElementTarget} target 选择器或 HTMLElement 目标。
 * @param {Document | HTMLElement} root 当目标是选择器时使用的查询根节点。
 * @returns {HTMLElement | undefined} 解析后的 HTMLElement；目标不存在时返回 undefined。
 */
export function resolveElementTarget(
  target: StickyElementTarget,
  root: Document | HTMLElement = document,
): HTMLElement | undefined {
  if (isHTMLElement(target)) return target;

  const element = safeQuerySelector<HTMLElement>(root, target);
  if (element) return element;

  if (root !== document) {
    return safeQuerySelector<HTMLElement>(document, target) || undefined;
  }

  return undefined;
}

/**
 * @description 获取 window 或元素滚动上下文的可视滚动区域矩形。
 * @param {ScrollContext} scrollContext 当前滚动上下文。
 * @returns {DOMRect} 吸顶几何计算使用的视口矩形。
 */
export function getScrollContextRect(scrollContext: ScrollContext): DOMRect {
  if (!scrollContext.isWindow) {
    return scrollContext.element.getBoundingClientRect();
  }

  return {
    bottom: window.innerHeight,
    height: window.innerHeight,
    left: 0,
    right: window.innerWidth,
    top: 0,
    width: window.innerWidth,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  };
}
