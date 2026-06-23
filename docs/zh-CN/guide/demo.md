# 在线演示

文档站直接复用了仓库 `src/views` 中维护的示例组件，所以线上文档和本地调试看到的是同一套场景逻辑。

## 本地 Vite Demo 路由

| 地址               | 场景                     |
| ------------------ | ------------------------ |
| `/#/basic-body`    | 默认 body 滚动           |
| `/#/parent-scroll` | 指定父级滚动容器         |
| `/#/multi-table`   | 同一容器中的多个吸顶表格 |
| `/#/dynamic-top`   | 顶部工具栏高度变化后重算 |

## 在线场景

<div class="doc-demo-grid">
  <div class="doc-demo-card">
    <h2>Body 默认滚动</h2>
    <p>页面式内容区域滚动时，表头会自动吸顶。</p>
    <div class="doc-demo-stage">
      <ClientOnly>
        <BasicBodyCase />
      </ClientOnly>
    </div>
  </div>

  <div class="doc-demo-card">
    <h2>指定父容器</h2>
    <p>当真正滚动的是业务容器而不是 window 时，通过 <code>scrollTarget</code> 显式指定。</p>
    <div class="doc-demo-stage">
      <ClientOnly>
        <ParentScrollCase />
      </ClientOnly>
    </div>
  </div>

  <div class="doc-demo-card">
    <h2>多表格实例</h2>
    <p>两个表格共享同一个滚动容器，但吸顶状态彼此隔离。</p>
    <div class="doc-demo-stage">
      <ClientOnly>
        <MultiTableCase />
      </ClientOnly>
    </div>
  </div>

  <div class="doc-demo-card">
    <h2>动态顶部区域</h2>
    <p>工具栏高度变化后会通过 observe 自动重算吸顶偏移。</p>
    <div class="doc-demo-stage">
      <ClientOnly>
        <DynamicTopCase />
      </ClientOnly>
    </div>
  </div>
</div>

<div class="doc-note-grid">
  <div class="doc-note">
    可以直接在文档页里点击按钮添加表格行、增加顶部表单项，观察吸顶效果是否稳定。
  </div>
  <div class="doc-note">
    如果你想用完整路由方式调试，运行 <code>pnpm dev</code> 后访问上面的 hash 路由即可。
  </div>
</div>
