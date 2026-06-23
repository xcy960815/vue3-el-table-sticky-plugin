# Online Demo

The documentation site reuses the same demo case components maintained in `src/views`, so local development and published docs stay aligned.

## Demo Routes in Local Vite App

| Route              | Scenario                                     |
| ------------------ | -------------------------------------------- |
| `/#/basic-body`    | Default body scroll behavior                 |
| `/#/parent-scroll` | Custom parent scroll container               |
| `/#/multi-table`   | Multiple sticky tables in the same container |
| `/#/dynamic-top`   | Recalculate after toolbar height changes     |

## Live Scenarios

<div class="doc-demo-grid">
  <div class="doc-demo-card">
    <h2>Body Scroll</h2>
    <p>The table header sticks when the page-like content area scrolls.</p>
    <div class="doc-demo-stage">
      <ClientOnly>
        <BasicBodyCase />
      </ClientOnly>
    </div>
  </div>

  <div class="doc-demo-card">
    <h2>Parent Scroll Container</h2>
    <p>Use <code>scrollTarget</code> when a business container, not the window, owns scrolling.</p>
    <div class="doc-demo-stage">
      <ClientOnly>
        <ParentScrollCase />
      </ClientOnly>
    </div>
  </div>

  <div class="doc-demo-card">
    <h2>Multiple Sticky Tables</h2>
    <p>Two tables share one scroll container while keeping sticky state isolated.</p>
    <div class="doc-demo-stage">
      <ClientOnly>
        <MultiTableCase />
      </ClientOnly>
    </div>
  </div>

  <div class="doc-demo-card">
    <h2>Dynamic Top Region</h2>
    <p>Toolbar height changes are observed so the sticky offset recalculates automatically.</p>
    <div class="doc-demo-stage">
      <ClientOnly>
        <DynamicTopCase />
      </ClientOnly>
    </div>
  </div>
</div>

<div class="doc-note-grid">
  <div class="doc-note">
    Use the buttons inside each demo to add rows or grow the toolbar and inspect sticky behavior directly in the docs page.
  </div>
  <div class="doc-note">
    For local debugging with full routing, run <code>pnpm dev</code> and open the hash routes listed above.
  </div>
</div>
