# Install

## Requirements

- Vue `^3.2.13`
- Element Plus `2.x`
- Node `^20.19.0 || >=22.12.0` for local development in this repository

## Package Installation

```bash
pnpm add vue3-el-table-sticky-plugin
```

```bash
npm install vue3-el-table-sticky-plugin
```

```bash
yarn add vue3-el-table-sticky-plugin
```

## Minimal Usage

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

Apply `v-sticky` to an `el-table`:

```vue
<template>
  <div class="page-scroll">
    <div class="toolbar">Filters and actions</div>

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

## Global Defaults

You can provide default sticky behavior while installing the plugin:

```ts
app.use(Vue3TableStickyPlugin, {
  offsetTop: 64,
  scrollTarget: '.app-main',
});
```

Directive-level options still win over plugin defaults:

```vue
<el-table
  v-sticky="{
    offsetTop: 0,
    scrollTarget: '.page-scroll',
  }"
/>
```

## Local Development

```bash
pnpm install
pnpm dev
```

Local demo routes:

- `/#/basic-body`
- `/#/parent-scroll`
- `/#/multi-table`
- `/#/dynamic-top`
