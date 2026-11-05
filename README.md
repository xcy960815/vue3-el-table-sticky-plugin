# vue3-el-table-sticky-plugin

[![npm](https://img.shields.io/npm/v/vue3-el-table-sticky-plugin.svg)](https://www.npmjs.com/package/vue3-el-table-sticky-plugin) [![License](https://img.shields.io/npm/l/vue3-el-table-sticky-plugin.svg)](https://github.com/xcy960815/vue3-el-table-sticky-plugin) [![npm](https://img.shields.io/npm/dm/vue3-el-table-sticky-plugin.svg)](https://github.com/xcy960815/vue3-el-table-sticky-plugin) [![CI](https://img.shields.io/badge/CI-passing-brightgreen.svg)](https://github.com/xcy960815/vue3-el-table-sticky-plugin/actions) [![GitHub issues](https://img.shields.io/github/issues/xcy960815/vue3-el-table-sticky-plugin.svg)](https://github.com/xcy960815/vue3-el-table-sticky-plugin/issues) [![GitHub stars](https://img.shields.io/github/stars/xcy960815/vue3-el-table-sticky-plugin.svg?style=social&label=Stars)](https://github.com/xcy960815/vue3-el-table-sticky-plugin) [![GitHub forks](https://img.shields.io/github/forks/xcy960815/vue3-el-table-sticky-plugin.svg?style=social&label=Fork)](https://github.com/xcy960815/vue3-el-table-sticky-plugin)

- Documentation: [https://xcy960815.github.io/vue3-el-table-sticky-plugin/](https://xcy960815.github.io/vue3-el-table-sticky-plugin/)
- Online Demo: [https://xcy960815.github.io/vue3-el-table-sticky-plugin/guide/demo](https://xcy960815.github.io/vue3-el-table-sticky-plugin/guide/demo)
- 中文说明：[README.zh-CN.md](./README.zh-CN.md)

`vue3-el-table-sticky-plugin` sticks the header of an Element Plus `el-table` while the page, or a chosen container, scrolls.

Put `v-sticky` on the table. The header is positioned with `fixed`. `strategy: 'sticky'` logs a notice and uses that same `fixed` path. The peer dependency is `vue@^3.2.13`. The app also needs Element Plus 2.x.

## Features

- Sticky header for `el-table`, without changing columns or row data
- Page scroll, or a scroll container you name
- Several tables on one page, each with its own state
- Recalculates when watched elements change size
- Recovers when a table is moved into another scroll container
- TypeScript definitions included

## Installation

```bash
npm install vue3-el-table-sticky-plugin -S
```

```bash
pnpm add vue3-el-table-sticky-plugin
```

## Quick Start

```ts
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import Vue3TableStickyPlugin from 'vue3-el-table-sticky-plugin';
import App from './App.vue';

createApp(App).use(ElementPlus).use(Vue3TableStickyPlugin).mount('#app');
```

```vue
<template>
  <div class="page-scroll">
    <el-table v-sticky="{ offsetTop: 0, scrollTarget: '.page-scroll' }" :data="tableData">
      <el-table-column prop="name" label="Name" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
const tableData = [{ name: 'Tom' }];
</script>

<style>
.page-scroll {
  height: 100%;
  overflow-y: auto;
}
</style>
```

The table has to sit inside the element that actually scrolls. `scrollTarget` is that element.

## CDN / UMD Example

Load Vue 3 first. This UMD build reads Vue from the global `vue`. The plugin itself is `Vue3ElTableStickyPlugin`, and the install object is the default export. The page still needs Element Plus.

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
  window.vue = Vue;
</script>
<script src="https://unpkg.com/vue3-el-table-sticky-plugin/dist/vue3-el-table-sticky-plugin.umd.js"></script>
<script>
  Vue.createApp({}).use(Vue3ElTableStickyPlugin.default).mount('#app');
</script>
```

The named export `vue3TableStickyPlugin` is the `install` function.

## API

`v-sticky` takes an object. The same fields can be passed to `app.use(Vue3TableStickyPlugin, options)` as defaults. A value on the directive wins over the install option.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `offsetTop` | `number \| (() => number)` | current header top | Gap between the stuck header and the top of the scrollport |
| `scrollTarget` | `string \| HTMLElement \| Window` | nearest scrollable ancestor, then `window` | Element that scrolls |
| `boundary` | `'table' \| 'scroll-container' \| string \| HTMLElement` | `'table'` | Releases the header when this boundary's bottom is reached |
| `observe` | `Array<string \| HTMLElement>` | `[]` | Elements whose size changes should recalculate the header |
| `strategy` | `'auto' \| 'fixed' \| 'sticky'` | `'auto'` | Rendering path. `'sticky'` is reserved and falls back to `fixed` |
| `zIndex` | `number \| 'auto'` | `'auto'` | Stacking order. `'auto'` derives a value and staggers later stuck headers |
| `activeClass` | `string` | `'fixed'` | Class added on the header while it is stuck |
| `top` | `number` | — | Deprecated name for `offsetTop` |
| `parent` | `string` | — | Deprecated name for `scrollTarget` |
| `willBeChangeElementClasses` | `string[]` | — | Deprecated name for `observe` |

## Notes

- `scrollTarget` must contain the table. A target that does not contain it is ignored, and the plugin warns.
- On a page with several tables, a selector `scrollTarget` uses the nearest matching ancestor of that table.
- `observe` and `boundary` selectors prefer the table itself or an ancestor. Otherwise they use the candidate that shares the closest ancestor with the table.
- A selector that matches nothing is ignored, with a console warning. A missing watched element does not stop the header.
- A fixed `height` on `el-table` makes Element Plus scroll the table body. This plugin still follows the outer scroll container, and it logs a notice.
- When the table is moved into another container, the plugin attaches its listeners to the new container before the next render.
- While the header is stuck it receives `activeClass`. The default class is `fixed`.

## Build Artifacts

The published package currently includes:

- `dist/vue3-el-table-sticky-plugin.esm.js`: ESM build
- `dist/vue3-el-table-sticky-plugin.umd.js`: UMD build
- `types/vue3-el-table-sticky-plugin.d.ts`: TypeScript declarations

## Development

```bash
pnpm install
pnpm run dev
pnpm run lint
pnpm run build
```

## Project Structure

- `plugin/index.ts`: directive install
- `plugin/table-sticky.ts`: option resolution and lifecycle
- `plugin/controller.ts`: sticky state
- `src/`: local demo
- `vite.plugin.config.ts`: library build

## License

MIT
