<template>
  <el-container class="layout-main">
    <el-header>vue3-el-table-sticky-plugin</el-header>
    <el-container class="layout-body">
      <el-aside class="layout-aside">
        <router-link v-for="route in routes" :key="route.path" class="case-link" :to="route.path">
          {{ route.meta?.title }}
        </router-link>
      </el-aside>
      <el-main class="layout-page">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { routes } from './router';
</script>
