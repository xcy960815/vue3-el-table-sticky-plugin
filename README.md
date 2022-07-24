### vue3-el-table-sticky-plugin 

#### 一个让 element-plus el-table 头部吸顶的vue3插件

#### 安装
```npm
npm i vue3-el-table-sticky-plugin -S
```
or
```npm
yarn add vue3-el-table-sticky-plugin
```


#### 引入
```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import Vue3TableStickyPlugin from "vue3-el-table-sticky-plugin"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App)
app.use(ElementPlus)

// 指令植入 start
app.use(Vue3TableStickyPlugin)
// 指令植入 end
app.mount("#app");

```
#### 使用
```html
<!-- xxx.vue -->
<template>
    <div class='vue3-el-table-sticky-plugin'>

        <!-- 注意：这里的 top 有两层意思 -->
        <!-- 1. 吸顶的时候 距离顶部多少距离 -->
        <!-- 2. 距离顶部多少距离的时候 就开始吸顶 -->
        <!-- parent 当前页面滚动的节点 如果是document.body 可以不用传递 -->
        <el-table 
            v-sticky="{ top: vStickyTop, parent: '.vue3-el-table-sticky-plugin' }" 
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

<script lang='ts' setup>
import { onMounted, reactive ref } from "vue"

const tableDataState = reactive({
    tableData:[
        ...多条数据
    ]
})

// 绑定动态数据
const vStickyTop = ref(0)

onMounted(() => {
    // 动态 获取自身距离顶部的距离 意思就是头部就定在当前位置
    vStickyTop.value = document.querySelector<HTMLElement>(".el-sticky-table")?.getBoundingClientRect().top || 0

})
</script>
<style lang='less' scoped>
.vue3-el-table-sticky-plugin {
    position: relative;
    /* 注意我给 class 为 vue3-el-table-sticky-plugin 的节点设置了滚动属性 
        parent参数的值就是 ".vue3-el-table-sticky-plugin" */
    overflow-y: scroll;
    height: 100%;
    width: 100%;
}
</style>
```
#### TODO
1. 因为时间问题，暂不支持全局配置。未来要支持全局；



