import { defineConfig } from 'vitepress';

const repositoryUrl = 'https://github.com/xcy960815/vue3-el-table-sticky-plugin';
const docsUrl = 'https://xcy960815.github.io/vue3-el-table-sticky-plugin/';

export default defineConfig({
  title: 'vue3-el-table-sticky-plugin',
  description: 'Sticky table headers for Element Plus el-table in Vue 3 applications.',
  base: '/vue3-el-table-sticky-plugin/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#1d5fd1' }],
    ['meta', { name: 'author', content: 'xcy960815' }],
  ],
  themeConfig: {
    search: {
      provider: 'local',
    },
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'vue3-el-table-sticky-plugin',
      description: 'Sticky table headers for Element Plus el-table in Vue 3 applications.',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/install' },
          { text: 'API', link: '/guide/api' },
          { text: 'Demo', link: '/guide/demo' },
          { text: 'GitHub', link: repositoryUrl },
        ],
        sidebar: [
          {
            text: 'Getting Started',
            items: [
              { text: 'Introduction', link: '/' },
              { text: 'Install', link: '/guide/install' },
              { text: 'API', link: '/guide/api' },
              { text: 'Online Demo', link: '/guide/demo' },
            ],
          },
        ],
        socialLinks: [{ icon: 'github', link: repositoryUrl }],
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © xcy960815',
        },
      },
    },
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'vue3-el-table-sticky-plugin',
      description: '为 Element Plus el-table 提供表头吸顶能力的 Vue 3 指令插件。',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh-CN/guide/install' },
          { text: 'API', link: '/zh-CN/guide/api' },
          { text: '演示', link: '/zh-CN/guide/demo' },
          { text: 'GitHub', link: repositoryUrl },
        ],
        sidebar: [
          {
            text: '开始使用',
            items: [
              { text: '介绍', link: '/zh-CN/' },
              { text: '安装', link: '/zh-CN/guide/install' },
              { text: 'API', link: '/zh-CN/guide/api' },
              { text: '在线演示', link: '/zh-CN/guide/demo' },
            ],
          },
        ],
        socialLinks: [{ icon: 'github', link: repositoryUrl }],
        footer: {
          message: '基于 MIT 协议发布。',
          copyright: 'Copyright © xcy960815',
        },
      },
    },
  },
  sitemap: {
    hostname: docsUrl,
  },
});
