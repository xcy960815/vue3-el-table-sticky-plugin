import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';

import BasicBodyCase from './views/BasicBodyCase.vue';
import DynamicTopCase from './views/DynamicTopCase.vue';
import MultiTableCase from './views/MultiTableCase.vue';
import ParentScrollCase from './views/ParentScrollCase.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/basic-body',
  },
  {
    path: '/basic-body',
    component: BasicBodyCase,
    meta: { title: 'Body 默认滚动' },
  },
  {
    path: '/parent-scroll',
    component: ParentScrollCase,
    meta: { title: '指定父容器' },
  },
  {
    path: '/multi-table',
    component: MultiTableCase,
    meta: { title: '多表格实例' },
  },
  {
    path: '/dynamic-top',
    component: DynamicTopCase,
    meta: { title: '动态顶部区域' },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
