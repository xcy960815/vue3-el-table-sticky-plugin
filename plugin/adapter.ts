import type { TableElements } from './type';

const TABLE_HEADER_SELECTOR = '.el-table__header-wrapper';
const TABLE_INNER_WRAPPER_SELECTOR = '.el-table__inner-wrapper';
const TABLE_BODY_SELECTOR = '.el-table__body-wrapper';

export class ElementPlusTableAdapter {
  /**
   * @description 解析吸顶渲染所需的 Element Plus 表格 DOM 节点。
   * @param {HTMLElement} tableElement Element Plus 表格根元素。
   * @returns {TableElements | undefined} 解析后的表格元素；当表格结构不支持时返回 undefined。
   */
  public resolve(tableElement: HTMLElement): TableElements | undefined {
    const tableHeaderElement = tableElement.querySelector<HTMLElement>(TABLE_HEADER_SELECTOR);
    const tableInnerWrapperElement = tableElement.querySelector<HTMLElement>(
      TABLE_INNER_WRAPPER_SELECTOR,
    );
    const tableBodyElement = tableElement.querySelector<HTMLElement>(TABLE_BODY_SELECTOR);

    if (!tableHeaderElement || !tableInnerWrapperElement || !tableBodyElement) {
      this.warn(
        `v-sticky requires Element Plus table nodes: ${TABLE_HEADER_SELECTOR}, ${TABLE_INNER_WRAPPER_SELECTOR}, ${TABLE_BODY_SELECTOR}.`,
      );
      return undefined;
    }

    return {
      tableElement,
      tableHeaderElement,
      tableInnerWrapperElement,
      tableBodyElement,
    };
  }

  /**
   * @description 输出带插件前缀的适配器警告。
   * @param {string} message 警告信息。
   * @returns {void}
   */
  private warn(message: string): void {
    console.warn(`[vue3-el-table-sticky-plugin] ${message}`);
  }
}
