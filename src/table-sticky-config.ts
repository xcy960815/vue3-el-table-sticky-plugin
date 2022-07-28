
import type { Option, TableSticky, TableStickyConfigs, VNodeNormalizedRefAtom } from "./type"

import elementResizeDetectorMaker from 'element-resize-detector'

import { debounce, throttle } from "./utils"

export const tableStickyConfigs: TableStickyConfigs = {}

export const tableSticky: TableSticky = {

  /**
   * 初始化 tableStickyConfigs 数据
   * @param {Option} option 
   */
  initTableStickyConfig(option) {

    const { binding, installOption, el, vnode } = option

    const tableHeaderWrapperDom = el.querySelector<HTMLElement>(".el-table__header-wrapper")!

    const tableBodyWrapperDom = el.querySelector<HTMLElement>('.el-table__body-wrapper')!

    // const tableHeaderWrapperDomOffsettop = tableHeaderWrapperDom.getBoundingClientRect().top

    let top: number = 0


    if (binding.value && binding.value.top) {

      // if (binding.value.top >= tableHeaderWrapperDomOffsettop) {

      //   // 如果用户设置的值高于tableHeader距离body的top值 就使用 tableHeader距离body的top值
      //   top = tableHeaderWrapperDomOffsettop

      // } else {

      //   top = binding.value.top

      // }

      top = binding.value.top

    } else if (installOption && installOption.top) {

      // if (installOption.top >= tableHeaderWrapperDomOffsettop) {

      //   top = tableHeaderWrapperDomOffsettop

      // } else {

      //   top = installOption.top

      // }

      top = installOption.top

    } else {

      // 所有带定位的兄弟节点
      const positionPreviousSiblings: Array<HTMLElement> = []

      // 获取当前节点前面的兄弟节点
      tableSticky.getPositionPreviousElementSiblings(el, positionPreviousSiblings, (previousSiblingElement) => {
        // 获取当前节点的position属性
        const position = window.getComputedStyle(previousSiblingElement).position
        return ["sticky"].includes(position)
      })

      let maxTop: number = 0

      if (positionPreviousSiblings && positionPreviousSiblings.length) {
        positionPreviousSiblings.forEach((element) => {
          const elementRect = element.getBoundingClientRect()
          if (elementRect.top + elementRect.height > maxTop) {
            maxTop = elementRect.top + elementRect.height
          }
        })
      }
      top = maxTop
    }

    const parent = (binding.value && binding.value.parent) ? binding.value.parent : (installOption && installOption.parent) ? installOption.parent : ""

    // 滚动的节点 如果不传递参数就是body
    const scrollWrapperDom = document.querySelector<HTMLElement>(parent) || document.body

    const uid = (vnode?.ref as VNodeNormalizedRefAtom).i.uid

    if (tableStickyConfigs[uid] === undefined) {

      tableStickyConfigs[uid] = {
        top,
        parent,
        /**
         * 用于存放滚动容器的监听scroll事件的方法
         */
        handleScrollWrapperDomOnScroll() {

          tableSticky.handleScrollWrapperDomOnScroll(option)
        },
        /**
         * 用于存放页面resize后重新计算tablehead宽度 和 更新tableheader位置的方法
         */
        handleWindowOnResize() {

          // 更新配置
          tableSticky.updateTableStickyConfig({ ...option, eventType: "resize" })

          // 重新设置表头宽度 100% 没问题
          tableSticky.setTableHeadWrapperDomWidth(option)

          // 可能是 updateTableStickyConfig 里面牵扯到一些io操作 是宏任务 所以这里也得使用一个宏任务控制代码的执行顺序
          // 更新表头位置
          setTimeout(() => {
            tableSticky.setTableHeaderStyleFixed({ ...option, eventType: "resize" })
          }, 0)

        },

        tableHeaderWrapperDom,

        tableHeaderWrapperDomRect: {

          top: tableHeaderWrapperDom.getBoundingClientRect().top,

          height: tableHeaderWrapperDom.offsetHeight

        },

        tableBodyWrapperDom,

        scrollWrapperDom,

        scrollWrapperRect: {
          top: scrollWrapperDom.getBoundingClientRect().top,
          height: 0
        }
      }
    }

    // 当window resize时 重新计算设置表头宽度，并将监听函数存入 监听函数对象中，方便移除监听事件
    window.addEventListener('resize', tableStickyConfigs[uid].handleWindowOnResize)

    // 给滚动容器加scroll监听事件。并将监听函数存入 监听函数对象中，方便移除监听事件
    scrollWrapperDom.addEventListener('scroll', tableStickyConfigs[uid].handleScrollWrapperDomOnScroll)
  },

  /**
   * 更新 tableStickyConfigs 数据
   * @param {Option} option 
   */
  updateTableStickyConfig: debounce(function (option) {

    const { el, vnode, binding, installOption } = option

    // 所有带定位的兄弟节点
    const positionPreviousSiblings: Array<HTMLElement> = []

    // 获取当前节点前面的兄弟节点
    tableSticky.getPositionPreviousElementSiblings(el, positionPreviousSiblings, (previousSiblingElement) => {
      // 获取当前节点的position属性
      const position = window.getComputedStyle(previousSiblingElement).position
      return ["sticky"].includes(position)
    })

    let maxTop: number = 0

    if (positionPreviousSiblings && positionPreviousSiblings.length) {
      positionPreviousSiblings.forEach((element) => {
        const elementRect = element.getBoundingClientRect()
        if (elementRect.top + elementRect.height > maxTop) {
          maxTop = elementRect.top + elementRect.height
        }
      })
    }

    const tableHeaderWrapperDom = el.querySelector<HTMLElement>(".el-table__header-wrapper")!

    const top = (binding.value && binding.value.top) ? binding.value.top < maxTop ? maxTop : binding.value.top : (installOption && installOption.top) ? installOption.top < maxTop ? maxTop : installOption.top : maxTop

    const uid = (vnode?.ref as VNodeNormalizedRefAtom).i.uid

    // 更新表头 「应该」距离body的top值
    tableStickyConfigs[uid].top = top

    // 更新表头的top值
    tableStickyConfigs[uid].tableHeaderWrapperDomRect.top = top

    // 更新表头的height 值
    tableStickyConfigs[uid].tableHeaderWrapperDomRect.height = tableHeaderWrapperDom.getBoundingClientRect().height

  }, 0),

  /**
   * @desc 给当前tableHeader节点固定头设置Fixed样式
   * @param {Number} fixedTop 
   * @param {Option} option 
   */
  setTableHeaderStyleFixed(option) {

    const { vnode, el, eventType } = option

    const uid = (vnode?.ref as VNodeNormalizedRefAtom).i.uid

    const { tableHeaderWrapperDom, tableBodyWrapperDom, top: fixedTop } = tableStickyConfigs[uid]

    if (eventType && eventType === "resize") {
      tableHeaderWrapperDom.classList.remove('fixed')
    }


    //  是否已经添加 fixed 定位了
    const isFixed = tableHeaderWrapperDom.classList.contains('fixed')

    if (!isFixed) {

      // 获取 当前自定义指令节点中 最大的zIndex
      const maxZIndex: number = Array.from(el.querySelectorAll("*")).reduce((maxZIndex: number, element: Element) => Math.max(maxZIndex, +window.getComputedStyle(element).zIndex || 0), 0)

      tableHeaderWrapperDom.classList.add('fixed')

      tableHeaderWrapperDom.style.position = 'fixed'

      tableHeaderWrapperDom.style.zIndex = `${maxZIndex}`

      tableHeaderWrapperDom.style.top = fixedTop + 'px'

      tableHeaderWrapperDom.style.transition = "all .3s"

      // 表头设置成 fixed 造成表头脱离文档流 给 tableBodyWrapperDom 节点加上表头的高度
      tableBodyWrapperDom.style.marginTop = tableHeaderWrapperDom.offsetHeight + 'px'
    }

  },

  /**
   * @desc 给固定头取消样式
   * @param {Option} option 
   * @returns { void }
   */
  removeTableHeaderStyleFixed(option) {

    const { vnode } = option

    const uid = (vnode?.ref as VNodeNormalizedRefAtom).i.uid

    const { tableHeaderWrapperDom, tableBodyWrapperDom } = tableStickyConfigs[uid]

    if (tableHeaderWrapperDom.classList.contains('fixed')) {

      tableHeaderWrapperDom.classList.remove('fixed')

      tableHeaderWrapperDom.style.position = 'static'

      tableHeaderWrapperDom.style.top = '0'

      tableHeaderWrapperDom.style.zIndex = '0'

      tableHeaderWrapperDom.style.transition = "none"

      tableBodyWrapperDom.style.marginTop = '0'
    }

  },

  /**
  * @desc 判断滚动的时候 tableHeader是否达到 吸顶的位置
  * @param {Option} option 
  * @returns { void }
  */
  handleScrollWrapperDomOnScroll: throttle(function (option) {

    const { vnode } = option

    const uid = (vnode?.ref as VNodeNormalizedRefAtom).i.uid

    const { scrollWrapperDom, tableHeaderWrapperDomRect: { top: tableHeaderWrapperDomTop, height: tableHeaderWrapperDomHeight }, top: fixedTop } = tableStickyConfigs[uid]

    // 距离body的top值
    const scrollWrapperDomTop = scrollWrapperDom.getBoundingClientRect().top

    // 滚动条距离顶部的距离
    const scrollWrapperDomOffsetTop = scrollWrapperDom.scrollTop

    // 如果用户设置的top值大于=当前tableheader节点距离顶部的距离的时候
    if (tableHeaderWrapperDomTop <= fixedTop) {

      tableSticky.setTableHeaderStyleFixed(option)

    } else {

      if (scrollWrapperDomOffsetTop + scrollWrapperDomTop > tableHeaderWrapperDomTop - tableHeaderWrapperDomHeight - fixedTop) {

        // 如果表头 「 向下 」 滚动到『 父容器 』顶部了,fixed定位
        tableSticky.setTableHeaderStyleFixed(option)

      } else {

        tableSticky.removeTableHeaderStyleFixed(option)

      }
    }
    // 节流时间最大设置为50 毫秒 再大的话 就不流畅了
  }, 50),
  /**
   * 获取所有的上级兄弟节点
   */
  getPositionPreviousElementSiblings(element, previousSiblings, condition) {
    const previousElementSibling = element.previousElementSibling as HTMLElement
    if (previousElementSibling) {
      condition(previousElementSibling) && previousSiblings.push(previousElementSibling)
      tableSticky.getPositionPreviousElementSiblings(previousElementSibling, previousSiblings, condition)
    }
  },

  /**
   * @desc 当页面宽度发生变更的时候 重新设置表头宽度 使其表头宽度和表body宽度保持一直 
   * @desc 不能将表头宽度设置成 table 宽度 有时候表头宽度会小于表宽度
   * @param {Option} option 
   */
  setTableHeadWrapperDomWidth: debounce(function (option) {

    const { vnode } = option

    const uid = (vnode?.ref as VNodeNormalizedRefAtom).i.uid

    const { tableBodyWrapperDom, tableHeaderWrapperDom } = tableStickyConfigs[uid]

    const width = getComputedStyle(tableBodyWrapperDom).width

    tableHeaderWrapperDom.style.width = width

  }, 100),

  /**
   * @desc 监听 「 当前 」 节点的宽度变化 重新设置表头宽度
   * @param {Option} option 
   */
  watched(option) {
    const { el, vnode } = option
    const elementResizeDetector = elementResizeDetectorMaker()
    const uid = (vnode?.ref as VNodeNormalizedRefAtom).i.uid
    // @ts-ignore
    elementResizeDetector.listenTo(el, () => tableStickyConfigs[uid].handleWindowOnResize())
  }
}