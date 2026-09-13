<template>
  <StickyCaseTable
    title="动态顶部区域"
    description="不断增加表单项，验证 observe 监听高度变化后重新计算吸顶位置。"
    parent-selector=".not-layout-page"
    header-color="var(--vetp-header-b)"
  />
</template>

<script lang="ts" setup>
import StickyCaseTable from '../components/StickyCaseTable.vue';
</script>
