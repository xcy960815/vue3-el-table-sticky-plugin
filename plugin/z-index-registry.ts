// 同一页面可能有多张吸顶表头，登记当前处于吸顶状态的表头 z-index，
// 让后进入吸顶的表头自动错开层级，避免多表同时吸顶时同层叠放顺序由 DOM 顺序决定。
const activeStickyHeaders = new Map<HTMLElement, number>();

/**
 * @description 为进入吸顶的表头分配 z-index：以表内推导值为基准，与当前其他吸顶表头重叠时取更高层级。
 * @param {HTMLElement} headerElement 表头元素，用于在释放时注销登记。
 * @param {number} baseZIndex 表内推导出的基准 z-index。
 * @returns {number} 实际分配的 z-index。
 */
export function claimStickyZIndex(headerElement: HTMLElement, baseZIndex: number): number {
  let maxActiveZIndex = 0;

  activeStickyHeaders.forEach((zIndex) => {
    if (zIndex > maxActiveZIndex) maxActiveZIndex = zIndex;
  });

  const zIndex = maxActiveZIndex >= baseZIndex ? maxActiveZIndex + 1 : baseZIndex;
  activeStickyHeaders.set(headerElement, zIndex);

  return zIndex;
}

/**
 * @description 注销吸顶表头的 z-index 登记，应在表头退出吸顶或销毁时调用。
 * @param {HTMLElement} headerElement 表头元素。
 * @returns {void}
 */
export function releaseStickyZIndex(headerElement: HTMLElement): void {
  activeStickyHeaders.delete(headerElement);
}
