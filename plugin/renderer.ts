import type { StickyMeasurement, StickyState, StyleSnapshot, TableElements } from './type';

const DEFAULT_FIXED_CLASS_NAME = 'fixed';

export class StickyRenderer {
  /**
   * @description 创建表头 fixed 后用于保持布局高度的占位元素。
   * @returns {HTMLDivElement} 占位元素。
   */
  public createPlaceholder(): HTMLDivElement {
    const placeholder = document.createElement('div');
    placeholder.setAttribute('data-v-sticky-placeholder', '');
    placeholder.style.display = 'none';
    placeholder.style.height = '0px';
    return placeholder;
  }

  /**
   * @description 捕获取消吸顶时需要恢复的内联样式。
   * @param {TableElements} tableElements 已解析的表格元素。
   * @param {HTMLElement} scrollElement 样式可能被修改的滚动元素。
   * @returns {StyleSnapshot} 内联样式快照。
   */
  public captureStyles(tableElements: TableElements, scrollElement: HTMLElement): StyleSnapshot {
    return {
      header: {
        left: tableElements.tableHeaderElement.style.left,
        position: tableElements.tableHeaderElement.style.position,
        right: tableElements.tableHeaderElement.style.right,
        top: tableElements.tableHeaderElement.style.top,
        transition: tableElements.tableHeaderElement.style.transition,
        width: tableElements.tableHeaderElement.style.width,
        zIndex: tableElements.tableHeaderElement.style.zIndex,
      },
      placeholder: {
        display: '',
        height: '',
      },
      scrollElement: {
        overflowAnchor: scrollElement.style.overflowAnchor,
      },
    };
  }

  /**
   * @description 当占位元素尚未挂载时，将其插入到表头后方。
   * @param {StickyState} state 包含表头和占位元素的吸顶状态。
   * @returns {void}
   */
  public mountPlaceholder(state: StickyState): void {
    if (state.placeholderElement.parentElement) return;
    state.tableHeaderElement.after(state.placeholderElement);
  }

  /**
   * @description 根据测量出的吸顶阶段应用 DOM 样式。
   * @param {StickyState} state 需要渲染的吸顶状态。
   * @param {StickyMeasurement} measurement 几何引擎生成的测量结果。
   * @returns {void}
   */
  public render(state: StickyState, measurement: StickyMeasurement): void {
    if (measurement.phase === 'inactive') {
      this.reset(state);
      return;
    }

    this.mountPlaceholder(state);
    state.placeholderElement.style.display = 'block';
    state.placeholderElement.style.height = `${measurement.headerHeight}px`;

    const headerStyle = state.tableHeaderElement.style;
    headerStyle.position = 'fixed';
    headerStyle.left = `${measurement.left}px`;
    headerStyle.right = 'auto';
    headerStyle.top = `${measurement.top}px`;
    headerStyle.transition = 'top .16s ease';
    headerStyle.width = `${measurement.width}px`;
    headerStyle.zIndex = `${measurement.zIndex}`;

    const activeClass = state.options.activeClass || DEFAULT_FIXED_CLASS_NAME;
    if (!state.tableHeaderElement.classList.contains(activeClass)) {
      state.tableHeaderElement.classList.add(activeClass);
      state.addedFixedClass = true;
      state.appliedActiveClass = activeClass;
    }

    state.phase = measurement.phase;
  }

  /**
   * @description 移除吸顶样式，并将表头恢复到自然布局。
   * @param {StickyState} state 需要重置的吸顶状态。
   * @returns {void}
   */
  public reset(state: StickyState): void {
    if (state.phase === 'inactive' && !state.addedFixedClass) return;

    Object.assign(state.tableHeaderElement.style, state.styles.header);
    state.placeholderElement.style.display = 'none';
    state.placeholderElement.style.height = '0px';

    if (state.addedFixedClass) {
      state.tableHeaderElement.classList.remove(state.appliedActiveClass);
      state.addedFixedClass = false;
    }

    state.phase = 'inactive';
  }

  /**
   * @description 恢复滚动元素上被修改的内联样式。
   * @param {StickyState} state 包含滚动元素样式快照的吸顶状态。
   * @returns {void}
   */
  public restoreScrollElementStyles(state: StickyState): void {
    Object.assign(state.scrollContext.element.style, state.styles.scrollElement);
  }
}
