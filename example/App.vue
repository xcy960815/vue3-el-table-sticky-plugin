<template>
    <div class='vue3-el-table-sticky-plugin'>
        <el-form inline class="demo-form-inline">
            <el-form-item label="Approved by">
                <el-input placeholder="Approved by" />
            </el-form-item>
            <el-form-item label="Approved by">
                <el-input placeholder="Approved by" />
            </el-form-item>
            <el-form-item label="Approved by">
                <el-input placeholder="Approved by" />
            </el-form-item>
            <el-form-item label="Approved by">
                <el-input placeholder="Approved by" />
            </el-form-item>
            <el-form-item label="Approved by">
                <el-input placeholder="Approved by" />
            </el-form-item>
            <el-form-item label="Approved by">
                <el-input placeholder="Approved by" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary">Query</el-button>
            </el-form-item>
        </el-form>

        <!-- v-sticky="{ top: vStickyTop }" -->
        <el-table class="el-sticky-table" :data="tableDataState.tableData"
            :header-cell-style="{ background: 'rgb(240, 240, 240)' }" border v-sticky
            :style="{ width: `${tableWidth}%` }">
            <el-table-column fixed="left" prop="date" label="Date" width="150">
                <template #default="params">
                    <span :style="{ color: params.row.date === '第一条数据' ? 'red' : '' }">{{ params.row.date }}</span>
                </template>
            </el-table-column>
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
// import elementResizeDetectorMaker from 'element-resize-detector'

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
const vStickyTop = ref(100)

// // 控制table组件宽度+10%
// const handleTableWidthAdd10 = () => {
//     tableWidth.value += 10
// }
// // 控制table组件宽度+10%
// const handleTableWidthReduce10 = () => {
//     tableWidth.value -= 10
// }

onMounted(() => {
    // 获取自身距离顶部的距离
    // vStickyTop.value = document.querySelector<HTMLElement>(".el-sticky-table")?.getBoundingClientRect().top || 0
    // // vStickyTop.value = vStickyTop.value - 10
    // console.log('用户设置的top值', vStickyTop.value);
    // setTimeout(() => {
    //     vStickyTop.value = vStickyTop.value - 10
    // }, 5000)

    // const elementResizeDetector = elementResizeDetectorMaker()

    // elementResizeDetector.listenTo(document.querySelector<HTMLElement>(".demo-form-inline"), (eleement: HTMLElement) => {
    //     console.log('eleement.offsetHeight', eleement.offsetHeight);

    // })
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
        })
    }
    tableDataState.tableData.unshift({
        date: '第一条数据',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Home',
    })

})
</script>
<style lang='less' scoped>
.vue3-el-table-sticky-plugin {
    position: relative;
    overflow-y: scroll;
    height: 100%;
    width: 100%;

    .demo-form-inline {
        padding: 15px;
        position: sticky;
        // position: fixed;
        // position: relative;
        top: 0;
        z-index: 10;
        background-color: red;
        // background-color: #fff;
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
        background-color: aqua;
    }


}
</style>