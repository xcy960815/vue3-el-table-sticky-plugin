<template>
  <div class="app-shell">
    <div class="backdrop" aria-hidden="true">
      <div class="backdrop-glow backdrop-glow-a"></div>
      <div class="backdrop-glow backdrop-glow-b"></div>
      <div class="backdrop-grid"></div>
    </div>

    <header class="app-header">
      <a class="brand" href="#/basic-body">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="M4 10h16M10 10v9" />
            <path d="M4 7.5h16" class="pin-line" />
          </svg>
        </span>
        <span class="brand-name">el-table-<strong>sticky</strong></span>
      </a>

      <nav class="header-actions">
        <button class="icon-button" type="button" aria-label="切换明暗主题" @click="toggleTheme">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"
            />
          </svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 13.2A8.2 8.2 0 0 1 10.8 4 8.2 8.2 0 1 0 20 13.2Z" />
          </svg>
        </button>
        <a class="github-link" :href="repoUrl" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0 1 12 6.82a9.55 9.55 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
            />
          </svg>
          <span>GitHub</span>
        </a>
      </nav>
    </header>

    <section class="hero-strip">
      <div class="hero-main">
        <div class="hero-badges">
          <span class="badge badge-live"><i></i>Live Demo</span>
          <span class="badge">v0.0.18</span>
          <span class="badge">指令式接入</span>
          <span class="badge">MIT</span>
        </div>
        <h1>钉住每一张表头。<span class="grad">滚动再多也不乱。</span></h1>
      </div>
      <div class="install-pill">
        <code>npm i vue3-el-table-sticky-plugin</code>
        <button class="icon-button" type="button" aria-label="复制安装命令" @click="copyInstall">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="8" y="8" width="11" height="11" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
        </button>
      </div>
    </section>

    <main class="playground">
      <aside class="case-nav">
        <p class="case-nav-title">演示场景</p>
        <router-link
          v-for="route in caseRoutes"
          :key="route.path"
          class="case-link"
          :to="route.path"
        >
          {{ route.meta?.title }}
        </router-link>
        <p class="case-nav-note">切换场景后滚动内容区，观察表头吸顶与边界行为。</p>
      </aside>
      <section class="layout-page">
        <router-view />
      </section>
    </main>

    <div class="toast-stack" aria-live="polite"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { routes } from './router';

const caseRoutes = routes.filter((route) => route.meta?.title);

const repoUrl = 'https://github.com/xcy960815/vue3-el-table-sticky-plugin';
const installCommand = 'npm i vue3-el-table-sticky-plugin';

const isDark = ref(document.documentElement.dataset.theme !== 'light');

const applyTheme = (dark: boolean) => {
  const theme = dark ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('dark', dark);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#070a0f' : '#f4f6fa');
  try {
    localStorage.setItem('vetp-demo-theme', theme);
  } catch {
    /* localStorage 不可用时仅对当前会话生效 */
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
};

const showToast = (message: string, kind: 'ok' | 'err' = 'ok') => {
  const stack = document.querySelector('.toast-stack');
  if (!stack) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${kind}`;
  toast.textContent = message;
  stack.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add('leaving');
    window.setTimeout(() => toast.remove(), 240);
  }, 2200);
};

const copyInstall = async () => {
  try {
    await navigator.clipboard.writeText(installCommand);
    showToast('安装命令已复制');
  } catch {
    showToast('复制失败', 'err');
  }
};
</script>
