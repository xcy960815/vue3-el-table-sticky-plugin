import type { Option, TableSticky } from "./type"

/**
 * @desc 防抖函数
 * @param {Function} fn 
 * @param {Number} delay 
 * @param {Boolean} immediate 
 * @returns Function
 */
export const debounce = (fn: (option: Option) => void, delay: number, immediate?: boolean) => {
    let timer: number = 0
    return function (option: Option) {

        const that = this as TableSticky
        if (timer) {
            clearTimeout(timer)    //直接清除定时器（关键）
            timer = 0
        }
        if (immediate) {
            let rightNow = !timer
            timer = window.setTimeout(() => {
                timer = 0
            }, delay)
            if (rightNow) {
                fn.call(that, option)
            }
        } else {
            timer = window.setTimeout(() => {
                fn.call(that, option)
            }, delay)
        }
    }
}
/**
 * @desc  截流函数(时间戳) 
 * @param {Function} fn 
 * @param {Number} delay 
 * @returns 
 */
export const throttle = (fn: (option: Option) => void, delay: number,) => {
    // 使用闭包返回一个函数并且用到闭包函数外面的变量previous
    let previous = 0;
    return function (option: Option) {
        const that = this as TableSticky;
        // const args = arguments;
        const now = new Date().getTime();
        if (now - previous > delay) {
            fn.call(that, option);
            previous = now; //当方法执行完成之后 才更新当前执行的时间戳 + delay 就是下次执行的方法的时间戳
        }
    }
}