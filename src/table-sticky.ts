
import type { Option, TableStickyConfig, TableStickyConfigs, VNodeNormalizedRefAtom } from "./type"
import { debounce, throttle } from "./utils"

export class TableSticky {

  private tableStickyConfigs: TableStickyConfigs = new Map()

  /**
   * @desc 判断tableheader 节点是否 已经 fixed 
   * @param option 
   * @returns boolean
   */
  private checkTableHeaderElementFixed(option: Option): boolean {
    const tableHeaderElement = this.getTableHeaderElement(option)
    return tableHeaderElement.classList.contains('fixed')
  }
  /**
   * @desc 校验页面是否滚动
   * @param {Option} option 
   * @returns {Boolean}
   */
  private checkScrollElementIsScroll(option: Option): boolean {
    const { scrollElement } = this.getCurrentTableStickyConfig(option)
    return scrollElement.scrollTop > 0
  }

  /**
   * @desc 处理 tableheader fixed 标志
   * @param {Option} option 
   * @param {"add" | "remove"} handleType 
   */
  private handleTableHeaderFixed(option: Option, handleType: "add" | "remove"): void {
    const { tableHeaderElement } = this.getCurrentTableStickyConfig(option)
    tableHeaderElement.classList[handleType]('fixed')
  }

  /**
   * @desc 获取滚动条节点
   * @param {Option} option 
   * @return {HTMLElement}
   */
  private getScrollElement(option: Option): HTMLElement {
    const { binding, installOption } = option
    const scrollName = (binding.value && binding.value.parent) ? binding.value.parent : (installOption && installOption.parent) ? installOption.parent : ""
    return document.querySelector<HTMLElement>(scrollName) || document.body
  }
  /**
   * 获取表头节点
   * @param {Option}option
   * @return {HTMLElement}
   */
  private getTableHeaderElement(option: Option): HTMLElement {
    const { tableElement } = option
    return tableElement.querySelector<HTMLElement>(".el-table__header-wrapper")!
  }
  /**
   * @desc 获取表body节点
   * @param {Option} option 
   * @returns 
   */
  private getTableBodyElement(option: Option): HTMLElement {
    const { tableElement } = option
    return tableElement.querySelector<HTMLElement>(".el-table__body-wrapper")!
  }

  /**
   * @desc 获取当前组件在父组件中的uid
   * @param {Option} option 
   * @returns {Number}
   */
  private getUid(option: Option): string {
    const { vnode } = option
    return String((vnode?.ref as VNodeNormalizedRefAtom).i.uid)
  }

  /**
   * @desc 获取当前uid的所对应的 TableStickyConfig
   * @param {Option} option 
   * @returns {TableStickyConfig | undefined}
   */
  private getCurrentTableStickyConfig(option: Option): TableStickyConfig | undefined {
    const uid = this.getUid(option)
    return this.tableStickyConfigs.get(uid)
  }

  /**
   * @desc 获取当前tableHeader节点距离body的top值
   * @param {Option} option 
   * @returns Number
   */
  private getTableHeaderCurrentTop(option: Option): number {
    const tableHeaderElement = this.getTableHeaderElement(option)
    const tableHeaderElementTop = tableHeaderElement.getBoundingClientRect().top
    return tableHeaderElementTop
  }

  /**
   * @desc 获取tableHeader节点距离body的top值
   * @desc 只有在初始化的时候 才会采用 用户传递进来的值
   * @param {Option} option 
   * @returns 
   */
  private getStickyTopValue(option: Option): number {
    const { binding, installOption } = option
    if (binding.value && typeof binding.value.top === "number") return binding.value.top
    else if (installOption && typeof installOption.top === "number") return installOption.top
    else {
      const tableHeaderElement = this.getTableHeaderElement(option)
      return tableHeaderElement.getBoundingClientRect().top
    }
  }
  /**
   * @desc 初始化 tableStickyConfigs 数据
   * @param {Option} option 
   */
  private initTableStickyConfig(option: Option): void {
    // 获取tableheader节点
    const tableHeaderElement = this.getTableHeaderElement(option)
    const tableBodyElement = this.getTableBodyElement(option)
    const uid = this.getUid(option)
    const scrollElement = this.getScrollElement(option)
    /**
     * @desc 关闭滚动锚定 值有两个 auto 是开启 none 是关闭
     * @link https://www.cnblogs.com/ziyunfei/p/6668101.html
     */
    scrollElement.style.overflowAnchor = "none"
    if (this.tableStickyConfigs.get(uid) === undefined) {
      this.tableStickyConfigs.set(uid, {
        fixedTop: this.getStickyTopValue(option),
        tableHeaderElement,
        // tableheader 初始化的时候距离body的距离 用做 滚动条计算
        tableHeaderOriginalTop: this.getTableHeaderCurrentTop(option),
        tableHeaderOriginalStyle: {
          position: window.getComputedStyle(tableHeaderElement).position,
          top: window.getComputedStyle(tableHeaderElement).top,
          transition: window.getComputedStyle(tableHeaderElement).transition,
          zIndex: window.getComputedStyle(tableHeaderElement).zIndex
        },
        tableBodyElement,
        tableBodyOriginalStyle: {
          marginTop: window.getComputedStyle(tableBodyElement).marginTop
        },
        tableWidth: option.tableElement.getBoundingClientRect().width,
        scrollElement,
        handleScrollElementOnScroll: () => { this.scrollElementOnScroll(option) }
      })


    }
  }

  /**
   * @desc 给当前tableHeader节点固定头设置Fixed样式
   * @param {Option} option 
   */
  private setTableHeaderFixed(option: Option): void {
    const { tableElement } = option
    const { tableHeaderElement, tableBodyElement, fixedTop } = this.getCurrentTableStickyConfig(option)
    const maxZIndex: number = Array.from(tableElement.querySelectorAll("*")).reduce((maxZIndex: number, element: Element) => Math.max(maxZIndex, +window.getComputedStyle(element).zIndex || 0), 0)
    tableHeaderElement.style.position = 'fixed'
    tableHeaderElement.style.zIndex = `${maxZIndex}`
    tableHeaderElement.style.top = fixedTop + 'px'
    tableHeaderElement.style.transition = "top .3s"
    tableBodyElement.style.marginTop = tableHeaderElement.offsetHeight + 'px'
    // 增加 fixed 标记
    this.handleTableHeaderFixed(option, "add")
  }

  /**
   * @desc 移除tableHeader fixed 样式
   * @param {Option} option 
   * @returns { void }
   */
  private removeTableHeaderFixed(option: Option): void {
    const { tableHeaderElement, tableBodyElement, tableBodyOriginalStyle, tableHeaderOriginalStyle } = this.getCurrentTableStickyConfig(option)
    Object.keys(tableHeaderOriginalStyle).forEach(styleKey => {
      const styleValue = tableHeaderOriginalStyle[styleKey]
      tableHeaderElement.style[styleKey] = styleValue
    })
    Object.keys(tableBodyOriginalStyle).forEach(styleKey => {
      const styleValue = tableBodyOriginalStyle[styleKey]
      tableBodyElement.style[styleKey] = styleValue
    })
    // 移除 fixed 标记
    this.handleTableHeaderFixed(option, 'remove')
  }

  /**
  * @desc 处理滚动条滚动的时候
  * @param {Option} option 
  * @returns { void }
  */
  private scrollElementOnScroll = throttle((option) => {
    const { scrollElement, fixedTop, tableHeaderOriginalTop } = this.getCurrentTableStickyConfig(option)
    // 滚动条距离顶部的距离
    const scrollElementTop = scrollElement.scrollTop + scrollElement.getBoundingClientRect().top
    const tableHeaderRealTop = tableHeaderOriginalTop - fixedTop <= 0 ? 0 : tableHeaderOriginalTop - fixedTop
    const isFixed = this.checkTableHeaderElementFixed(option)
    if (scrollElementTop > tableHeaderRealTop) {
      !isFixed && this.setTableHeaderFixed(option)
    } else {
      isFixed && this.removeTableHeaderFixed(option)
    }
  }, 0)

  /**
   * @desc 当页面宽度发生变更的时候 重新设置表头宽度 使其表头宽度和表body宽度保持一直 
   * @desc 不能将表头宽度设置成 table 宽度 有时候表头宽度会小于表宽度
   * @param {Option} option 
   */
  private setTableHeadWidth(option) {
    // 从当前配置中获取 tableBodyElement节点和 tableHeaderElement 节点
    const { tableBodyElement, tableHeaderElement } = this.getCurrentTableStickyConfig(option)
    // 获取表body宽度
    const width = getComputedStyle(tableBodyElement).width
    // 给表头赋值宽度
    tableHeaderElement.style.width = width
  }
  /**
   * @desc 更新TableStickyConfig配置
   * @param {Option} option 
   * @returns { void }
   */
  private updateTableStickyConfig(option: Option): void {
    const uid = this.getUid(option)
    const currentTableStickyConfig = this.getCurrentTableStickyConfig(option)
    this.tableStickyConfigs.set(uid, {
      ...currentTableStickyConfig,
      tableWidth: option.tableElement.getBoundingClientRect().width,
      fixedTop: option.binding.value ? option.binding.value.top : this.getTableHeaderCurrentTop(option),
      tableHeaderOriginalTop: this.getTableHeaderCurrentTop(option)
    })

  }
  /**
   * @desc setTableHeader 防抖版本
   */
  private setTableHeadWidthDebounce = debounce<TableSticky>(this.setTableHeadWidth, 300)
  /**
   * @desc setTableHeaderFixed 防抖版本
   */
  private setTableHeaderFixedDebounce = debounce(this.setTableHeaderFixed, 300)
  /**
   * @desc updateTableStickyConfig 防抖版本
   */
  private updateTableStickyConfigDebounce = debounce(this.updateTableStickyConfig, 300)
  /**
   * @desc 监听 el-table 节点的宽度变化
   * @param {Option} option 
   */
  private handleWatchTableElement(option: Option): void {
    const { tableElement } = option
    this.watchElement(tableElement, option)
  }
  /**
   * @desc 监听可能会影响 el-table-header的节点 
   * @param {HTMLElement} element 
   * @param {Option} option 
   */
  private watchElement(element: HTMLElement, option: Option): void {
    const resizeObserver = new ResizeObserver((entries) => {
      // 获取现在tableWidth
      let currentTableWidth: number
      for (let entry of entries) {
        const tableElement = entry.target as HTMLDivElement
        currentTableWidth = tableElement.getBoundingClientRect().width
      }
      const { tableWidth } = this.getCurrentTableStickyConfig(option)
      // 如果tableWidth发生变化 则重新设置表头宽度
      if (tableWidth !== currentTableWidth) {
        this.setTableHeadWidthDebounce(option)
        // 更新配置
        this.updateTableStickyConfigDebounce(option)
      }
    });
    resizeObserver.observe(element);
  }
  /**
   * @desc 当table mounted 的时候
   * @param {Option} option 
   */
  mounted(option: Option): void {
    // 初始化配置
    this.initTableStickyConfig(option)
    // 获取当前的配置，监听parent节点滚动事件
    const { handleScrollElementOnScroll, scrollElement } = this.getCurrentTableStickyConfig(option)
    scrollElement.addEventListener('scroll', handleScrollElementOnScroll)
    window.onload = () => {
      // 监听el-table自身节点的变化
      this.handleWatchTableElement(option)
    }
  }
  /**
   * @desc 当table updated 的时候
   * @param {Option} option 
   */
  updated(option: Option): void {
    const isFixed = this.checkTableHeaderElementFixed(option)
    // 更新配置
    this.updateTableStickyConfigDebounce(option)
    // 重新给表头定位
    isFixed && this.setTableHeaderFixedDebounce(option)
  }
  /**
    * @desc 当table unmounted 的时候
    * @param {Option} option 
    */
  unmounted(option: Option): void {
    const { handleScrollElementOnScroll, scrollElement } = this.getCurrentTableStickyConfig(option)
    scrollElement.removeEventListener('scroll', handleScrollElementOnScroll)
  }

}