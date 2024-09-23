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
            <!-- willBeChangeElementClasses: ['.table-top-dom'], -->
            <el-table
              class="el-table-sticky"
              v-sticky="{
                top: stickyTopValue,
                parent: '.not-layout-page',
              }"
              :data="tableDataState.tableData"
              :header-cell-style="{ background: 'rgb(0, 0, 255)' }"
              border
              style="height: 100%"
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
import { onMounted, reactive, ref } from 'vue';

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
/**
 * @desc 向表格中添加一条数据
 */
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
  const targetElementTop = tableTopDom?.getBoundingClientRect().top;
  stickyTopValue.value = targetElementTop || 0;
  console.log('stickyTopValue', stickyTopValue.value);

  handleAddFormItems(2);
});
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
