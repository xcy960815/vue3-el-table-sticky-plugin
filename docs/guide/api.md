# API

## Plugin Export

```ts
import Vue3TableStickyPlugin from 'vue3-el-table-sticky-plugin';
```

Default export:

```ts
{
  install(app, installOption?)
}
```

Named exports:

```ts
export type { InstallOption, StickyOptions };
export { vue3TableStickyPlugin };
```

## StickyOptions

`v-sticky` accepts the following object:

```ts
interface StickyOptions {
  offsetTop?: number | (() => number);
  scrollTarget?: string | HTMLElement | Window;
  boundary?: 'table' | 'scroll-container' | string | HTMLElement;
  observe?: Array<string | HTMLElement>;
  strategy?: 'auto' | 'fixed' | 'sticky';
  zIndex?: number | 'auto';
  activeClass?: string;

  /** @deprecated Use offsetTop instead. */
  top?: number;
  /** @deprecated Use scrollTarget instead. */
  parent?: string;
  /** @deprecated Use observe instead. */
  willBeChangeElementClasses?: string[];
}
```

## Option Reference

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `offsetTop` | `number \| (() => number)` | Current table header top | Sticky offset from the active scroll viewport top. |
| `scrollTarget` | `string \| HTMLElement \| Window` | Nearest scroll parent, then `window` | Scroll container used for sticky calculations. |
| `boundary` | `'table' \| 'scroll-container' \| string \| HTMLElement` | `'table'` | Boundary that releases the sticky header when its bottom is reached. |
| `observe` | `Array<string \| HTMLElement>` | `[]` | Elements whose size changes should trigger layout recalculation. |
| `strategy` | `'auto' \| 'fixed' \| 'sticky'` | `'auto'` | Reserved strategy option; current engine renders with fixed positioning. |
| `zIndex` | `number \| 'auto'` | `'auto'` | Sticky header stacking order. |
| `activeClass` | `string` | `'fixed'` | Class added while sticky is active. |
| `top` | `number` | - | Deprecated alias of `offsetTop`. |
| `parent` | `string` | - | Deprecated alias of `scrollTarget`. |
| `willBeChangeElementClasses` | `string[]` | - | Deprecated alias of `observe`. |

## Resolution Priority

Option values are resolved in this order:

1. Directive value, for example `v-sticky="{ offsetTop: 64 }"`.
2. Plugin install option, for example `app.use(Vue3TableStickyPlugin, { offsetTop: 64 })`.
3. Internal fallback values.

## Scroll Container Rules

The plugin listens to the configured scroll container. The table must live inside that container, and that same container must be the element that actually scrolls.

Recommended:

```css
.page-scroll {
  height: 100%;
  overflow-y: auto;
}
```

If `scrollTarget` is omitted, the plugin searches for the nearest scrollable ancestor and falls back to `window`.

Avoid testing a parent scroll case with a fixed-height `el-table` if your goal is to verify outer container scrolling. Element Plus will make the table body scroll internally when `height` is set, while this plugin is listening to the configured parent.

## Installation Defaults vs Directive Overrides

```ts
app.use(Vue3TableStickyPlugin, {
  offsetTop: 64,
  scrollTarget: '.app-main',
});
```

```vue
<el-table
  v-sticky="{
    offsetTop: 0,
    scrollTarget: '.page-scroll',
    boundary: 'table',
    observe: ['.toolbar'],
  }"
/>
```

## Build Outputs

The published package exposes:

- `dist/vue3-el-table-sticky-plugin.esm.js`
- `dist/vue3-el-table-sticky-plugin.umd.js`
- `types/vue3-el-table-sticky-plugin.d.ts`
