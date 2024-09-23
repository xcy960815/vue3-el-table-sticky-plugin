import { createApp } from 'vue';
import App from './App.vue';
import './App.css';
import Vue3TableStickyPlugin from '../table-sticky-plugin/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
const app = createApp(App);
app.use(ElementPlus);
// 指令植入 start
app.use(Vue3TableStickyPlugin);
// 指令植入 end
app.mount('#app');
