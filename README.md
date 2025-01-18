# FSD-Map-Lite

![License](https://img.shields.io/badge/license-GPL3.0-blue.svg)

· [项目预览地址](https://cdn.xliaobk.cn/FSD-Map-Lite/index.html)

**FSD-Map-Lite** 是一款基于 **Leaflet** 的轻量级实时模拟飞行地图应用，旨在显示飞行员和管制员的实时位置信息。该应用已实现联飞地图的基础功能，若您有更多需求，欢迎联系 **XLiao**：2456666787。

---

## 文件说明

### 核心文件
- `index.html`：网页主体结构，包含地图容器、侧边栏、在线列表等 UI 元素。
- `XLY_map.js`：核心功能实现
  - 地图初始化与配置
  - 实时数据更新
  - 标记物管理
  - 事件处理
  - UTC 时间显示
  - 在线列表功能
  - 侧边栏信息展示
- `XLY_data.js`：数据处理核心
  - 数据解析与存储
  - 图标管理
  - 数据查询接口

### 样式文件
- `XLY_map.css`：统一样式管理
  - 地图基础样式
  - 导航栏样式
  - 侧边栏样式
  - 在线列表样式
  - 动画效果

### 资源文件
- `img/`：图标资源目录
  - `pilot.png`：飞行员位置标记图标
  - `atc.png`：管制员位置标记图标

### 数据文件
- `map.txt`：实时数据源
  - 包含飞行员的位置、高度、速度等信息
  - 包含管制员的位置、频率等信息
  - 每 500ms 自动更新一次

---

## 快速上手

> 修改 **FSD** 文件夹中的 `fsd.conf` 配置文件，将 `whazzup=whazzup.txt` 修改为 `whazzup=FSD-Map-Lite目录/map.txt`，即可启用此功能。
