# API

## 插件导出

```ts
import Vue3TableStickyPlugin from 'vue3-el-table-sticky-plugin';
```

默认导出：

```ts
{
  install(app, installOption?)
}
```

命名导出：

```ts
export type { InstallOption, StickyOptions };
export { vue3TableStickyPlugin };
```

## StickyOptions

`v-sticky` 接收如下对象：

```ts
interface StickyOptions {
  offsetTop?: number | (() => number);
  scrollTarget?: string | HTMLElement | Window;
  boundary?: 'table' | 'scroll-container' | string | HTMLElement;
  observe?: Array<string | HTMLElement>;
  strategy?: 'auto' | 'fixed' | 'sticky';
  zIndex?: number | 'auto';
  activeClass?: string;

  /** @deprecated 请使用 offsetTop。 */
  top?: number;
  /** @deprecated 请使用 scrollTarget。 */
  parent?: string;
  /** @deprecated 请使用 observe。 */
  willBeChangeElementClasses?: string[];
}
```

## 配置项说明

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `offsetTop` | `number \| (() => number)` | 当前表头距离视口顶部的位置 | 表头吸顶后距离当前滚动视口顶部的距离。 |
| `scrollTarget` | `string \| HTMLElement \| Window` | 最近可滚动祖先，其次是 `window` | 用于吸顶计算的滚动容器。 |
| `boundary` | `'table' \| 'scroll-container' \| string \| HTMLElement` | `'table'` | 触达底部后释放吸顶表头的边界元素。 |
| `observe` | `Array<string \| HTMLElement>` | `[]` | 会影响吸顶位置的元素列表，这些元素尺寸变化时会触发布局重算。 |
| `strategy` | `'auto' \| 'fixed' \| 'sticky'` | `'auto'` | 预留策略配置，当前实现使用 fixed 定位渲染。 |
| `zIndex` | `number \| 'auto'` | `'auto'` | 表头吸顶时的层级。 |
| `activeClass` | `string` | `'fixed'` | 表头吸顶时附加的 class。 |
| `top` | `number` | - | 已废弃，作为 `offsetTop` 的兼容别名。 |
| `parent` | `string` | - | 已废弃，作为 `scrollTarget` 的兼容别名。 |
| `willBeChangeElementClasses` | `string[]` | - | 已废弃，作为 `observe` 的兼容别名。 |

## 配置优先级

配置按照以下优先级解析：

1. 指令参数，例如 `v-sticky="{ offsetTop: 64 }"`。
2. 插件安装参数，例如 `app.use(Vue3TableStickyPlugin, { offsetTop: 64 })`。
3. 插件内部默认兜底值。

## 滚动容器规则

插件会监听指定的滚动容器。表格必须位于这个容器内部，并且这个容器必须是实际发生滚动的元素。

推荐写法：

```css
.page-scroll {
  height: 100%;
  overflow-y: auto;
}
```

如果没有传 `scrollTarget`，插件会自动查找最近的可滚动祖先，找不到时回退到 `window`。

如果你想验证“外层业务容器滚动”的场景，不要同时给 `el-table` 设置固定高度。因为 Element Plus 设置 `height` 后会让表格 body 自己滚动，而插件监听的是外层父容器，这两者不一致时吸顶不会触发。

## 安装默认值与指令覆盖

```ts
app.use(Vue3TableStickyPlugin, {
  offsetTop: 64,
  scrollTarget: '.app-main',
});
```

```vue
<el-table
  v-sticky="{
    offsetTop: 0,
    scrollTarget: '.page-scroll',
    boundary: 'table',
    observe: ['.toolbar'],
  }"
/>
```

## 构建产物

发布包会导出：

- `dist/vue3-el-table-sticky-plugin.esm.js`
- `dist/vue3-el-table-sticky-plugin.umd.js`
- `types/vue3-el-table-sticky-plugin.d.ts`
