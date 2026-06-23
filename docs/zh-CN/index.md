---
layout: home

hero:
  name: vue3-el-table-sticky-plugin
  text: Element Plus 表格表头吸顶插件
  tagline: 一个 Vue 3 指令插件，让 el-table 在页面滚动或业务滚动容器中保持表头吸顶。
  actions:
    - theme: brand
      text: 快速开始
      link: /zh-CN/guide/install
    - theme: alt
      text: 在线演示
      link: /zh-CN/guide/demo
    - theme: alt
      text: GitHub
      link: https://github.com/xcy960815/vue3-el-table-sticky-plugin

features:
  - title: 同时支持页面滚动和容器滚动
    details: 可以直接使用默认页面滚动，也可以通过 scrollTarget 指定业务滚动容器。
  - title: 多表格实例互不干扰
    details: 每个 el-table 都维护独立吸顶状态，适合复杂后台页面和多表格视图。
  - title: 顶部布局变化后自动重算
    details: 通过 observe 监听工具栏、筛选区等高度变化，避免吸顶偏移失准。
---

## 你可以获得什么

- 基于指令的接入方式，不需要改动既有 `el-table` 的列定义和数据结构。
- 支持插件安装时配置全局默认值，也支持在单个表格上按需覆盖。
- 文档站直接复用仓库中的真实 demo 组件，线上演示和本地调试保持一致。

## 快速入口

- 安装指南：[/zh-CN/guide/install](/zh-CN/guide/install)
- API 参考：[/zh-CN/guide/api](/zh-CN/guide/api)
- 在线演示：[/zh-CN/guide/demo](/zh-CN/guide/demo)
