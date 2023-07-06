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
    <el-form inline class="table-top-dom">
      <el-form-item
        :label="formItem.label"
        v-for="formItem in elFormItemsState.elFormItems"
      >
        <el-input placeholder="Approved by" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAddFormItems(1)">
          添加一条数据
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      class="el-table-sticky"
      v-sticky="{ top: stickyTopValue }"
      :data="tableDataState.tableData"
      :header-cell-style="{ background: 'rgb(240, 240, 240)' }"
      border
      style="100%"
    >
      <el-table-column
        fixed="left"
        prop="date"
        label="Date"
        width="150"
      ></el-table-column>
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
  import { onMounted, reactive, ref } from "vue";
  const stickyTopValue = ref<number>(0);
  const elFormItemsState = reactive<{
    elFormItems: Array<{ label: string }>;
  }>({
    elFormItems: [],
  });
  const tableDataState = reactive<{
    tableData: Array<{
      date: string;
      name: string;
      state: string;
      city: string;
      address: string;
      zip: string;
      tag: string;
    }>;
  }>({
    tableData: [],
  });
  // 模拟数据
  for (let index = 0; index < 49; index++) {
    tableDataState.tableData.push({
      date: "2016-05-03",
      name: "Tom",
      state: "California",
      city: "Los Angeles",
      address: "No. 189, Grove St, Los Angeles",
      zip: "CA 90036",
      tag: "Home",
    });
  }
  tableDataState.tableData.unshift({
    date: "第一条数据",
    name: "第一条数据",
    state: "第一条数据",
    city: "第一条数据",
    address: "第一条数据",
    zip: "第一条数据",
    tag: "第一条数据",
  });

  const handleAddFormItems = (formItemCount: number) => {
    for (let index = 0; index < formItemCount; index++) {
      elFormItemsState.elFormItems.push({ label: "test-label" });
    }
  };
  const handleAddTableData = () => {
    tableDataState.tableData.push({
      date: "添加的数据",
      name: "添加的数据",
      state: "添加的数据",
      city: "添加的数据",
      address: "添加的数据",
      zip: "添加的数据",
      tag: "添加的数据",
    });
  };
  onMounted(() => {
    // 监听节点class 为 table-top-dom 的高度变化
    const demoFormInline = document.querySelector(".table-top-dom");
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const tableElement = entry.target as HTMLDivElement;
        stickyTopValue.value = tableElement.getBoundingClientRect().height;
      }
    });
    demoFormInline && resizeObserver.observe(demoFormInline);
    handleAddFormItems(3);
  });
</script>
<style lang="less" scoped>
  .vue3-el-table-sticky-plugin {
    overflow-y: scroll;
    height: 100%;
    width: 100%;

    .table-top-dom {
      padding: 10px;
      width: 500px;
      position: sticky;
      top: 0px;
      z-index: 10;
      background-color: #fcc630;

      :deep(.el-form-item__label) {
        color: #002ea6;
        font-weight: 600;
        font-family: "MONACO";
      }
    }
    .el-table-sticky {
      margin-top: 20px;
    }
  }
</style>
```

#### 可把上述代码复制到自己项目里面试试

### OPTIONS

| 参数   | 说明                                                  | 类型   | 默认值                                              |
| ------ | ----------------------------------------------------- | ------ | --------------------------------------------------- |
| top    | 吸顶的时候 距离顶部多少距离，可以不用传递             | number | 不传递的话就是 el-table-header 节点距离 body 的距离 |
| parent | 当前页面滚动的节点，如果是 document.body 可以不用传递 | string | body                                                |

---
