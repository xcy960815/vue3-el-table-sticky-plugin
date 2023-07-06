import { createApp } from "vue";
// @ts-ignore
import App from "./App.vue";
import Vue3TableStickyPlugin from "vue3-el-table-sticky-plugin";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
const app = createApp(App);
app.use(ElementPlus);
// 指令植入 start
app.use(Vue3TableStickyPlugin);
// 指令植入 end
app.mount("#app");
