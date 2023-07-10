/**
 * @desc 防抖装饰器
 * @param delay {number}
 * @param immediate {boolean}
 * @returns {MethodDecorator}
 */
export function Debounce(delay: number, immediate: boolean = false) {
  return function <A extends any[], R>(
    _target: any,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: A) => R>,
  ) {
    let timer: NodeJS.Timeout | null = null;
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
 * @desc 节流装饰器
 * @param delay {number}
 * @param leading {boolean}
 * @returns {MethodDecorator}
 */
export function Throttle(delay: number, leading: boolean = true) {
  return function <A extends any[], R>(
    _target: any,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: A) => R>,
  ) {
    let previous = 0;
    let timer: NodeJS.Timeout | null = null;
    const originalMethod = descriptor.value!;

    descriptor.value = function (this: ThisParameterType<(...args: A) => R>, ...args: A) {
      const now = Date.now();
      if (leading && !previous) {
        const result = originalMethod.apply(this, args);
        previous = now;
        return result;
      } else if (now - previous > delay) {
        clearTimeout(timer as NodeJS.Timeout);
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
