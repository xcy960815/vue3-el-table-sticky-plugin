import { nextTick } from 'vue';

import type {
  Option,
  ResolvedStickyOptions,
  StickyState,
  StyleSnapshot,
  TableElements,
} from './type';
import { createDebounced, createThrottled } from './utils';

const TABLE_HEADER_SELECTOR = '.el-table__header-wrapper';
const TABLE_INNER_WRAPPER_SELECTOR = '.el-table__inner-wrapper';
const TABLE_BODY_SELECTOR = '.el-table__body-wrapper';
const FIXED_CLASS_NAME = 'fixed';

export class TableStickyPlugin {
  private states = new WeakMap<HTMLElement, StickyState>();

  public mounted(option: Option): void {
    nextTick(() => {
      const state = this.createState(option);
      if (!state) return;

      this.states.set(option.tableElement, state);
      this.attachState(state);
      state.checkSticky();
    });
  }

  public updated(option: Option): void {
    nextTick(() => {
      const state = this.states.get(option.tableElement);
      if (!state || state.disposed) return;

      const options = this.resolveOptions(option);
      const shouldRefreshWatchedElements = !this.isSameSelectorList(
        state.options.willBeChangeElementClasses,
        options.willBeChangeElementClasses,
      );

      state.options = options;

      if (shouldRefreshWatchedElements) {
        this.disconnectWatchedElementObservers(state);
        this.attachWatchedElementObservers(state);
      }

      state.refreshLayout();
    });
  }

  public unmounted(option: Option): void {
    const state = this.states.get(option.tableElement);
    if (!state) return;

    this.cleanupState(state);
    this.states.delete(option.tableElement);
  }

  private createState(option: Option): StickyState | undefined {
    const tableElements = this.resolveTableElements(option.tableElement);
    if (!tableElements) return undefined;

    const options = this.resolveOptions(option);
    const scrollElement = this.resolveScrollElement(options.parent, Boolean(option.binding.value?.parent));
    if (!scrollElement) return undefined;

    const state = this.createBaseState(tableElements, scrollElement, options);
    this.refreshGeometry(state);

    return state;
  }

  private createBaseState(
    tableElements: TableElements,
    scrollElement: HTMLElement,
    options: ResolvedStickyOptions,
  ): StickyState {
    const checkSticky = createThrottled(() => {
      this.checkSticky(state);
    }, 16);
    const refreshLayout = createDebounced(() => {
      this.refreshLayout(state);
    }, 100);

    const state: StickyState = {
      ...tableElements,
      scrollElement,
      options,
      styles: this.captureStyles(tableElements, scrollElement),
      isFixed: false,
      addedFixedClass: false,
      headerOffsetWithinTable: 0,
      scrollHandler: checkSticky,
      refreshLayout,
      checkSticky,
      watchedElementObservers: [],
      cleanups: [],
      disposed: false,
    };

    return state;
  }

  private attachState(state: StickyState): void {
    state.scrollElement.style.overflowAnchor = 'none';

    state.scrollElement.addEventListener('scroll', state.scrollHandler);
    state.cleanups.push(() => {
      state.scrollElement.removeEventListener('scroll', state.scrollHandler);
    });

    this.attachTableResizeObserver(state);
    this.attachWatchedElementObservers(state);
  }

  private attachTableResizeObserver(state: StickyState): void {
    const observer = new ResizeObserver(() => {
      state.refreshLayout();
    });

    observer.observe(state.tableElement);
    state.tableResizeObserver = observer;
    state.cleanups.push(() => observer.disconnect());
  }

  private attachWatchedElementObservers(state: StickyState): void {
    state.watchedElementObservers = this.resolveWatchedElements(state).map(({ selector, element }) => {
      const observer = new ResizeObserver(() => {
        state.refreshLayout();
      });

      observer.observe(element);
      return { selector, element, observer };
    });
  }

  private disconnectWatchedElementObservers(state: StickyState): void {
    state.watchedElementObservers.forEach(({ observer }) => {
      observer.disconnect();
    });
    state.watchedElementObservers = [];
  }

  private cleanupState(state: StickyState): void {
    state.disposed = true;
    state.checkSticky.cancel();
    state.refreshLayout.cancel();
    this.removeFixed(state);
    this.restoreScrollElementStyles(state);
    this.disconnectWatchedElementObservers(state);
    state.cleanups.forEach((cleanup) => cleanup());
    state.cleanups = [];
  }

  private refreshLayout(state: StickyState): void {
    if (state.disposed) return;

    this.refreshGeometry(state);

    if (state.isFixed) {
      this.applyFixed(state);
    }

    state.checkSticky();
  }

  private refreshGeometry(state: StickyState): void {
    const wasFixed = state.isFixed;

    if (wasFixed) {
      this.removeFixed(state);
    }

    const tableRect = state.tableElement.getBoundingClientRect();
    const headerRect = state.tableHeaderElement.getBoundingClientRect();
    state.headerOffsetWithinTable = headerRect.top - tableRect.top;

    if (wasFixed) {
      this.applyFixed(state);
    }
  }

  private checkSticky(state: StickyState): void {
    if (state.disposed) return;

    const tableRect = state.tableElement.getBoundingClientRect();
    const headerNaturalTop = tableRect.top + state.headerOffsetWithinTable;

    if (headerNaturalTop < state.options.fixedTopValue) {
      this.applyFixed(state);
    } else {
      this.removeFixed(state);
    }
  }

  private applyFixed(state: StickyState): void {
    if (state.disposed) return;

    const tableBodyWidth = this.getElementStyle(state.tableBodyElement, 'width');
    const zIndex = this.getMaxZIndex(state.tableElement) + 1;

    state.tableHeaderElement.style.position = 'fixed';
    state.tableHeaderElement.style.zIndex = `${zIndex}`;
    state.tableHeaderElement.style.top = `${state.options.fixedTopValue}px`;
    state.tableHeaderElement.style.transition = 'top .3s';
    state.tableHeaderElement.style.width = tableBodyWidth;
    state.tableInnerWrapperElement.style.marginTop = `${state.tableHeaderElement.offsetHeight}px`;

    if (!state.tableHeaderElement.classList.contains(FIXED_CLASS_NAME)) {
      state.tableHeaderElement.classList.add(FIXED_CLASS_NAME);
      state.addedFixedClass = true;
    }

    state.isFixed = true;
  }

  private removeFixed(state: StickyState): void {
    if (!state.isFixed && !state.addedFixedClass) return;

    this.restoreHeaderStyles(state);
    this.restoreInnerWrapperStyles(state);

    if (state.addedFixedClass) {
      state.tableHeaderElement.classList.remove(FIXED_CLASS_NAME);
      state.addedFixedClass = false;
    }

    state.isFixed = false;
  }

  private resolveOptions(option: Option): ResolvedStickyOptions {
    const bindingValue = option.binding.value;
    const hasExplicitTop =
      typeof bindingValue?.top === 'number' || typeof option.installOption?.top === 'number';
    const fixedTopValue =
      typeof bindingValue?.top === 'number'
        ? bindingValue.top
        : typeof option.installOption?.top === 'number'
        ? option.installOption.top
        : this.getTableHeaderCurrentTop(option.tableElement);

    return {
      fixedTopValue,
      defaultTop: !hasExplicitTop,
      parent: bindingValue?.parent || option.installOption?.parent,
      willBeChangeElementClasses: bindingValue?.willBeChangeElementClasses || [],
    };
  }

  private resolveTableElements(tableElement: HTMLElement): TableElements | undefined {
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

  private resolveScrollElement(parent: string | undefined, explicitParent: boolean): HTMLElement | undefined {
    if (!parent) return document.body;

    const scrollElement = this.safeQuerySelector<HTMLElement>(document, parent);
    if (scrollElement) return scrollElement;

    this.warn(`v-sticky parent selector "${parent}" did not match any element.`);
    return explicitParent ? undefined : document.body;
  }

  private resolveWatchedElements(
    state: StickyState,
  ): Array<{ selector: string; element: HTMLElement }> {
    const root = state.scrollElement === document.body ? document : state.scrollElement;

    return state.options.willBeChangeElementClasses.reduce<Array<{ selector: string; element: HTMLElement }>>(
      (elements, selector) => {
        const element =
          this.safeQuerySelector<HTMLElement>(root, selector) ||
          this.safeQuerySelector<HTMLElement>(document, selector);

        if (!element) {
          this.warn(`v-sticky watched selector "${selector}" did not match any element.`);
          return elements;
        }

        elements.push({ selector, element });
        return elements;
      },
      [],
    );
  }

  private safeQuerySelector<T extends Element>(
    root: Document | HTMLElement,
    selector: string,
  ): T | null {
    try {
      return root.querySelector<T>(selector);
    } catch (_error) {
      this.warn(`v-sticky selector "${selector}" is not a valid CSS selector.`);
      return null;
    }
  }

  private getTableHeaderCurrentTop(tableElement: HTMLElement): number {
    const tableHeaderElement = tableElement.querySelector<HTMLElement>(TABLE_HEADER_SELECTOR);
    return tableHeaderElement?.getBoundingClientRect().top || 0;
  }

  private captureStyles(
    tableElements: TableElements,
    scrollElement: HTMLElement,
  ): StyleSnapshot {
    return {
      header: {
        position: tableElements.tableHeaderElement.style.position,
        zIndex: tableElements.tableHeaderElement.style.zIndex,
        top: tableElements.tableHeaderElement.style.top,
        transition: tableElements.tableHeaderElement.style.transition,
        width: tableElements.tableHeaderElement.style.width,
      },
      innerWrapper: {
        marginTop: tableElements.tableInnerWrapperElement.style.marginTop,
      },
      scrollElement: {
        overflowAnchor: scrollElement.style.overflowAnchor,
      },
    };
  }

  private restoreHeaderStyles(state: StickyState): void {
    Object.assign(state.tableHeaderElement.style, state.styles.header);
  }

  private restoreInnerWrapperStyles(state: StickyState): void {
    Object.assign(state.tableInnerWrapperElement.style, state.styles.innerWrapper);
  }

  private restoreScrollElementStyles(state: StickyState): void {
    Object.assign(state.scrollElement.style, state.styles.scrollElement);
  }

  private getElementStyle<P extends keyof CSSStyleDeclaration>(
    element: HTMLElement,
    styleKey: P,
  ): CSSStyleDeclaration[P] {
    return window.getComputedStyle(element)[styleKey];
  }

  private getMaxZIndex(tableElement: HTMLElement): number {
    return Array.from(tableElement.querySelectorAll('*')).reduce((maxZIndex, element) => {
      return Math.max(maxZIndex, Number(this.getElementStyle(element as HTMLElement, 'zIndex')) || 0);
    }, 0);
  }

  private isSameSelectorList(left: string[], right: string[]): boolean {
    return left.length === right.length && left.every((selector, index) => selector === right[index]);
  }

  private warn(message: string): void {
    console.warn(`[vue3-el-table-sticky-plugin] ${message}`);
  }
}
