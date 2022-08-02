
import type { Option, TableStickyConfig, TableStickyConfigs, VNodeNormalizedRefAtom } from "./type"
import { debounce, throttle } from "./utils"

export class TableSticky {

  tableStickyConfigs: TableStickyConfigs = new Map()

  /**
   * @desc 判断tableheader 节点是否 已经 fixed 
   * @param option 
   * @returns boolean
   */
  checkTableHeaderElementFixed(option: Option): boolean {
    const { tableElement } = option
    const tableHeaderElement = tableElement.querySelector<HTMLElement>(".el-table__header-wrapper")!
    return tableHeaderElement.classList.contains('fixed')
  }

  /**
   * @desc 处理 tableheader fixed 标志
   * @param {Option} option 
   * @param {"add" | "remove"} handleType 
   */
  handleTableHeaderFixed(option: Option, handleType: "add" | "remove"): void {
    const { tableHeaderElement } = this.getCurrentTableStickyConfig(option)
    tableHeaderElement.classList[handleType]('fixed')
  }

  /**
   * @desc 获取当前节点前面所有的兄弟节点
   * @param {HTMLElement} element
   * @param {Array<HTMLElement>} previousSiblings
   * @param {(previousSibling: HTMLElement) => boolean} condition
   */
  private getPreviousElementSiblings(element: HTMLElement, positionPreviousSiblings: Array<HTMLElement>): Array<HTMLElement> {
    const previousElement = element.previousElementSibling as HTMLElement
    if (previousElement) {
      const previousElementPosition = window.getComputedStyle(previousElement).position
      if (["sticky"].includes(previousElementPosition)) positionPreviousSiblings.push(previousElement)
      this.getPreviousElementSiblings(previousElement, positionPreviousSiblings)
    }
    return positionPreviousSiblings
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
  private getTableHeaderCurrentTop(option: Option, type: "init" | "current"): number {
    const { tableElement } = option
    const tableHeaderElement = tableElement.querySelector<HTMLElement>(".el-table__header-wrapper")!
    if (type === "init") {
      return tableHeaderElement.getBoundingClientRect().top
    } else {
      const positionPreviousSiblings = this.getPreviousElementSiblings(tableElement, [])
      if (positionPreviousSiblings.length > 0) {
        return positionPreviousSiblings.reduce((minTop: number, element: HTMLElement) => {
          const elementRect = element.getBoundingClientRect()
          if (elementRect.top + elementRect.height > minTop) return elementRect.top + elementRect.height
        }, 0)
      } else {
        return tableHeaderElement.getBoundingClientRect().top
      }
    }
  }

  /**
   * @desc 获取tableHeader节点距离body的top值
   * @param {Option} option 
   * @returns 
   */
  private getFixedTop(option: Option): number {
    let fixedTop: number = 0
    const { binding, installOption } = option
    if (binding.value && binding.value.top) {
      // 用户在指令使用处加了 top值的时候
      fixedTop = binding.value.top
    } else if (installOption && installOption.top) {
      // 用户在使用处没有加top值 在 初始化的时候加值的时候
      fixedTop = installOption.top
    } else {
      fixedTop = this.getTableHeaderCurrentTop(option, "current")
    }
    return fixedTop
  }

  /**
   * @desc 获取滚动条节点
   * @param {Option} option 
   * @returns 
   */
  private getScrollElement(option: Option): HTMLElement {
    const { binding, installOption } = option
    const scrollName = (binding.value && binding.value.parent) ? binding.value.parent : (installOption && installOption.parent) ? installOption.parent : ""
    return document.querySelector<HTMLElement>(scrollName) || document.body
  }

  /**
   * 初始化 tableStickyConfigs 数据
   * @param {Option} option 
   */
  initTableStickyConfig(option: Option): void {
    const { tableElement } = option
    // 获取tableheader节点
    const tableHeaderElement = tableElement.querySelector<HTMLElement>(".el-table__header-wrapper")!
    const tableBodyElement = tableElement.querySelector<HTMLElement>('.el-table__body-wrapper')!
    const uid = this.getUid(option)

    if (this.tableStickyConfigs.get(uid) === undefined) {
      this.tableStickyConfigs.set(uid, {
        fixedTop: this.getFixedTop(option),
        tableHeaderElement,
        // tableheader 初始化的时候距离body的距离 用做 滚动条计算
        tableHeaderOriginalTop: this.getTableHeaderCurrentTop(option, "init"),
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
        scrollElement: this.getScrollElement(option),
        handleScrollElementOnScroll: () => { this.scrollElementOnScroll(option) }
      })
    }
  }

  /**
   * @desc 给当前tableHeader节点固定头设置Fixed样式
   * @param {Number} fixedTop 
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
    this.handleTableHeaderFixed(option, "add")
  }

  /**
   * @desc 移除tableHeader fixed 样式
   * @param {Option} option 
   * @returns { void }
   */
  private removeTableHeaderFixed(option: Option): void {
    const { tableHeaderElement, tableBodyElement, tableBodyOriginalStyle, tableHeaderOriginalStyle } = this.getCurrentTableStickyConfig(option)
    // 设置成原来的样式
    this.handleTableHeaderFixed(option, 'remove')
    Object.keys(tableHeaderOriginalStyle).forEach(styleKey => {
      const styleValue = tableHeaderOriginalStyle[styleKey]
      tableHeaderElement.style[styleKey] = styleValue
    })
    Object.keys(tableBodyOriginalStyle).forEach(styleKey => {
      const styleValue = tableBodyOriginalStyle[styleKey]
      tableBodyElement.style[styleKey] = styleValue
    })
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
    const { tableBodyElement, tableHeaderElement } = this.getCurrentTableStickyConfig(option)
    const width = getComputedStyle(tableBodyElement).width
    tableHeaderElement.style.width = width
  }
  /**
   * @desc setTableHeader 防抖版本
   */
  private setTableHeadWidthDebounce = debounce(this.setTableHeadWidth, 300)
  /**
   * @desc setTableHeaderFixed 的防抖版本
   */
  private setTableHeaderFixedDebounce = debounce(this.setTableHeaderFixed, 300)

  /**
   * @desc 监听 el-table 节点的宽度变化
   * @param {Option} option 
   */
  private handleWatchTableElement(option: Option): void {
    const { tableElement } = option
    this.watchElement(tableElement, option)
  }

  /**
   * @desc 监听上面的兄弟节点
   * @param {Option} option 
   */
  private handleWatchPreviousSiblings(option: Option) {
    const { tableElement } = option
    const positionPreviousSiblings = this.getPreviousElementSiblings(tableElement, [])
    positionPreviousSiblings.forEach(element => {
      this.watchElement(element, option)
    })
  }
  /**
   * @desc 监听可能会影响 el-table-header的节点 
   * @param {HTMLElement} element 
   * @param {Option} option 
   */
  private watchElement(element: HTMLElement, option: Option): void {
    const resizeObserver = new ResizeObserver(() => {
      const isFixed = this.checkTableHeaderElementFixed(option)
      // 只有 表头 样式已经fixed的情况下 才会重新设置表头样式
      // 重新设置表头宽度 100% 
      isFixed && this.setTableHeadWidthDebounce(option)
      // 重新给表头定位
      isFixed && this.setTableHeaderFixedDebounce(option)
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
    const { handleScrollElementOnScroll, scrollElement } = this.getCurrentTableStickyConfig(option)
    scrollElement.addEventListener('scroll', handleScrollElementOnScroll)
    // 监听当前el-table节点
    this.handleWatchTableElement(option)
    // 监听 当前el-table 前面的兄弟节点
    this.handleWatchPreviousSiblings(option)
  }

  /**
   * @desc 当table updated 的时候
   * @param {Option} option 
   */
  updated(option: Option): void {
    const isFixed = this.checkTableHeaderElementFixed(option)
    // 只有 表头 样式已经fixed的情况下 才会重新设置表头样式
    // 重新设置表头宽度 100% 
    isFixed && this.setTableHeadWidthDebounce(option)
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