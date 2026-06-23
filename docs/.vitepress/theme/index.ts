import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import Vue3TableStickyPlugin from '../../../plugin/index';
import BasicBodyCase from '../../../src/views/BasicBodyCase.vue';
import DynamicTopCase from '../../../src/views/DynamicTopCase.vue';
import MultiTableCase from '../../../src/views/MultiTableCase.vue';
import ParentScrollCase from '../../../src/views/ParentScrollCase.vue';

import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus);
    app.use(Vue3TableStickyPlugin);
    app.component('BasicBodyCase', BasicBodyCase);
    app.component('ParentScrollCase', ParentScrollCase);
    app.component('MultiTableCase', MultiTableCase);
    app.component('DynamicTopCase', DynamicTopCase);
  },
} satisfies Theme;
