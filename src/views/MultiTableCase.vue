<template>
  <StickyCaseTable
    title="多表格实例"
    description="同一个滚动容器内放置多个 v-sticky 表格，验证状态隔离。"
    parent-selector=".not-layout-page"
  >
    <template #default="{ tableData }">
      <el-table
        v-sticky="{
          top: 0,
          parent: '.not-layout-page',
          willBeChangeElementClasses: ['.table-top-dom'],
        }"
        class="el-table-sticky secondary-table"
        :data="tableData.slice(0, 8)"
        :header-cell-style="{ background: 'rgb(34, 139, 34)' }"
        border
        style="height: 300px"
      >
        <el-table-column fixed="left" prop="date" label="Date" width="150" />
        <el-table-column fixed="left" prop="name" label="Name" width="250" />
        <el-table-column prop="state" label="State" width="250" />
        <el-table-column prop="city" label="City" width="250" />
        <el-table-column prop="address" label="Address" width="620" />
        <el-table-column fixed="right" prop="zip" label="Zip" width="120" />
      </el-table>
    </template>
  </StickyCaseTable>
</template>

<script lang="ts" setup>
import StickyCaseTable from '../components/StickyCaseTable.vue';
</script>
