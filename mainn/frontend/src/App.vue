<template>
  <div id="app">
    <el-container class="main-container">
      <!-- 侧边栏导航 -->
      <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar" :class="{ 'collapsed': isCollapse }">
        <div class="sidebar-header">
          <div class="logo-container">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8.75 16.54C7.33 15.66 6.5 13.87 6.5 12C6.5 10.14 7.33 8.34 8.75 7.46V16.54ZM12 17.5C11.17 17.5 10.4 16.9 10.4 16V8C10.4 7.1 11.17 6.5 12 6.5C12.83 6.5 13.6 7.1 13.6 8V16C13.6 16.9 12.83 17.5 12 17.5ZM15.25 16.54V7.46C16.67 8.34 17.5 10.14 17.5 12C17.5 13.87 16.67 15.66 15.25 16.54Z" 
                  fill="url(#paint0_linear)" />
                <defs>
                  <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#0066CC" />
                    <stop offset="1" stop-color="#5AC8FA" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 class="logo-text" :class="{ 'hidden': isCollapse }">XxxBot</h1>
          </div>
        </div>
        
        <el-scrollbar class="sidebar-scrollbar">
          <el-menu
            :default-active="activeMenuItem"
            class="sidebar-menu"
            :router="true"
            :collapse="isCollapse"
            :collapse-transition="false"
          >
            <div class="menu-section">
              <p class="menu-label" v-if="!isCollapse">主要功能</p>
              <el-menu-item index="/dashboard">
                <el-icon><icon-menu /></el-icon>
                <template #title>
                  <span class="menu-item-text">控制台</span>
                </template>
              </el-menu-item>
              
              <el-menu-item index="/system">
                <el-icon><icon-setting /></el-icon>
                <template #title>
                  <span class="menu-item-text">系统管理</span>
                </template>
              </el-menu-item>
              
              <el-menu-item index="/plugins">
                <el-icon><icon-connection /></el-icon>
                <template #title>
                  <span class="menu-item-text">插件管理</span>
                </template>
              </el-menu-item>
              
              <el-menu-item index="/files">
                <el-icon><icon-folder /></el-icon>
                <template #title>
                  <span class="menu-item-text">文件管理</span>
                </template>
              </el-menu-item>
            </div>
            
            <div class="menu-section">
              <p class="menu-label" v-if="!isCollapse">平台与账户</p>
              <el-menu-item index="/contacts">
                <el-icon><icon-user /></el-icon>
                <template #title>
                  <span class="menu-item-text">消息平台</span>
                </template>
              </el-menu-item>
              
              <el-menu-item index="/accounts">
                <el-icon><icon-key /></el-icon>
                <template #title>
                  <span class="menu-item-text">账户管理</span>
                </template>
              </el-menu-item>
              
              <el-menu-item index="/notification">
                <el-icon><icon-bell /></el-icon>
                <template #title>
                  <span class="menu-item-text">通知管理</span>
                </template>
              </el-menu-item>
              
            </div>
            
            <div class="menu-section">
              <p class="menu-label" v-if="!isCollapse">高级功能</p>
              <el-menu-item index="/terminal">
                <el-icon><icon-terminal /></el-icon>
                <template #title>
                  <span class="menu-item-text">终端/日志查看器</span>
                </template>
              </el-menu-item>
            </div>
            
            <div class="menu-section menu-footer">
              <p class="menu-label" v-if="!isCollapse">设置</p>
              <el-menu-item index="/settings">
                <el-icon><icon-setting /></el-icon>
                <template #title>
                  <span class="menu-item-text">设置</span>
                </template>
              </el-menu-item>
              
              <el-menu-item index="/about">
                <el-icon><icon-info-filled /></el-icon>
                <template #title>
                  <span class="menu-item-text">关于</span>
                </template>
              </el-menu-item>
            </div>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      
      <!-- 主内容区域 -->
      <el-container>
        <el-header height="60px" class="main-header">
          <div class="header-left">
            <el-button 
              type="text" 
              class="toggle-sidebar-btn"
              @click="toggleSidebar"
            >
              <el-icon>
                <icon-fold v-if="!isCollapse" />
                <icon-expand v-else />
              </el-icon>
            </el-button>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <div class="version-tag" v-if="hasUpdate">
              <span>有新版本！</span>
            </div>
            <el-button type="primary" size="small" plain v-if="hasUpdate">更新</el-button>
            <el-dropdown trigger="click">
              <span class="user-profile">
                <el-avatar size="small">A</el-avatar>
                <span class="user-name">账户</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <el-main class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
        
        <el-footer height="40px" class="main-footer">
          <div class="footer-content">
            <span>WebUI 版本: v3.5.9</span>
            <span class="divider">|</span>
            <span>AGPL-3.0</span>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const isCollapse = ref(false)
    const hasUpdate = ref(true)
    
    const activeMenuItem = computed(() => {
      return route.path
    })
    
    const toggleSidebar = () => {
      isCollapse.value = !isCollapse.value
    }
    
    return {
      isCollapse,
      activeMenuItem,
      toggleSidebar,
      hasUpdate
    }
  }
}
</script>

<style>
/* 主题变量 - 浅色主题（默认） */
:root {
  /* 背景颜色 */
  --background-color: #f5f5f7;
  --card-background: #ffffff;
  --sidebar-background: rgba(255, 255, 255, 0.7);
  --header-background: rgba(255, 255, 255, 0.8);
  
  /* 文本颜色 */
  --text-color: #1d1d1f;
  --text-secondary: #86868b;
  
  /* 主题和状态颜色 */
  --accent-color: #0066cc;
  --success-color: #34c759;
  --warning-color: #ff9500;
  --danger-color: #ff3b30;
  --info-color: #007aff;
  
  /* 边框和分割线 */
  --border-color: #d2d2d7;
  --divider-color: rgba(0, 0, 0, 0.05);
  
  /* 交互状态 */
  --hover-background: rgba(0, 0, 0, 0.03);
  --active-background: rgba(0, 102, 204, 0.1);
  --input-background: rgba(0, 0, 0, 0.02);
  
  /* 开关组件 */
  --toggle-background: rgba(0, 0, 0, 0.1);
  --toggle-active: #34c759;
  
  /* 阴影 */
  --shadow-color: rgba(0, 0, 0, 0.05);
  --shadow-deeper: rgba(0, 0, 0, 0.1);
  --modal-backdrop: rgba(0, 0, 0, 0.3);
  
  /* 布局和尺寸 */
  --apple-sidebar-width: 220px;
  --apple-sidebar-mini-width: 64px;
  --apple-radius-sm: 6px;
  --apple-radius: 10px;
  --apple-radius-lg: 14px;
  --apple-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 深色主题 */
.theme-dark {
  /* 背景颜色 */
  --background-color: #1a1a1c;
  --card-background: #2c2c2e;
  --sidebar-background: rgba(44, 44, 46, 0.7);
  --header-background: rgba(28, 28, 30, 0.8);
  
  /* 文本颜色 */
  --text-color: #ffffff;
  --text-secondary: #aeaeb2;
  
  /* 主题和状态颜色 */
  --accent-color: #0a84ff;
  --success-color: #30d158;
  --warning-color: #ff9f0a;
  --danger-color: #ff453a;
  --info-color: #64d2ff;
  
  /* 边框和分割线 */
  --border-color: #38383a;
  --divider-color: rgba(255, 255, 255, 0.1);
  
  /* 交互状态 */
  --hover-background: rgba(255, 255, 255, 0.05);
  --active-background: rgba(10, 132, 255, 0.2);
  --input-background: rgba(255, 255, 255, 0.05);
  
  /* 开关组件 */
  --toggle-background: rgba(255, 255, 255, 0.2);
  --toggle-active: #30d158;
  
  /* 阴影 */
  --shadow-color: rgba(0, 0, 0, 0.2);
  --shadow-deeper: rgba(0, 0, 0, 0.3);
  --modal-backdrop: rgba(0, 0, 0, 0.5);
}

/* 向后兼容的变量定义 */
:root {
  --apple-background: var(--card-background);
  --apple-bg-secondary: var(--background-color);
  --apple-text-primary: var(--text-color);
  --apple-text-secondary: var(--text-secondary);
  --apple-accent: var(--accent-color);
  --apple-success: var(--success-color);
  --apple-warning: var(--warning-color);
  --apple-error: var(--danger-color);
  --apple-info: var(--info-color);
  --apple-border: var(--border-color);
  --apple-border-light: var(--divider-color);
  --apple-hover: var(--hover-background);
  --apple-shadow: var(--shadow-color);
  --apple-shadow-deeper: var(--shadow-deeper);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--background-color);
  overflow: hidden;
  transition: background-color 0.3s, color 0.3s;
}

#app {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.main-container {
  height: 100vh;
}

/* 侧边栏样式 */
.sidebar {
  background-color: var(--sidebar-background);
  box-shadow: 1px 0 0 0 var(--divider-color);
  transition: width 0.3s ease;
  z-index: 1001;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.sidebar.collapsed {
  width: var(--apple-sidebar-mini-width) !important;
}

.sidebar-header {
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 0 0 var(--divider-color);
  z-index: 2;
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  transition: var(--apple-transition);
}

.logo-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.sidebar.collapsed .logo-icon {
  transform: scale(1.1);
}

.logo-text {
  font-size: 22px;
  font-weight: 500;
  background: linear-gradient(90deg, #0066cc, #5ac8fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  white-space: nowrap;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.logo-text.hidden {
  opacity: 0;
  transform: translateX(-10px);
  position: absolute;
}

.sidebar-scrollbar {
  height: calc(100% - 60px);
  flex: 1;
}

.sidebar-scrollbar :deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

.sidebar-menu {
  border-right: none !important;
  background-color: transparent;
  height: 100%;
}

.sidebar-menu.el-menu--collapse {
  width: var(--apple-sidebar-mini-width);
}

.sidebar-menu .el-menu-item {
  height: 44px;
  line-height: 44px;
  border-radius: 6px;
  padding: 0 14px !important;
  margin: 4px 10px;
  transition: all 0.2s ease;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: var(--active-background);
  color: var(--accent-color);
  font-weight: 500;
}

.sidebar-menu .el-menu-item:hover {
  background-color: var(--hover-background);
  transform: translateX(2px);
}

.sidebar-menu .el-menu-item .el-icon {
  margin-right: 10px;
  font-size: 18px;
  transition: transform 0.2s ease;
}

.sidebar-menu .el-menu-item:hover .el-icon {
  transform: scale(1.1);
}

.menu-section {
  padding-top: 8px;
  margin-bottom: 8px;
}

.menu-label {
  font-size: 12px;
  color: var(--text-secondary);
  padding: 0 24px;
  margin: 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.menu-item-text {
  font-size: 14px;
  transition: var(--apple-transition);
}

.menu-footer {
  margin-top: auto;
  padding-bottom: 16px;
  border-top: 1px solid var(--divider-color);
  margin-top: 24px;
  padding-top: 16px;
}

/* 头部样式 */
.main-header {
  background-color: var(--header-background);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 0 var(--divider-color);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-sidebar-btn {
  margin-right: 16px;
  padding: 6px;
  color: var(--text-secondary);
}

.toggle-sidebar-btn:hover {
  color: var(--accent-color);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.version-tag {
  padding: 4px 10px;
  background-color: rgba(255, 149, 0, 0.1);
  color: var(--apple-warning);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 100px;
  transition: var(--apple-transition);
}

.user-profile:hover {
  background-color: var(--apple-hover);
}

.user-name {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
}

/* 主内容区样式 */
.main-content {
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--background-color);
}

/* 页脚样式 */
.main-footer {
  background-color: var(--header-background);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 -1px 0 0 var(--divider-color);
  padding: 0 24px;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
  font-size: 12px;
}

.divider {
  margin: 0 8px;
  color: var(--border-color);
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 覆盖Element Plus样式 */
.el-card {
  border-radius: var(--apple-radius);
  border: none;
  box-shadow: 0 4px 16px var(--shadow-color);
  overflow: hidden;
  background-color: var(--card-background);
  color: var(--text-color);
}

.el-card__header {
  border-bottom: 1px solid var(--divider-color);
  padding: 16px 20px;
}

.el-button--primary {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
}

.el-button--primary:hover, 
.el-button--primary:focus {
  background-color: #0077ed;
  border-color: #0077ed;
}

.el-button--success {
  background-color: var(--success-color);
  border-color: var(--success-color);
}

.el-button--warning {
  background-color: var(--warning-color);
  border-color: var(--warning-color);
}

.el-button--danger {
  background-color: var(--danger-color);
  border-color: var(--danger-color);
}

.el-dropdown-menu {
  border-radius: var(--apple-radius-sm);
  box-shadow: 0 6px 16px var(--shadow-deeper);
  border: none;
  padding: 6px;
  background-color: var(--card-background);
  color: var(--text-color);
}

.el-dropdown-menu__item {
  border-radius: 4px;
}

.el-tag {
  border-radius: 100px;
  padding: 0 10px;
  height: 26px;
  line-height: 26px;
}

.el-pagination {
  padding: 0;
  font-weight: normal;
}

.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link {
  color: var(--apple-text-secondary);
  font-weight: normal;
}

.el-breadcrumb__inner {
  color: var(--apple-text-primary);
}
</style> 