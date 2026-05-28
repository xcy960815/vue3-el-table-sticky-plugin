<template>
  <section :class="['case-page', { 'body-scroll-case': !parentSelector }]">
    <header class="case-header">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </header>

    <div :class="scrollClass">
      <el-form v-if="showToolbar" inline class="table-top-dom">
        <el-form-item v-for="formItem in formItems" :key="formItem.id" :label="formItem.label">
          <el-input placeholder="Approved by" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addFormItems(1)">添加顶部表单项</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-sticky="stickyOptions"
        class="el-table-sticky"
        :data="tableData"
        :header-cell-style="{ background: headerColor }"
        border
        :style="tableStyle"
      >
        <el-table-column fixed="left" prop="date" label="Date" width="150" />
        <el-table-column fixed="left" prop="name" label="Name" width="250" />
        <el-table-column prop="state" label="State" width="250" />
        <el-table-column prop="city" label="City" width="250" />
        <el-table-column prop="address" label="Address" width="620" />
        <el-table-column fixed="right" prop="zip" label="Zip" width="120" />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default>
            <el-button link type="primary" size="small" @click="addTableRow">添加表格行</el-button>
          </template>
        </el-table-column>
      </el-table>

      <slot :sticky-options="stickyOptions" :table-data="tableData" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive } from 'vue';

interface TableRow {
  date: string;
  name: string;
  state: string;
  city: string;
  address: string;
  zip: string;
  tag: string;
}

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    parentSelector?: string;
    scrollClass?: string;
    tableHeight?: string;
    headerColor?: string;
    showToolbar?: boolean;
  }>(),
  {
    parentSelector: '',
    scrollClass: 'not-layout-page',
    tableHeight: '',
    headerColor: 'rgb(0, 0, 255)',
    showToolbar: true,
  },
);

const formItems = reactive<Array<{ id: number; label: string }>>([]);
const tableData = reactive<TableRow[]>([]);

const stickyOptions = computed(() => ({
  scrollTarget: props.parentSelector || undefined,
  offsetTop: 0,
  boundary: 'table' as const,
  observe: props.showToolbar ? ['.table-top-dom'] : [],
}));

const tableStyle = computed(() => {
  return props.tableHeight ? { height: props.tableHeight } : undefined;
});

for (let index = 0; index < 49; index++) {
  tableData.push(createRow('2016-05-03'));
}
tableData.unshift(createRow('第一条数据'));

function createRow(seed: string): TableRow {
  return {
    date: seed,
    name: seed === '2016-05-03' ? 'Tom' : seed,
    state: seed === '2016-05-03' ? 'California' : seed,
    city: seed === '2016-05-03' ? 'Los Angeles' : seed,
    address: seed === '2016-05-03' ? 'No. 189, Grove St, Los Angeles' : seed,
    zip: seed === '2016-05-03' ? 'CA 90036' : seed,
    tag: 'Home',
  };
}

function addFormItems(formItemCount: number) {
  for (let index = 0; index < formItemCount; index++) {
    formItems.push({
      id: Date.now() + index,
      label: 'test-label',
    });
  }
}

function addTableRow() {
  tableData.push(createRow('添加的数据'));
}

onMounted(async () => {
  await nextTick();
  addFormItems(2);
});
</script>
