# vue3-el-table-sticky-plugin

[English](./README.md) | [简体中文](./README.zh-CN.md)

[![npm](https://img.shields.io/npm/v/vue3-el-table-sticky-plugin.svg)](https://www.npmjs.com/package/vue3-el-table-sticky-plugin) [![downloads](https://img.shields.io/npm/dw/vue3-el-table-sticky-plugin.svg)](https://npmtrends.com/vue3-el-table-sticky-plugin) [![license](https://img.shields.io/npm/l/vue3-el-table-sticky-plugin.svg)](https://www.npmjs.com/package/vue3-el-table-sticky-plugin) [![vue](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://vuejs.org/) [![element--plus](https://img.shields.io/badge/element--plus-2.x-blue.svg)](https://element-plus.org/)

让 Element Plus `el-table` 表头在页面或业务滚动容器中吸顶的 Vue 3 指令插件。

## Features

- 支持 `el-table` 表头吸顶，不侵入表格数据和列配置。
- 支持页面默认滚动容器，也支持指定业务滚动容器。
- 支持多个表格实例同时使用，状态按表格隔离。
- 支持监听外部区域高度变化后重新计算吸顶位置。
- 自动处理挂载、更新、卸载时的事件和 `ResizeObserver` 清理。
- 提供 TypeScript 类型声明。

## Requirements

- Vue `^3.2.13`
- Element Plus `2.x`
- Node `^20.19.0 || >=22.12.0` 用于本仓库开发和构建

## Install

```bash
npm install vue3-el-table-sticky-plugin
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

const app = createApp(App);

app.use(ElementPlus);
app.use(Vue3TableStickyPlugin);
app.mount('#app');
```

Then use `v-sticky` on `el-table`:

```vue
<template>
  <div class="page-scroll">
    <div class="toolbar">
      <!-- filters, actions, dynamic content -->
    </div>

    <el-table
      v-sticky="{
        offsetTop: 0,
        scrollTarget: '.page-scroll',
        observe: ['.toolbar'],
        boundary: 'table',
      }"
      :data="tableData"
      border
    >
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
];
</script>

<style scoped>
.page-scroll {
  height: 100%;
  overflow-y: auto;
}
</style>
```

## Options

`v-sticky` accepts an object:

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

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `offsetTop` | `number \| (() => number)` | Current table header top | Sticky offset from the active scroll viewport top. |
| `scrollTarget` | `string \| HTMLElement \| Window` | Nearest scroll parent, then window | Scroll container used for sticky calculations. |
| `boundary` | `'table' \| 'scroll-container' \| string \| HTMLElement` | `'table'` | Boundary that releases the sticky header when its bottom is reached. |
| `observe` | `Array<string \| HTMLElement>` | `[]` | Elements whose size changes should trigger layout recalculation. |
| `strategy` | `'auto' \| 'fixed' \| 'sticky'` | `'auto'` | Reserved strategy option; current engine renders with fixed positioning. |
| `zIndex` | `number \| 'auto'` | `'auto'` | Sticky header stacking order. |
| `activeClass` | `string` | `'fixed'` | Class added while sticky is active. |
| `top` | `number` | - | Deprecated alias of `offsetTop`. |
| `parent` | `string` | - | Deprecated alias of `scrollTarget`. |
| `willBeChangeElementClasses` | `string[]` | - | Deprecated alias of `observe`. |

Priority:

1. Directive value, for example `v-sticky="{ offsetTop: 64 }"`.
2. Plugin install option, for example `app.use(Vue3TableStickyPlugin, { offsetTop: 64 })`.
3. Plugin fallback.

## Global Defaults

You can provide default options when installing the plugin:

```ts
app.use(Vue3TableStickyPlugin, {
  offsetTop: 64,
  scrollTarget: '.app-main',
});
```

Directive options override global defaults:

```vue
<el-table
  v-sticky="{
    offsetTop: 0,
    scrollTarget: '.page-scroll',
  }"
/>
```

## Scroll Container Rules

The plugin listens to the configured scroll container. The table must be inside that container, and that same container must be the element that actually scrolls. If `scrollTarget` is omitted, the plugin searches for the nearest scrollable ancestor and falls back to the window.

Recommended:

```css
.page-scroll {
  height: 100%;
  overflow-y: auto;
}
```

Avoid testing a parent scroll case with a fixed-height `el-table` if your goal is to verify outer container scrolling. Element Plus will make the table body scroll internally when `height` is set, while this plugin is listening to the configured parent.

## Demo Routes

This repository includes a Vite demo with one test case per route:

| Route              | Case                                                       |
| ------------------ | ---------------------------------------------------------- |
| `/#/basic-body`    | Default body scroll behavior.                              |
| `/#/parent-scroll` | Custom parent scroll container.                            |
| `/#/multi-table`   | Multiple sticky tables in the same scroll container.       |
| `/#/dynamic-top`   | Recalculate sticky position when a toolbar changes height. |

Run the demo:

```bash
pnpm install
pnpm dev
```

## Project Structure

```text
plugin/     Source code published as the plugin
src/        Vite demo app
types/      Bundled TypeScript declarations
dist/       Library build output
```

## Scripts

```bash
pnpm dev            # Start the Vite demo
pnpm build          # Build the plugin package
pnpm build:plugin   # Build plugin JS and declaration files
pnpm build:demo     # Build the demo app
pnpm lint           # Run ESLint
pnpm format:check   # Check Prettier formatting
```

## Build Output

The package exposes:

- `dist/vue3-el-table-sticky-plugin.esm.js`
- `dist/vue3-el-table-sticky-plugin.umd.js`
- `types/vue3-el-table-sticky-plugin.d.ts`

## Notes

- `scrollTarget`, `boundary`, and `observe` support CSS selectors where a selector is accepted.
- `parent` and `willBeChangeElementClasses` remain available as deprecated compatibility aliases.
- Invalid selectors are ignored with a console warning.
- Missing optional watched elements do not block rendering.
- The plugin adds and removes the `fixed` class on the Element Plus table header wrapper while sticky is active.

## License

MIT
