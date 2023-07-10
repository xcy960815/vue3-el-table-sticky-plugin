<p align="center" >
<font size="5">vue3-el-table-sticky-plugin</font>
</p>
<br/>

[![npm](https://img.shields.io/npm/v/vue3-el-table-sticky-plugin.svg)](https://www.npmjs.com/package/vue3-el-table-sticky-plugin) [![npm](https://img.shields.io/npm/dw/vue3-el-table-sticky-plugin.svg)](https://npmtrends.com/vue3-el-table-sticky-plugin) [![npm](https://img.shields.io/npm/l/vue3-el-table-sticky-plugin.svg?sanitize=true)](https://www.npmjs.com/package/vue3-el-table-sticky-plugin) [![vue3](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://vuejs.org/) [![vue3](https://img.shields.io/badge/vue--cli-4.x-brightgreen.svg)](https://cli.vuejs.org/)

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

    3. willBeChangeElementClasses 可选参数 (参数优先级 指令使用处 > 指令注册处

    4. 实际使用情况还会更复杂 本插件只是在理想状态下面做的封装 如有不足还请指出

#### 引入

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import Vue3TableStickyPlugin from 'vue3-el-table-sticky-plugin';
const app = createApp(App);
// 注入全局指令
app.use(Vue3TableStickyPlugin);
app.mount('#app');
```

#### 使用

```html
<!-- xxx.vue -->
<template>
  <el-container class="layout-main">
    <el-header>头部导航栏</el-header>
    <el-container class="layout-body">
      <el-aside class="layout-aside"> 左侧菜单栏 </el-aside>
      <el-main class="layout-page">
        <el-main class="page-content">
          <!-- 因为这个只是开发测试demo 所以就写在一个文件里面 就行本人喜欢将固定的滚动写在layout布局里面 极端场景会将滚动写在具体的业务 .vue文件的根节点上 -->
          <!-- 业务 .vue文件的根节点 -->
          <div class="not-layout-page">
            <el-form inline class="table-top-dom">
              <el-form-item
                :label="formItem.label"
                v-for="formItem in elFormItemsState.elFormItems"
              >
                <el-input placeholder="Approved by" />
              </el-form-item>
            </el-form>
            <el-table
              class="el-table-sticky"
              v-sticky="{
                top: stickyTopValue,
                parent: '.not-layout-page',
                willBeChangeElementClasses: ['.table-top-dom'],
              }"
              :data="tableDataState.tableData"
              :header-cell-style="{ background: 'rgb(0, 0, 255)' }"
              border
              style="100%"
            >
              <el-table-column fixed="left" prop="date" label="Date" width="150"></el-table-column>
              <el-table-column fixed="left" prop="name" label="Name" width="250" />
              <el-table-column prop="state" label="State" width="250" />
              <el-table-column prop="city" label="City" width="250" />
              <el-table-column prop="address" label="Address" width="620" />
              <el-table-column fixed="right" prop="zip" label="Zip" width="120" />
              <el-table-column fixed="right" label="操作" width="180">
                <template #default>
                  <el-button link type="primary" size="small" @click="handleAddFormItems(1)">
                    给表单添加一条数据
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
  import { app } from './App';
  const { stickyTopValue, elFormItemsState, tableDataState, handleAddFormItems } = app();
</script>
<style lang="less" scoped>
  .layout-main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;

    .el-header {
      background-color: rgb(0, 21, 41);
      color: #fff;
      font-size: 16px;
      font-family: 'Courier New', Courier, monospace;
      font-weight: 600;
      text-align: center;
      line-height: 60px;
    }

    .layout-body {
      display: flex;
      overflow: hidden;

      .layout-aside {
        width: 200px;
        background-color: rgb(0, 21, 41);
        transition: all 0.4s ease 0s;
        color: #fff;
        font-size: 16px;
        font-family: 'Courier New', Courier, monospace;
        font-weight: 600;
        text-align: center;
        line-height: 60px;
      }

      .layout-page {
        overflow: hidden;
        --el-main-padding: 10px;
        padding: var(--el-main-padding);
        flex: 1;
        display: flex;
        flex-direction: column;

        .page-content {
          padding: 0;
          overflow-y: auto;
          flex: 1;
          width: 100%;

          .not-layout-page {
            height: 100%;
            overflow-y: auto;
          }
          .table-top-dom {
            box-sizing: border-box;
            padding: 10px;
            width: 50%;
            background-color: #fcc630;
            // overflow-anchor: none;

            :deep(.el-form-item__label) {
              color: #002ea6;
              font-weight: 600;
              font-family: 'MONACO';
            }
          }
        }

        .page-footer {
          width: 100%;
          // background-color: #ccc;
          padding: 0.5em 10px;
          border-top: 1px dashed #ccc;
          border-bottom: 1px dashed #ccc;
        }
      }
    }
  }
</style>
```

```ts
// app.ts
import { onMounted, reactive, ref } from 'vue';

export const app = function () {
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
      date: '2016-05-03',
      name: 'Tom',
      state: 'California',
      city: 'Los Angeles',
      address: 'No. 189, Grove St, Los Angeles',
      zip: 'CA 90036',
      tag: 'Home',
    });
  }
  tableDataState.tableData.unshift({
    date: '第一条数据',
    name: '第一条数据',
    state: '第一条数据',
    city: '第一条数据',
    address: '第一条数据',
    zip: '第一条数据',
    tag: '第一条数据',
  });

  const handleAddFormItems = (formItemCount: number) => {
    for (let index = 0; index < formItemCount; index++) {
      elFormItemsState.elFormItems.push({ label: 'test-label' });
    }
  };

  const handleAddTableData = () => {
    tableDataState.tableData.push({
      date: '添加的数据',
      name: '添加的数据',
      state: '添加的数据',
      city: '添加的数据',
      address: '添加的数据',
      zip: '添加的数据',
      tag: '添加的数据',
    });
  };
  onMounted(() => {
    // 监听节点class 为 table-top-dom 的高度变化
    const tableTopDom = document.querySelector('.table-top-dom');
    const tableElementResizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const targetElement = entry.target as HTMLDivElement;
        stickyTopValue.value = targetElement.getBoundingClientRect().top;
      }
    });
    tableTopDom && tableElementResizeObserver.observe(tableTopDom);

    handleAddFormItems(3);
  });

  return {
    stickyTopValue,
    elFormItemsState,
    tableDataState,
    handleAddTableData,
    handleAddFormItems,
  };
};
```

#### 可把上述代码复制到自己项目里面试试

### OPTIONS

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| top | 吸顶的时候 距离顶部多少距离，可以不用传递 | number | 不传递的话就是 按照当前距离固定 |
| parent | 当前页面滚动的节点，如果是 document.body 可以不用传递 | string | body |
| willBeChangeElementClasses | 会影响 tableHeader 到 body 顶部距离的 dom 节点(tableHeader 和 body 顶部之间高度会发生变化的 dom 节点，一般没有，动态表格、动态表单会存在这种情况) | string[] | [] |

---
