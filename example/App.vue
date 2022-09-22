<template>
  <div class="vue3-el-table-sticky-plugin">
    <el-form inline class="demo-form-inline">
      <el-form-item
        :label="formItem.label"
        v-for="formItem in elFormItemsState.elFormItems"
      >
        <el-input placeholder="Approved by" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAddFormItems(1)"
          >添加一条数据</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-sticky="{ top: stickyValue }"
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
const stickyValue = ref<number>(0);
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
  // 监听节点class 为 demo-form-inline 的高度变化
  const demoFormInline = document.querySelector(".demo-form-inline");
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const tableElement = entry.target as HTMLDivElement;
      stickyValue.value = tableElement.getBoundingClientRect().height;
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

  // margin-top: 100px;
  .el-form {
    padding: 10px;
  }

  .demo-form-inline {
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

  .demo-form-inline-1 {
    background-color: #002ea6;

    :deep(.el-form-item__label) {
      color: #fcc630;
      font-weight: 600;
      font-family: "MONACO";
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
    background-color: aqua;
  }
}
</style>
