<template>
  <StickyCaseTable
    title="指定父容器滚动"
    description="传入 scrollTarget: '.not-layout-page'，验证业务容器内滚动时表头吸顶。"
    parent-selector=".not-layout-page"
  />
</template>

<script lang="ts" setup>
import StickyCaseTable from '../components/StickyCaseTable.vue';
</script>
