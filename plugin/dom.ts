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
 * @param {Document | HTMLElement} root 当目标是选择器且未提供锚点时使用的查询根节点。
 * @param {HTMLElement | undefined} anchor 表格根元素；提供后选择器按表格就近解析。
 * @returns {HTMLElement | undefined} 解析到的 HTMLElement；目标不存在时返回 undefined。
 */
export function resolveElementTarget(
  target: StickyElementTarget,
  root: Document | HTMLElement = document,
  anchor?: HTMLElement,
): HTMLElement | undefined {
  if (isHTMLElement(target)) return target;

  if (anchor) {
    return resolveSelectorNearTable(target, anchor);
  }

  const element = safeQuerySelector<HTMLElement>(root, target);
  if (element) return element;

  if (root !== document) {
    return safeQuerySelector<HTMLElement>(document, target) || undefined;
  }

  return undefined;
}

/**
 * @description 以表格为锚点解析选择器：优先匹配表格自身或祖先，其次在文档候选中取与表格共享最近公共祖先的元素，避免多表格页面里每个表格都命中同一个全局首匹配元素。
 * @param {string} selector 需要解析的 CSS 选择器。
 * @param {HTMLElement} anchor 表格根元素。
 * @returns {HTMLElement | undefined} 解析到的元素；选择器无效或无匹配时返回 undefined。
 */
function resolveSelectorNearTable(selector: string, anchor: HTMLElement): HTMLElement | undefined {
  let resolved: HTMLElement | undefined;

  try {
    const ancestorMatch = anchor.closest<HTMLElement>(selector);
    const matches = Array.from(document.querySelectorAll<HTMLElement>(selector));
    resolved = ancestorMatch ?? pickNearestMatch(matches, anchor);
  } catch {
    warn(`v-sticky selector "${selector}" is not a valid CSS selector.`);
    return undefined;
  }

  return resolved;
}

/**
 * @description 在候选元素中选取与锚点共享最近公共祖先的元素；无公共祖先时保持文档顺序兜底。
 * @param {HTMLElement[]} matches 文档中所有命中的候选元素。
 * @param {HTMLElement} anchor 表格根元素。
 * @returns {HTMLElement | undefined} 距离锚点最近的候选元素；无候选时返回 undefined。
 */
function pickNearestMatch(matches: HTMLElement[], anchor: HTMLElement): HTMLElement | undefined {
  if (matches.length === 0) return undefined;

  const distanceByNode = new Map<Node, number>();
  let node: Node | null = anchor;
  let distance = 0;

  while (node) {
    distanceByNode.set(node, distance);
    distance += 1;
    node = node.parentNode;
  }

  let nearest: HTMLElement | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const match of matches) {
    let commonNode: Node | null = match;

    while (commonNode && !distanceByNode.has(commonNode)) {
      commonNode = commonNode.parentNode;
    }

    const commonDistance = commonNode
      ? (distanceByNode.get(commonNode) as number)
      : Number.POSITIVE_INFINITY;

    if (commonDistance < nearestDistance) {
      nearest = match;
      nearestDistance = commonDistance;
    }
  }

  return nearest;
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
