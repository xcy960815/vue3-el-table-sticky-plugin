<p align="center" >
<font size="5">vue3-el-table-sticky-plugin</font>
</p>
<br/>

[![npm](https://img.shields.io/npm/v/vue3-el-table-sticky-plugin.svg)](https://www.npmjs.com/package/vue3-el-table-sticky-plugin)
[![npm](https://img.shields.io/npm/dw/vue3-el-table-sticky-plugin.svg)](https://npmtrends.com/vue3-el-table-sticky-plugin)
[![npm](https://img.shields.io/npm/l/vue3-el-table-sticky-plugin.svg?sanitize=true)](https://www.npmjs.com/package/vue3-el-table-sticky-plugin)
[![vue3](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![vue3](https://img.shields.io/badge/vue--cli-4.x-brightgreen.svg)](https://cli.vuejs.org/)

<br/>
> 一个让 element-plus el-table 表头部吸顶的vue3插件

<br/>

#### 实现思路

节点中设置的 top 值是基于 body 进行设置的因为业务场景不一样，所有节点唯一的共同点就是 body。

#### 安装

```npm
npm i vue3-el-table-sticky-plugin -S
```

#### 使用前注意

    1. parent 滚动容器，默认为body。(参数优先级 指令使用处 > 指令注册处 > 插件兜底(body节点))

    2. top 可选参数 (参数优先级 指令使用处 > 指令注册处 > 插件兜底(基于当前table-header距离body的top值))

    3. 实际使用情况还会更复杂 本插件只是在理想状态下面做的封装 如有不足还请指出

#### 引入

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import Vue3TableStickyPlugin from "vue3-el-table-sticky-plugin";
const app = createApp(App);
// 注入全局指令
app.use(Vue3TableStickyPlugin);
app.mount("#app");
```

#### 使用

```html
<!-- xxx.vue -->
<template>
  <div class="vue3-el-table-sticky-plugin">
    <el-table
      v-sticky="{ top: stickyValue, parent: '.vue3-el-table-sticky-plugin' }"
      class="el-sticky-table"
      :data="tableDataState.tableData"
      :header-cell-style="{ background: 'rgb(240, 240, 240)' }"
      border
    >
      <el-table-column fixed="left" prop="date" label="Date" width="150" />
      <el-table-column fixed="left" prop="name" label="Name" width="250" />
      <el-table-column prop="state" label="State" width="250" />
      <el-table-column prop="city" label="City" width="250" />
      <el-table-column prop="address" label="Address" width="620" />
      <el-table-column fixed="right" prop="zip" label="Zip" width="120" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default>
          <el-button link type="primary" size="small">详情</el-button>
          <el-button link type="primary" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive ref } from "vue"

  const tableDataState = reactive({
      tableData:[
          ...多条数据
      ]
  })

  // 绑定动态数据
  const stickyValue = ref<number>(0)

  onMounted(() => {
      // 动态 获取自身距离顶部的距离 意思就是头部就定在当前位置
      // 监听节点class 为 demo-form-inline 的高度变化
      const demoFormInline = document.querySelector(".demo-form-inline")!;
      const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
              const tableElement = entry.target as HTMLDivElement
              stickyValue.value = tableElement.getBoundingClientRect().height
          }
      });
      resizeObserver.observe(demoFormInline);

  })
</script>
<style lang="less" scoped>
  .vue3-el-table-sticky-plugin {
    position: relative;
    /* 注意 class 为 vue3-el-table-sticky-plugin 的节点设置了滚动属性 
        parent参数的值就是 ".vue3-el-table-sticky-plugin" */
    overflow-y: scroll;
    height: 100%;
    width: 100%;
  }
</style>
```

### OPTIONS

| 参数   | 说明                                                  | 类型   | 默认值                                              |
| ------ | ----------------------------------------------------- | ------ | --------------------------------------------------- |
| top    | 吸顶的时候 距离顶部多少距离，可以不用传递             | number | 不传递的话就是 el-table-header 节点距离 body 的距离 |
| parent | 当前页面滚动的节点，如果是 document.body 可以不用传递 | string | body                                                |

---
