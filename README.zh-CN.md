# vue3-el-table-sticky-plugin

[English README](./README.md)

- 文档地址：[https://xcy960815.github.io/vue3-el-table-sticky-plugin/zh-CN/](https://xcy960815.github.io/vue3-el-table-sticky-plugin/zh-CN/)
- 在线 Demo：[https://xcy960815.github.io/vue3-el-table-sticky-plugin/zh-CN/guide/demo](https://xcy960815.github.io/vue3-el-table-sticky-plugin/zh-CN/guide/demo)

`vue3-el-table-sticky-plugin` 让 Element Plus 的 `el-table` 表头在页面或指定容器滚动时吸顶。

把 `v-sticky` 写在表格上。表头用 `fixed` 定位。`strategy: 'sticky'` 会打一条提示，然后仍走这条 `fixed` 路径。对等依赖是 `vue@^3.2.13`。应用里还需要 Element Plus 2.x。

## 功能特性

- `el-table` 表头吸顶，不改列和行数据
- 可以跟页面滚动，也可以指定滚动容器
- 同一页多张表各自维护状态
- 被监听的元素尺寸变化后会重新计算
- 表格被搬到另一个滚动容器后会重新挂上监听
- 内置 TypeScript 类型声明

## 安装

```bash
npm install vue3-el-table-sticky-plugin -S
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

表格必须放在真正滚动的那个元素里面。`scrollTarget` 就是这个元素。

## CDN / UMD 用法

先加载 Vue 3。这个 UMD 从全局变量 `vue` 读取 Vue。插件本身是 `Vue3ElTableStickyPlugin`，安装对象是默认导出。页面里仍然需要 Element Plus。

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

具名导出 `vue3TableStickyPlugin` 就是 `install`。

## API

`v-sticky` 接收一个对象。同样的字段也可以在 `app.use(Vue3TableStickyPlugin, options)` 里当作默认值。指令上的值优先于安装参数。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `offsetTop` | `number \| (() => number)` | 当前表头顶部 | 吸顶后离滚动视口顶部的距离 |
| `scrollTarget` | `string \| HTMLElement \| Window` | 最近的可滚动祖先，否则是 `window` | 滚动元素 |
| `boundary` | `'table' \| 'scroll-container' \| string \| HTMLElement` | `'table'` | 到达这个边界底部时松开表头 |
| `observe` | `Array<string \| HTMLElement>` | `[]` | 这些元素尺寸变化时重新计算表头 |
| `strategy` | `'auto' \| 'fixed' \| 'sticky'` | `'auto'` | 渲染方式。`'sticky'` 是预留值，会退回 `fixed` |
| `zIndex` | `number \| 'auto'` | `'auto'` | 层叠顺序。`'auto'` 会推导数值，后吸顶的表头再错开一层 |
| `activeClass` | `string` | `'fixed'` | 吸顶期间加到表头上的类名 |
| `top` | `number` | — | `offsetTop` 的旧名字 |
| `parent` | `string` | — | `scrollTarget` 的旧名字 |
| `willBeChangeElementClasses` | `string[]` | — | `observe` 的旧名字 |

## 使用说明

- `scrollTarget` 必须包住这张表。包不住时会被忽略，并在控制台警告。
- 一页有多张表时，选择器形式的 `scrollTarget` 用这张表最近的匹配祖先。
- `observe` 和 `boundary` 的选择器优先匹配表格自己或它的祖先。否则用和表格拥有最近公共祖先的那个候选。
- 匹配不到的选择器会被忽略，并在控制台警告。少一个被监听元素不会阻止表头吸顶。
- `el-table` 写了固定 `height` 时，Element Plus 会让表体自己滚。这个插件仍然跟随外面的滚动容器，并打一条提示。
- 表格被搬进另一个容器后，插件会在下一次渲染前把监听改挂到新容器上。
- 吸顶期间表头会带上 `activeClass`。默认类名是 `fixed`。

## 构建产物说明

当前发布包包含：

- `dist/vue3-el-table-sticky-plugin.esm.js`：ESM
- `dist/vue3-el-table-sticky-plugin.umd.js`：UMD
- `types/vue3-el-table-sticky-plugin.d.ts`：TypeScript 类型声明

## 本地开发

```bash
pnpm install
pnpm run dev
pnpm run lint
pnpm run build
```

## 项目结构

- `plugin/index.ts`：指令安装
- `plugin/table-sticky.ts`：参数和生命周期
- `plugin/controller.ts`：吸顶状态
- `src/`：本地 demo
- `vite.plugin.config.ts`：库构建

## License

MIT
