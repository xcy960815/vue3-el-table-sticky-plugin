import { onMounted, reactive, ref } from "vue";

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
    const tableTopDom = document.querySelector(".table-top-dom");
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const targetElement = entry.target as HTMLDivElement;
        stickyTopValue.value = targetElement.getBoundingClientRect().top;
      }
    });
    tableTopDom && resizeObserver.observe(tableTopDom);

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
