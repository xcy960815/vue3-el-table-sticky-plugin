import type { Option } from "./type"
/**
 * @desc 防抖函数
 * @param {Function} fn 
 * @param {Number} delay 
 * @param {Boolean} immediate 
 * @returns Function
 */
export const debounce = function <T = unknown>(fn: (option: Option) => void, delay: number, immediate?: boolean) {
    let timer: number = 0
    return function (this: T, option: Option) {
        const that = this
        if (timer) {
            clearTimeout(timer)
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
export const throttle = function <T = unknown>(fn: (option: Option) => void, delay: number): (this: T, option: Option) => void {
    // 使用闭包返回一个函数并且用到闭包函数外面的变量previous
    let previous = 0;
    return function (this: T, option: Option) {
        const that = this
        const now = new Date().getTime();
        if (now - previous > delay) {
            fn.call(that, option);
            previous = now;
        }
    }
}