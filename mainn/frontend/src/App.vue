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
              
              <el-menu-item index="/reminders">
                <el-icon><icon-alarm-clock /></el-icon>
                <template #title>
                  <span class="menu-item-text">提醒管理</span>
                </template>
              </el-menu-item>
            </div>
            
            <div class="menu-section">
              <p class="menu-label" v-if="!isCollapse">高级功能</p>
              <el-menu-item index="/terminal">
                <el-icon><icon-terminal /></el-icon>
                <template #title>
                  <span class="menu-item-text">终端</span>
                </template>
              </el-menu-item>
              
              <el-menu-item index="/chat">
                <el-icon><icon-chat /></el-icon>
                <template #title>
                  <span class="menu-item-text">聊天</span>
                </template>
              </el-menu-item>
              
              <el-menu-item index="/database">
                <el-icon><icon-data-analysis /></el-icon>
                <template #title>
                  <span class="menu-item-text">数据库</span>
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
                  <el-dropdown-item>个人设置</el-dropdown-item>
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
:root {
  --apple-background: #ffffff;
  --apple-bg-secondary: #f5f5f7;
  --apple-text-primary: #1d1d1f;
  --apple-text-secondary: #86868b;
  --apple-accent: #0066cc;
  --apple-success: #34c759;
  --apple-warning: #ff9500;
  --apple-error: #ff3b30;
  --apple-info: #007aff;
  --apple-border: #d2d2d7;
  --apple-border-light: rgba(0, 0, 0, 0.05);
  --apple-hover: #f5f5f7;
  --apple-shadow: rgba(0, 0, 0, 0.05);
  --apple-shadow-deeper: rgba(0, 0, 0, 0.1);
  --apple-sidebar-width: 220px;
  --apple-sidebar-mini-width: 64px;
  --apple-radius-sm: 6px;
  --apple-radius: 10px;
  --apple-radius-lg: 14px;
  --apple-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  color: var(--apple-text-primary);
  background-color: var(--apple-bg-secondary);
  overflow: hidden;
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
  background-color: var(--apple-background);
  box-shadow: 1px 0 0 0 var(--apple-border-light);
  transition: width 0.3s ease;
  z-index: 1001;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: var(--apple-sidebar-mini-width) !important;
}

.sidebar-header {
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 0 0 var(--apple-border-light);
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
  background-color: rgba(0, 102, 204, 0.1);
  color: var(--apple-accent);
  font-weight: 500;
}

.sidebar-menu .el-menu-item:hover {
  background-color: var(--apple-hover);
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
  color: var(--apple-text-secondary);
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
  border-top: 1px solid var(--apple-border-light);
  margin-top: 24px;
  padding-top: 16px;
}

/* 头部样式 */
.main-header {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 0 var(--apple-border-light);
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
  color: var(--apple-text-secondary);
}

.toggle-sidebar-btn:hover {
  color: var(--apple-accent);
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
  background-color: var(--apple-bg-secondary);
}

/* 页脚样式 */
.main-footer {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 -1px 0 0 var(--apple-border-light);
  padding: 0 24px;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--apple-text-secondary);
  font-size: 12px;
}

.divider {
  margin: 0 8px;
  color: var(--apple-border);
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
  box-shadow: 0 4px 16px var(--apple-shadow);
  overflow: hidden;
}

.el-card__header {
  border-bottom: 1px solid var(--apple-border-light);
  padding: 16px 20px;
}

.el-button--primary {
  background-color: var(--apple-accent);
  border-color: var(--apple-accent);
}

.el-button--primary:hover, 
.el-button--primary:focus {
  background-color: #0077ed;
  border-color: #0077ed;
}

.el-button--success {
  background-color: var(--apple-success);
  border-color: var(--apple-success);
}

.el-button--warning {
  background-color: var(--apple-warning);
  border-color: var(--apple-warning);
}

.el-button--danger {
  background-color: var(--apple-error);
  border-color: var(--apple-error);
}

.el-dropdown-menu {
  border-radius: var(--apple-radius-sm);
  box-shadow: 0 6px 16px var(--apple-shadow-deeper);
  border: none;
  padding: 6px;
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