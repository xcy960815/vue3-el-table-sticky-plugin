<template>
    <div class='vue3-el-table-sticky-plugin'>
        <div class="vue3-el-table-sticky-plugin-title">
            <h3>vue3-el-table-sticky-plugin-demo</h3>
            <el-button class="handle-buttton" @click="handleTableWidthAdd10">
                控制table宽度 + 10%
            </el-button>
            <el-button class="handle-buttton" @click="handleTableWidthReduce10">
                控制table宽度 - 10%
            </el-button>
        </div>

        <el-table class="el-sticky-table" :data="tableDataState.tableData"
            :header-cell-style="{ background: 'rgb(240, 240, 240)' }" border
            v-sticky="{ top: vStickyTop, parent: '.vue3-el-table-sticky-plugin' }" :style="{ width: `${tableWidth}%` }">
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
import { onMounted, reactive, ref } from "vue"

const tableDataState = reactive<{
    tableData: Array<{
        date: string,
        name: string,
        state: string,
        city: string,
        address: string,
        zip: string,
        tag: string,
    }>
}>({
    tableData: []
})
const tableWidth = ref<number>(100)
// 绑定动态数据
const vStickyTop = ref(0)

// 控制table组件宽度+10%
const handleTableWidthAdd10 = () => {
    tableWidth.value += 10
}
// 控制table组件宽度+10%
const handleTableWidthReduce10 = () => {
    tableWidth.value -= 10
}

onMounted(() => {

    // 获取自身距离顶部的距离
    vStickyTop.value = document.querySelector<HTMLElement>(".el-sticky-table")?.getBoundingClientRect().top || 0

    // 模拟数据
    for (let index = 0; index < 50; index++) {
        tableDataState.tableData.push({
            date: '2016-05-03',
            name: 'Tom',
            state: 'California',
            city: 'Los Angeles',
            address: 'No. 189, Grove St, Los Angeles',
            zip: 'CA 90036',
            tag: 'Home',
        })
    }

})
</script>
<style lang='less' scoped>
.vue3-el-table-sticky-plugin {
    position: relative;
    overflow-y: scroll;
    height: 100%;
    width: 100%;

    .vue3-table-sticky-test-box {
        display: flex;
        width: 100%;
        max-width: 100%;
        // overflow: hidden;
        position: relative;

        .other-dom-box {
            transition: all 0.5s;
            width: 200px;
            min-width: 200px;
            background-color: aqua;
            height: 100px;
        }

        .el-table-box {
            flex: 1
        }
    }

    .vue3-el-table-sticky-plugin-title {
        text-align: center;
        position: sticky;
        top: 0;
        z-index: 9;
        opacity: 1;
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
    }


}
</style>