import type {
  Option,
  TableStickyConfig,
  TableStickyConfigs,
  VNodeNormalizedRefAtom,
} from "./type";
import { debounce, throttle } from "./utils";

export class TableSticky {
  private tableStickyConfigs: TableStickyConfigs = new Map();
  /**
   * @desc 判断tableheader 节点是否 已经 fixed
   * @param option
   * @returns boolean
   */
  private checkTableHeaderElementFixed(option: Option): boolean {
    const tableHeaderElement = this.getTableHeaderElement(option);
    return tableHeaderElement.classList.contains("fixed");
  }
  /**
   * @desc 处理 tableheader fixed 标志
   * @param {Option} option
   * @param {"add" | "remove"} handleType
   */
  private handleTableHeaderElementFixed(
    option: Option,
    handleType: "add" | "remove"
  ): void {
    const { tableHeaderElement } = this.getCurrentTableStickyConfig(option);
    tableHeaderElement.classList[handleType]("fixed");
  }

  /**
   * @desc 获取滚动条节点
   * @param {Option} option
   * @return {HTMLElement}
   */
  private getScrollElement(option: Option): HTMLElement {
    const { binding, installOption } = option;
    const scrollName =
      binding.value && binding.value.parent
        ? binding.value.parent
        : installOption && installOption.parent
        ? installOption.parent
        : "";
    return document.querySelector<HTMLElement>(scrollName) || document.body;
  }
  /**
   * @desc 获取表头节点
   * @param {Option}option
   * @return {HTMLElement}
   */
  private getTableHeaderElement(option: Option): HTMLElement {
    const { tableElement } = option;
    return tableElement.querySelector<HTMLElement>(
      ".el-table__header-wrapper"
    )!;
  }
  /**
   * @desc 获取表body节点
   * @param {Option} option
   * @returns
   */
  private getTableBodyElement(option: Option): HTMLElement {
    const { tableElement } = option;
    return tableElement.querySelector<HTMLElement>(".el-table__body-wrapper")!;
  }
  /**
   * @desc 获取
   * @param {Option} option
   * @returns {HTMLElement}
   */
  private getElTableTnnerWrapper(option: Option): HTMLElement {
    const { tableElement } = option;
    return tableElement.querySelector<HTMLElement>(".el-table__inner-wrapper")!;
  }
  /**
   * @desc 获取当前组件在父组件中的uid
   * @param {Option} option
   * @returns {Number}
   */
  private getUid(option: Option): string {
    const { vnode } = option;
    return String((vnode?.ref as VNodeNormalizedRefAtom).i.uid);
  }

  /**
   * @desc 获取当前uid的所对应的 TableStickyConfig
   * @param {Option} option
   * @returns {TableStickyConfig | undefined}
   */
  private getCurrentTableStickyConfig(
    option: Option
  ): TableStickyConfig | undefined {
    const uid = this.getUid(option);
    return this.tableStickyConfigs.get(uid);
  }

  /**
   * @desc 获取当前tableHeader节点距离body的top值
   * @param {Option} option
   * @returns Number
   */
  private getTableHeaderCurrentTop(option: Option): number {
    const tableHeaderElement = this.getTableHeaderElement(option);
    // getBoundingClientRect 记录body的top值
    const tableHeaderElementTop =
      tableHeaderElement.getBoundingClientRect().top;
    return tableHeaderElementTop;
  }

  /**
   * @desc 获取dom节点的样式
   * @param {HTMLElement} element
   * @param {keyof CSSStyleDeclaration} styleKey
   * @returns {CSSStyleDeclaration[keyof CSSStyleDeclaration]}
   */
  private getElementStyle<P extends keyof CSSStyleDeclaration>(
    element: HTMLElement,
    styleKey: P
  ): CSSStyleDeclaration[P] {
    return window.getComputedStyle(element)[styleKey];
  }

  /**
   * @desc 获取tableHeader节点距离body的top值
   * @desc 只有在初始化的时候 才会采用 用户传递进来的值
   * @param {Option} option
   * @returns
   */
  private getFixedTop(option: Option): number {
    const { binding, installOption } = option;
    if (binding.value && typeof binding.value.top === "number")
      return binding.value.top;
    else if (installOption && typeof installOption.top === "number")
      return installOption.top;
    else {
      // 如果用户没有设置的话 就采用当前tableHeader节点距离body的top值
      return this.getTableHeaderCurrentTop(option);
    }
  }
  /**
   * @desc 初始化 tableStickyConfigs 数据
   * @param {Option} option
   * @returns {void}
   */
  private initTableStickyConfig(option: Option): void {
    // 获取tableheader节点
    const tableHeaderElement = this.getTableHeaderElement(option);
    const tableInnerWapperElement = this.getElTableTnnerWrapper(option);
    const scrollElement = this.getScrollElement(option);
    /**
     * @desc 关闭滚动锚定 值有两个 auto 是开启 none 是关闭
     * @link https://www.cnblogs.com/ziyunfei/p/6668101.html
     */
    scrollElement.style.overflowAnchor = "none";
    const currentTableStickyConfig = this.getCurrentTableStickyConfig(option);
    if (currentTableStickyConfig === undefined) {
      const initTableStickyConfig: TableStickyConfig = {
        fixedTop: this.getFixedTop(option),
        tableHeaderElement,
        // 记录tableHeaderElement的原始top值
        tableHeaderElementOriginalTop: this.getTableHeaderCurrentTop(option),
        tableHeaderElementOriginalStyle: {
          position: this.getElementStyle(tableHeaderElement, "position"),
          top: this.getElementStyle(tableHeaderElement, "top"),
          transition: this.getElementStyle(tableHeaderElement, "transition"),
          zIndex: this.getElementStyle(tableHeaderElement, "zIndex"),
        },
        tableBodyElement: this.getTableBodyElement(option),
        tableInnerWapperElement,
        tableInnerWapperElementOriginalStyle: {
          marginTop: this.getElementStyle(tableInnerWapperElement, "marginTop"),
        },
        tableWidth: this.getElementStyle(option.tableElement, "width"),
        scrollElement,
        handleScrollElementOnScroll: () => {
          this.scrollElementOnScroll(option);
        },
        resizeObserver: this.handleWatchTableElement(option),
      };
      this.updateTableStickyConfig(option, initTableStickyConfig);
    }
  }

  /**
   * @desc 给当前tableHeader节点固定头设置Fixed样式
   * @param {Option} option
   * @returns {void}
   */
  private setTableHeaderFixed(option: Option): void {
    const { tableElement } = option;
    const { tableHeaderElement, tableInnerWapperElement, fixedTop } =
      this.getCurrentTableStickyConfig(option);
    const maxZIndex: number = Array.from(
      tableElement.querySelectorAll("*")
    ).reduce(
      (maxZIndex: number, element: Element) =>
        Math.max(
          maxZIndex,
          +this.getElementStyle(element as HTMLElement, "zIndex") || 0
        ),
      0
    );
    tableHeaderElement.style.position = "fixed";
    tableHeaderElement.style.zIndex = `${maxZIndex}`;
    tableHeaderElement.style.top = fixedTop + "px";
    tableHeaderElement.style.transition = "top .3s";
    tableInnerWapperElement.style.marginTop =
      tableHeaderElement.offsetHeight + "px";
    // 增加 fixed 标记
    this.handleTableHeaderElementFixed(option, "add");
  }

  /**
   * @desc 移除tableHeader fixed 样式
   * @param {Option} option
   * @returns { void }
   */
  private removeTableHeaderFixed(option: Option): void {
    const {
      tableHeaderElement,
      tableInnerWapperElement,
      tableInnerWapperElementOriginalStyle,
      tableHeaderElementOriginalStyle,
    } = this.getCurrentTableStickyConfig(option);
    Object.keys(tableHeaderElementOriginalStyle).forEach((styleKey) => {
      const styleValue = tableHeaderElementOriginalStyle[styleKey];
      tableHeaderElement.style[styleKey] = styleValue;
    });
    Object.keys(tableInnerWapperElementOriginalStyle).forEach((styleKey) => {
      const styleValue = tableInnerWapperElementOriginalStyle[styleKey];
      tableInnerWapperElement.style[styleKey] = styleValue;
    });

    // 移除 fixed 标记
    this.handleTableHeaderElementFixed(option, "remove");
  }

  /**
   * @desc 处理滚动条滚动的时候
   * @param {Option} option
   * @returns { void }
   */
  private scrollElementOnScroll = throttle((option) => {
    const { scrollElement, fixedTop, tableHeaderElementOriginalTop } =
      this.getCurrentTableStickyConfig(option);
    // 滚动条距离body顶部的距离
    const scrollElementTop = scrollElement.scrollTop; //+ scrollElement.getBoundingClientRect().top;
    // 如果用户设置的fixedTop大于tableHeaderElement的原始top值 那么直接让tableHeader在原来的位置fixed
    const tableHeaderfixedTopValue =
      tableHeaderElementOriginalTop - fixedTop <= 0
        ? 0
        : // 获取滚动条可以滚动的最大距离
          tableHeaderElementOriginalTop - fixedTop;

    // 判断当前tableHeader是否已经被fixed
    const isFixed = this.checkTableHeaderElementFixed(option);
    if (scrollElementTop > tableHeaderfixedTopValue) {
      !isFixed && this.setTableHeaderFixed(option);
    } else {
      isFixed && this.removeTableHeaderFixed(option);
    }
  }, 0);

  /**
   * @desc 当页面宽度发生变更的时候 重新设置表头宽度 使其表头宽度和表body宽度保持一直
   * @desc 不能将表头宽度设置成 table 宽度 有时候表头宽度会小于表宽度
   * @param {Option} option
   */
  private setTableHeadWidth(option) {
    // 从当前配置中获取 tableBodyElement节点和 tableHeaderElement 节点
    const { tableBodyElement, tableHeaderElement } =
      this.getCurrentTableStickyConfig(option);
    // 获取表body宽度
    const width = this.getElementStyle(tableBodyElement, "width");
    // 给表头赋值宽度
    tableHeaderElement.style.width = width;
  }
  /**
   * @desc 更新TableStickyConfig配置
   * @param {Option} option
   * @returns { void }
   */
  private updateTableStickyConfig(
    option: Option,
    tableStickyConfigs:
      | { [C in keyof TableStickyConfig]?: TableStickyConfig[C] }
      | TableStickyConfig
  ): void {
    const uid = this.getUid(option);
    const currentTableStickyConfig =
      this.getCurrentTableStickyConfig(option) || undefined;
    const newTableStickyConfig = Object.assign(
      {},
      currentTableStickyConfig,
      tableStickyConfigs
    );
    this.tableStickyConfigs.set(uid, newTableStickyConfig);
  }
  /**
   * @desc setTableHeaderWidth 防抖版本
   */
  private setTableHeadWidthDebounce = debounce<TableSticky>(
    this.setTableHeadWidth,
    300
  );
  /**
   * @desc setTableHeaderFixed 防抖版本
   */
  private setTableHeaderFixedDebounce = debounce<TableSticky>(
    this.setTableHeaderFixed,
    300
  );
  /**
   * @desc updateTableStickyConfig 防抖版本
   */
  private updateTableStickyConfigDebounce = debounce<TableSticky>(
    this.updateTableStickyConfig,
    300
  );
  /**
   * @desc 监听 el-table 节点的宽度变化
   * @param {Option} option
   */
  private handleWatchTableElement(option: Option): ResizeObserver {
    const { tableElement } = option;
    const resizeObserver = new ResizeObserver((entries) => {
      // 获取现在tableWidth
      let currentTableWidth: string;
      for (const entry of entries) {
        const tableElement = entry.target as HTMLDivElement;
        currentTableWidth = this.getElementStyle(tableElement, "width");
      }
      const { tableWidth } = this.getCurrentTableStickyConfig(option);

      // 如果tableWidth发生变化 则重新设置表头宽度
      if (tableWidth !== currentTableWidth) {
        const tableStickyConfigs: {
          [C in keyof TableStickyConfig]?: TableStickyConfig[C];
        } = {
          // fixedTop: this.getTableHeaderCurrentTop(option),
          tableHeaderElementOriginalTop: this.getTableHeaderCurrentTop(option),
          tableWidth: this.getElementStyle(option.tableElement, "width"),
        };
        // 更新配置
        this.updateTableStickyConfigDebounce(option, tableStickyConfigs);

        this.setTableHeadWidthDebounce(option);
      }
    });
    resizeObserver.observe(tableElement);
    return resizeObserver;
  }

  /**
   * @desc 当table mounted 的时候
   * @param {Option} option
   */
  mounted(option: Option): void {
    // 初始化配置
    this.initTableStickyConfig(option);
    // 获取当前的配置，监听parent节点滚动事件
    const { handleScrollElementOnScroll, scrollElement } =
      this.getCurrentTableStickyConfig(option);
    scrollElement.addEventListener("scroll", handleScrollElementOnScroll);
  }
  /**
   * @desc 当table updated 的时候
   * @param {Option} option
   */
  updated(option: Option): void {
    const isFixed = this.checkTableHeaderElementFixed(option);
    // updated 的时候 执行需要更新 fixed
    const tableStickyConfigs: {
      [C in keyof TableStickyConfig]?: TableStickyConfig[C];
    } = {
      fixedTop: this.getFixedTop(option),
      tableHeaderElementOriginalTop: this.getTableHeaderCurrentTop(option),
    };

    // 更新配置
    this.updateTableStickyConfigDebounce(option, tableStickyConfigs);
    // 重新给表头定位
    isFixed && this.setTableHeaderFixedDebounce(option);
  }
  /**
   * @desc 当table unmounted 的时候
   * @param {Option} option
   */
  unmounted(option: Option): void {
    const { handleScrollElementOnScroll, scrollElement, resizeObserver } =
      this.getCurrentTableStickyConfig(option);
    scrollElement.removeEventListener("scroll", handleScrollElementOnScroll);
    resizeObserver.disconnect();
  }
}
