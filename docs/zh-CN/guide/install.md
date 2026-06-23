# 安装

## 环境要求

- Vue `^3.2.13`
- Element Plus `2.x`
- Node `^20.19.0 || >=22.12.0`，用于本仓库本地开发和构建

## 安装包

```bash
pnpm add vue3-el-table-sticky-plugin
```

```bash
npm install vue3-el-table-sticky-plugin
```

```bash
yarn add vue3-el-table-sticky-plugin
```

## 最小使用示例

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

在 `el-table` 上应用 `v-sticky`：

```vue
<template>
  <div class="page-scroll">
    <div class="toolbar">筛选项和操作区</div>

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

## 全局默认配置

安装插件时可以提供全局默认参数：

```ts
app.use(Vue3TableStickyPlugin, {
  offsetTop: 64,
  scrollTarget: '.app-main',
});
```

单个指令上的配置会覆盖全局默认值：

```vue
<el-table
  v-sticky="{
    offsetTop: 0,
    scrollTarget: '.page-scroll',
  }"
/>
```

## 本地开发

```bash
pnpm install
pnpm dev
```

本地 demo 路由：

- `/#/basic-body`
- `/#/parent-scroll`
- `/#/multi-table`
- `/#/dynamic-top`
