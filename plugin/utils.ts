export interface CancelableFunction<A extends any[] = any[]> {
  (...args: A): void;
  cancel: () => void;
}

/**
 * @description 创建可取消的防抖函数。
 * @param {(...args: A) => void} fn 需要防抖的函数。
 * @param {number} delay 防抖延迟毫秒数。
 * @returns {CancelableFunction<A>} 可取消的防抖函数。
 */
export function createDebounced<A extends any[]>(
  fn: (...args: A) => void,
  delay: number,
): CancelableFunction<A> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: A) => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}

/**
 * @description 创建可取消的节流函数。
 * @param {(...args: A) => void} fn 需要节流的函数。
 * @param {number} delay 节流延迟毫秒数。
 * @returns {CancelableFunction<A>} 可取消的节流函数。
 */
export function createThrottled<A extends any[]>(
  fn: (...args: A) => void,
  delay: number,
): CancelableFunction<A> {
  let lastCalledAt = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: A | null = null;

  const throttled = (...args: A) => {
    const now = Date.now();
    const remaining = delay - (now - lastCalledAt);
    lastArgs = args;

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCalledAt = now;
      fn(...args);
      lastArgs = null;
      return;
    }

    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        lastCalledAt = Date.now();
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = null;
  };

  return throttled;
}

/**
 * @desc 防抖装饰器
 * @param {number} delay 防抖延迟毫秒数。
 * @param {boolean} immediate 是否在首次触发时立即执行。
 * @returns {MethodDecorator}
 */
export function Debounce(delay: number, immediate: boolean = false) {
  return function <A extends any[], R>(
    _target: any,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: A) => R>,
  ) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const originalMethod = descriptor.value!;

    let allowCallNow: boolean = immediate;

    descriptor.value = function (this: ThisParameterType<(...args: A) => R>, ...args: A) {
      const context = this;

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      if (immediate && allowCallNow) {
        // 即时模式下执行了函数就暂时禁止执行
        allowCallNow = false;
        return originalMethod.apply(context, args);
      }

      timer = setTimeout(() => {
        timer = null;
        // 延迟结束后重置执行标记
        // allowCallNow = immediate;
        return originalMethod.apply(context, args);
      }, delay);
    };
    return descriptor;
  };
}

/**
 * @description 判断传入值是否为 HTMLElement。
 * @param {unknown} value 需要判断的值。
 * @returns {value is HTMLElement} 当值为 HTMLElement 时返回 true。
 */
export function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}
/**
 * @desc 节流装饰器
 * @param {number} delay 节流延迟毫秒数。
 * @param {boolean} leading 是否在首次触发时执行。
 * @returns {MethodDecorator}
 */
export function Throttle(delay: number, leading: boolean = true) {
  return function <A extends any[], R>(
    _target: any,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: A) => R>,
  ) {
    let previous = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const originalMethod = descriptor.value!;

    descriptor.value = function (this: ThisParameterType<(...args: A) => R>, ...args: A) {
      const now = Date.now();
      if (leading && !previous) {
        const result = originalMethod.apply(this, args);
        previous = now;
        return result;
      } else if (now - previous > delay) {
        clearTimeout(timer as ReturnType<typeof setTimeout>);
        timer = setTimeout(() => {
          const result = originalMethod.apply(this, args);
          previous = Date.now();
          return result;
        }, delay);
      }
    };

    return descriptor;
  };
}
