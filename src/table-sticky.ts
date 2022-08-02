
import type { Option, TableStickyConfig, TableStickyConfigs, VNodeNormalizedRefAtom } from "./type"
import elementResizeDetectorMaker from 'element-resize-detector'
import { debounce, throttle } from "./utils"
import { nextTick } from "vue"

export class TableSticky {

  elementResizeDetector = elementResizeDetectorMaker({ callOnAdd: false })

  tableStickyConfigs: TableStickyConfigs = new Map()

  /**
   * @desc 判断tableheader 节点是否 已经 fixed 
   * @param option 
   * @returns boolean
   */
  checkTableHeaderElementFixed(option: Option): boolean {
    const { tableHeaderElement } = this.getCurrentTableStickyConfig(option)
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
   * 获取当前节点前面所有的兄弟节点
   * @param {HTMLElement} element
   * @param {Array<HTMLElement>} previousSiblings
   * @param {(previousSibling: HTMLElement) => boolean} condition
   */
  private getPreviousElementSiblings(element: HTMLElement, positionPreviousSiblings: Array<HTMLElement>): Array<HTMLElement> {
    const previousElement = element.previousElementSibling as HTMLElement
    if (previousElement) {
      const previousElementPosition = window.getComputedStyle(previousElement).position
        ;["sticky"].includes(previousElementPosition) && positionPreviousSiblings.push(previousElement)
      this.getPreviousElementSiblings(previousElement, positionPreviousSiblings)
    }
    return positionPreviousSiblings
  }
  /**
   * 获取当前组件在父组件中的uid
   * @param {Option} option 
   * @returns {Number}
   */
  private getUid(option: Option): string {
    const { vnode } = option
    return String((vnode?.ref as VNodeNormalizedRefAtom).i.uid)
  }
  /**
   * @desc
   * @param {Option} option 
   * @returns 
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
    const { tableElement } = option
    const positionPreviousSiblings = this.getPreviousElementSiblings(tableElement, [])
    return positionPreviousSiblings.reduce((minTop: number, element: HTMLElement) => {
      const elementRect = element.getBoundingClientRect()
      if (elementRect.top + elementRect.height > minTop) return elementRect.top + elementRect.height
    }, 0)
  }

  handleWatchPositionPreviousSiblings(option: Option) {
    const { tableElement } = option
    const positionPreviousSiblings = this.getPreviousElementSiblings(tableElement, [])
    positionPreviousSiblings.forEach(element => {
      const resizeObserver = new ResizeObserver(entries => {
        this.handleTableHeaderFixed(option, "remove")
        // 重新设置表头宽度 100% 
        this.setTableHeadWidth(option)
        // 重新给表头定位
        this.setTableHeaderFixed(option)
      });
      resizeObserver.observe(element);
    })

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
      fixedTop = this.getTableHeaderCurrentTop(option)
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
        tableHeaderElement,
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
        handleScrollElementOnScroll: () => { this.scrollElementOnScroll(option) },
        handleWindowOrElementOnResize: () => {
          this.setTableHeadWidth(option)
          this.setTableHeaderFixed(option)
        },
      })
    }


  }

  /**
   * @desc 给当前tableHeader节点固定头设置Fixed样式
   * @param {Number} fixedTop 
   * @param {Option} option 
   */
  private setTableHeaderFixed(option: Option): void {
    if (!this.checkTableHeaderElementFixed(option)) {
      const { tableElement } = option
      const fixedTop = this.getFixedTop(option)
      const { tableHeaderElement, tableBodyElement } = this.getCurrentTableStickyConfig(option)
      const maxZIndex: number = Array.from(tableElement.querySelectorAll("*")).reduce((maxZIndex: number, element: Element) => Math.max(maxZIndex, +window.getComputedStyle(element).zIndex || 0), 0)
      this.handleTableHeaderFixed(option, "add")
      tableHeaderElement.style.position = 'fixed'
      tableHeaderElement.style.zIndex = `${maxZIndex}`
      tableHeaderElement.style.top = fixedTop + 'px'
      tableHeaderElement.style.transition = "top .3s"
      tableBodyElement.style.marginTop = tableHeaderElement.offsetHeight + 'px'
    }
  }

  /**
   * @desc 移除tableHeader fixed 样式
   * @param {Option} option 
   * @returns { void }
   */
  private removeTableHeaderFixed(option: Option): void {
    const { tableHeaderElement, tableBodyElement, tableBodyOriginalStyle, tableHeaderOriginalStyle } = this.getCurrentTableStickyConfig(option)
    if (this.checkTableHeaderElementFixed(option)) {
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
  }

  /**
  * @desc 处理滚动条滚动的时候
  * @param {Option} option 
  * @returns { void }
  */
  private scrollElementOnScroll = throttle((option) => {
    const { scrollElement } = this.getCurrentTableStickyConfig(option)
    const fixedTop = this.getFixedTop(option)
    // 距离body的top值
    const scrollElementTop = scrollElement.getBoundingClientRect().top
    // 滚动条距离顶部的距离
    const scrollElementOffsetTop = scrollElement.scrollTop + scrollElementTop
    const tableCurrentTop = this.getTableHeaderCurrentTop(option)
    // 实时获取表头距离body的距离
    const tableHeaderOffsetTop = tableCurrentTop - fixedTop <= 0 ? 0 : tableCurrentTop - fixedTop
    if (scrollElementOffsetTop > tableHeaderOffsetTop) {
      this.setTableHeaderFixed(option)
    } else {
      this.removeTableHeaderFixed(option)
    }
  }, 0)

  /**
   * @desc 当页面宽度发生变更的时候 重新设置表头宽度 使其表头宽度和表body宽度保持一直 
   * @desc 不能将表头宽度设置成 table 宽度 有时候表头宽度会小于表宽度
   * @param {Option} option 
   */
  private setTableHeadWidth = debounce((option) => {
    const { tableBodyElement, tableHeaderElement } = this.getCurrentTableStickyConfig(option)
    const width = getComputedStyle(tableBodyElement).width
    tableHeaderElement.style.width = width
  }, 100)


  /**
   * @desc 监听 el-table 节点的宽度变化
   * @param {Option} option 
   */
  private handleWatchTableElementToChangeTableHeader(option: Option): void {
    const { tableElement } = option
    const resizeObserver = new ResizeObserver(entries => {
      console.log('handleWatchTableElementToChangeTableHeader', entries);
      this.handleTableHeaderFixed(option, "remove")
      // 重新设置表头宽度 100% 
      this.setTableHeadWidth(option)
      // 重新给表头定位
      this.setTableHeaderFixed(option)
    });
    resizeObserver.observe(tableElement);
  }

  /**
   * @desc 当table mounted 的时候
   * @param {Option} option 
   */
  tableMounted(option: Option): void {

    // 初始化配置
    this.initTableStickyConfig(option)

    const { handleWindowOrElementOnResize, handleScrollElementOnScroll, scrollElement } = this.getCurrentTableStickyConfig(option)

    window.addEventListener('resize', handleWindowOrElementOnResize)

    scrollElement.addEventListener('scroll', handleScrollElementOnScroll)

    // 监听当前el-table节点
    this.handleWatchTableElementToChangeTableHeader(option)

    this.handleWatchPositionPreviousSiblings(option)

  }

  /**
   * @desc 当table updated 的时候
   * @param {Option} option 
   */
  tableUpdated = debounce((option: Option): void => {
    // 重新设置表头宽度
    this.setTableHeadWidth(option)
    // 更新表头位置
    this.setTableHeaderFixed(option)
  }, 100)

  /**
    * @desc 当table unmounted 的时候
    * @param {Option} option 
    */
  tableUnmounted(option: Option): void {
    const { handleScrollElementOnScroll, handleWindowOrElementOnResize, scrollElement } = this.getCurrentTableStickyConfig(option)
    window.removeEventListener('resize', handleWindowOrElementOnResize)
    scrollElement.removeEventListener('scroll', handleScrollElementOnScroll)
  }

}