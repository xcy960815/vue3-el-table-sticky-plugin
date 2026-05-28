# vue3-el-table-sticky-plugin

[English](./README.md) | [简体中文](./README.zh-CN.md)

[![npm](https://img.shields.io/npm/v/vue3-el-table-sticky-plugin.svg)](https://www.npmjs.com/package/vue3-el-table-sticky-plugin) [![downloads](https://img.shields.io/npm/dw/vue3-el-table-sticky-plugin.svg)](https://npmtrends.com/vue3-el-table-sticky-plugin) [![license](https://img.shields.io/npm/l/vue3-el-table-sticky-plugin.svg)](https://www.npmjs.com/package/vue3-el-table-sticky-plugin) [![vue](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://vuejs.org/) [![element--plus](https://img.shields.io/badge/element--plus-2.x-blue.svg)](https://element-plus.org/)

一个用于 Element Plus `el-table` 的 Vue 3 指令插件，让表头在页面滚动或业务容器滚动时保持吸顶。

## 特性

- 支持 `el-table` 表头吸顶，不侵入表格数据和列配置。
- 支持默认页面滚动，也支持指定业务滚动容器。
- 支持多个表格实例同时使用，状态按表格实例隔离。
- 支持监听外部区域尺寸变化后重新计算吸顶位置。
- 自动处理挂载、更新、卸载时的事件监听和 `ResizeObserver` 清理。
- 内置 TypeScript 类型声明。

## 环境要求

- Vue `^3.2.13`
- Element Plus `2.x`
- Node `^20.19.0 || >=22.12.0`，仅用于本仓库开发和构建

## 安装

```bash
npm install vue3-el-table-sticky-plugin
```

```bash
pnpm add vue3-el-table-sticky-plugin
```

## 快速开始

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

在 `el-table` 上使用 `v-sticky`：

```vue
<template>
  <div class="page-scroll">
    <div class="toolbar">
      <!-- 筛选项、操作按钮、动态内容 -->
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

## 配置项

`v-sticky` 接收一个对象：

```ts
interface StickyOptions {
  offsetTop?: number | (() => number);
  scrollTarget?: string | HTMLElement | Window;
  boundary?: 'table' | 'scroll-container' | string | HTMLElement;
  observe?: Array<string | HTMLElement>;
  strategy?: 'auto' | 'fixed' | 'sticky';
  zIndex?: number | 'auto';
  activeClass?: string;

  /** @deprecated 请使用 offsetTop。 */
  top?: number;
  /** @deprecated 请使用 scrollTarget。 */
  parent?: string;
  /** @deprecated 请使用 observe。 */
  willBeChangeElementClasses?: string[];
}
```

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `offsetTop` | `number \| (() => number)` | 当前表头距离视口顶部的位置 | 表头吸顶后距离当前滚动视口顶部的距离。 |
| `scrollTarget` | `string \| HTMLElement \| Window` | 最近可滚动祖先，其次是 window | 用于吸顶计算的滚动容器。 |
| `boundary` | `'table' \| 'scroll-container' \| string \| HTMLElement` | `'table'` | 触达底部后释放吸顶表头的边界元素。 |
| `observe` | `Array<string \| HTMLElement>` | `[]` | 会影响吸顶位置的元素列表；这些元素尺寸变化时会触发布局重算。 |
| `strategy` | `'auto' \| 'fixed' \| 'sticky'` | `'auto'` | 预留策略配置；当前引擎使用 fixed 定位渲染。 |
| `zIndex` | `number \| 'auto'` | `'auto'` | 表头吸顶时的层级。 |
| `activeClass` | `string` | `'fixed'` | 表头吸顶时添加的 class。 |
| `top` | `number` | - | 已废弃，作为 `offsetTop` 的兼容别名。 |
| `parent` | `string` | - | 已废弃，作为 `scrollTarget` 的兼容别名。 |
| `willBeChangeElementClasses` | `string[]` | - | 已废弃，作为 `observe` 的兼容别名。 |

配置优先级：

1. 指令参数，例如 `v-sticky="{ offsetTop: 64 }"`。
2. 插件安装参数，例如 `app.use(Vue3TableStickyPlugin, { offsetTop: 64 })`。
3. 插件默认值。

## 全局默认配置

可以在安装插件时设置默认参数：

```ts
app.use(Vue3TableStickyPlugin, {
  offsetTop: 64,
  scrollTarget: '.app-main',
});
```

指令参数会覆盖全局默认配置：

```vue
<el-table
  v-sticky="{
    offsetTop: 0,
    scrollTarget: '.page-scroll',
  }"
/>
```

## 滚动容器规则

插件会监听 `scrollTarget` 指定的滚动容器。表格必须位于该容器内部，并且这个容器必须是真正发生滚动的元素。如果没有传 `scrollTarget`，插件会自动查找最近的可滚动祖先，找不到时回退到 window。

推荐写法：

```css
.page-scroll {
  height: 100%;
  overflow-y: auto;
}
```

如果要测试外层业务容器滚动，不要给 `el-table` 设置固定 `height`。Element Plus 在设置 `height` 后会让表格 body 内部滚动，而插件监听的是你指定的外层 `parent`，两者不一致时吸顶不会触发。

## Demo 路由

仓库内置 Vite demo，每个测试场景一个地址：

| 地址               | 场景                                   |
| ------------------ | -------------------------------------- |
| `/#/basic-body`    | 默认 body 滚动。                       |
| `/#/parent-scroll` | 指定父级滚动容器。                     |
| `/#/multi-table`   | 同一滚动容器内多个吸顶表格。           |
| `/#/dynamic-top`   | 顶部工具栏高度变化后重新计算吸顶位置。 |

启动 demo：

```bash
pnpm install
pnpm dev
```

## 项目结构

```text
plugin/     插件源码
src/        Vite demo 应用
types/      打包后的 TypeScript 类型声明
dist/       插件构建产物
```

## 常用命令

```bash
pnpm dev            # 启动 Vite demo
pnpm build          # 构建插件包
pnpm build:plugin   # 构建插件 JS 和类型声明
pnpm build:demo     # 构建 demo 应用
pnpm lint           # 运行 ESLint
pnpm format:check   # 检查 Prettier 格式
```

## 构建产物

包入口包括：

- `dist/vue3-el-table-sticky-plugin.esm.js`
- `dist/vue3-el-table-sticky-plugin.umd.js`
- `types/vue3-el-table-sticky-plugin.d.ts`

## 注意事项

- `scrollTarget`、`boundary` 和 `observe` 在接收选择器的位置都支持 CSS 选择器。
- `parent` 和 `willBeChangeElementClasses` 仍作为已废弃兼容别名可用。
- 无效选择器会被忽略，并在控制台输出 warning。
- 可选监听元素不存在时不会阻断页面渲染。
- 吸顶激活时，插件会在 Element Plus 表头 wrapper 上添加 `fixed` class，并在取消吸顶时移除。

## License

MIT
