<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1>设置</h1>
      <div class="header-actions">
        <button @click="saveSettings" class="apple-btn primary-btn" :disabled="!hasChanges">
          保存
        </button>
      </div>
    </div>

    <div class="settings-content">
      <div class="settings-sidebar">
        <div 
          v-for="(section, index) in settingsSections" 
          :key="index" 
          :class="['sidebar-item', activeSection === section.id ? 'active' : '']"
          @click="activeSection = section.id">
          <i :class="section.icon"></i>
          <span>{{ section.name }}</span>
        </div>
        
        <div class="sidebar-actions">
          <button @click="resetSettings" class="text-btn reset-btn" :disabled="!hasChanges">
            <i class="fas fa-undo"></i> 重置更改
          </button>
        </div>
      </div>

      <div class="settings-main">
        <!-- 系统设置 -->
        <div v-if="activeSection === 'system'" class="settings-section">
          <h2>系统设置</h2>
          
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-header">
                <label>API 服务地址</label>
                <div class="setting-desc">设置后端 API 服务的地址</div>
              </div>
              <div class="setting-control">
                <input 
                  type="text" 
                  v-model="settings.system.apiUrl" 
                  placeholder="http://localhost:3000" 
                  class="apple-input"
                />
              </div>
            </div>
            
            <div class="setting-divider"></div>
            
            <div class="setting-item">
              <div class="setting-header">
                <label>日志级别</label>
                <div class="setting-desc">设置系统日志记录的详细程度</div>
              </div>
              <div class="setting-control">
                <select v-model="settings.system.logLevel" class="apple-select">
                  <option value="debug">调试</option>
                  <option value="info">信息</option>
                  <option value="warn">警告</option>
                  <option value="error">错误</option>
                </select>
              </div>
            </div>
            
            <div class="setting-divider"></div>
            
            <div class="setting-item">
              <div class="setting-header">
                <label>日志保留时间</label>
                <div class="setting-desc">设置日志文件的最长保留天数</div>
              </div>
              <div class="setting-control">
                <div class="number-input-container">
                  <input 
                    type="number" 
                    v-model.number="settings.system.logRetentionDays" 
                    min="1" 
                    max="365"
                    class="apple-input"
                  />
                  <span class="input-suffix">天</span>
                </div>
              </div>
            </div>

            <div class="setting-divider"></div>

            <div class="setting-item">
              <div class="setting-header">
                <label>自动备份</label>
                <div class="setting-desc">定期自动备份系统数据</div>
              </div>
              <div class="setting-control">
                <div class="apple-toggle">
                  <input 
                    type="checkbox" 
                    id="autoBackup" 
                    v-model="settings.system.autoBackup" 
                  />
                  <label for="autoBackup"></label>
                </div>
              </div>
            </div>

            <div class="setting-item sub-setting" v-if="settings.system.autoBackup">
              <div class="setting-header">
                <label>备份频率</label>
                <div class="setting-desc">设置自动备份的频率</div>
              </div>
              <div class="setting-control">
                <select v-model="settings.system.backupFrequency" class="apple-select">
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 界面设置 -->
        <div v-if="activeSection === 'interface'" class="settings-section">
          <h2>界面设置</h2>
          
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-header">
                <label>外观</label>
                <div class="setting-desc">设置界面主题风格</div>
              </div>
              <div class="setting-control">
                <div class="theme-selector">
                  <div 
                    v-for="option in [{value: 'light', label: '浅色'}, {value: 'dark', label: '深色'}, {value: 'system', label: '自动'}]" 
                    :key="option.value"
                    :class="['theme-option', settings.interface.theme === option.value ? 'selected' : '']"
                    @click="settings.interface.theme = option.value"
                  >
                    <div class="theme-preview" :class="option.value"></div>
                    <div class="theme-label">{{ option.label }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="setting-divider"></div>
            
            <div class="setting-item">
              <div class="setting-header">
                <label>语言</label>
                <div class="setting-desc">设置界面显示语言</div>
              </div>
              <div class="setting-control">
                <select v-model="settings.interface.language" class="apple-select">
                  <option value="zh_CN">简体中文</option>
                  <option value="en_US">English</option>
                </select>
              </div>
            </div>
            
            <div class="setting-divider"></div>
            
            <div class="setting-item">
              <div class="setting-header">
                <label>表格分页</label>
                <div class="setting-desc">设置表格每页默认显示的行数</div>
              </div>
              <div class="setting-control">
                <select v-model="settings.interface.tablePageSize" class="apple-select">
                  <option v-for="size in [10, 20, 50, 100]" :key="size" :value="size">
                    {{ size }} 行/页
                  </option>
                </select>
              </div>
            </div>
            
            <div class="setting-divider"></div>
            
            <div class="setting-item">
              <div class="setting-header">
                <label>动画效果</label>
                <div class="setting-desc">启用或禁用界面动画效果</div>
              </div>
              <div class="setting-control">
                <div class="apple-toggle">
                  <input 
                    type="checkbox" 
                    id="enableAnimation" 
                    v-model="settings.interface.enableAnimation" 
                  />
                  <label for="enableAnimation"></label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 通知设置 -->
        <div v-if="activeSection === 'notification'" class="settings-section">
          <h2>通知设置</h2>
          
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-header">
                <label>桌面通知</label>
                <div class="setting-desc">启用系统桌面通知</div>
              </div>
              <div class="setting-control">
                <div class="apple-toggle">
                  <input 
                    type="checkbox" 
                    id="enableNotification" 
                    v-model="settings.notification.enabled" 
                  />
                  <label for="enableNotification"></label>
                </div>
              </div>
            </div>
            
            <div v-if="settings.notification.enabled">
              <div class="setting-divider"></div>
              
              <div class="setting-item sub-setting">
                <div class="setting-header">
                  <label>错误通知</label>
                  <div class="setting-desc">当系统发生错误时显示通知</div>
                </div>
                <div class="setting-control">
                  <div class="apple-toggle">
                    <input 
                      type="checkbox" 
                      id="errorNotification" 
                      v-model="settings.notification.showErrors" 
                    />
                    <label for="errorNotification"></label>
                  </div>
                </div>
              </div>
              
              <div class="setting-divider"></div>
              
              <div class="setting-item sub-setting">
                <div class="setting-header">
                  <label>任务完成通知</label>
                  <div class="setting-desc">当长时间任务完成时显示通知</div>
                </div>
                <div class="setting-control">
                  <div class="apple-toggle">
                    <input 
                      type="checkbox" 
                      id="taskNotification" 
                      v-model="settings.notification.showTaskCompletion" 
                    />
                    <label for="taskNotification"></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 高级设置 -->
        <div v-if="activeSection === 'advanced'" class="settings-section">
          <h2>高级设置</h2>
          
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-header">
                <label>实验功能</label>
                <div class="setting-desc">启用实验性功能 (可能不稳定)</div>
              </div>
              <div class="setting-control">
                <div class="apple-toggle">
                  <input 
                    type="checkbox" 
                    id="experimentalFeatures" 
                    v-model="settings.advanced.experimentalFeatures" 
                  />
                  <label for="experimentalFeatures"></label>
                </div>
              </div>
            </div>
            
            <div class="setting-divider"></div>
            
            <div class="setting-item">
              <div class="setting-header">
                <label>调试模式</label>
                <div class="setting-desc">启用调试模式，显示更多技术信息</div>
              </div>
              <div class="setting-control">
                <div class="apple-toggle">
                  <input 
                    type="checkbox" 
                    id="debugMode" 
                    v-model="settings.advanced.debugMode" 
                  />
                  <label for="debugMode"></label>
                </div>
              </div>
            </div>
            
            <div class="setting-divider"></div>
            
            <div class="setting-item">
              <div class="setting-header">
                <label>API 请求超时</label>
                <div class="setting-desc">设置 API 请求的超时时间</div>
              </div>
              <div class="setting-control">
                <div class="number-input-container">
                  <input 
                    type="number" 
                    v-model.number="settings.advanced.apiTimeout" 
                    min="1" 
                    max="120"
                    class="apple-input"
                  />
                  <span class="input-suffix">秒</span>
                </div>
              </div>
            </div>
            
            <div class="setting-divider"></div>
            
            <div class="setting-item">
              <div class="setting-header">
                <label>重置数据</label>
                <div class="setting-desc warning">此操作将清除所有设置和本地数据，且不可恢复</div>
              </div>
              <div class="setting-control">
                <button class="apple-btn danger-btn" @click="showResetConfirm = true">
                  <i class="fas fa-trash"></i> 重置所有数据
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <transition name="fade">
      <div class="modal-overlay" v-if="showSaveSuccess || showResetConfirm" @click.self="closeModals">
        <div class="modal-content" :class="{ 'success': showSaveSuccess, 'warning': showResetConfirm }">
          <div v-if="showSaveSuccess" class="modal-icon success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div v-if="showSaveSuccess" class="modal-body">
            <h3>设置已保存</h3>
            <p>您的设置已成功保存并应用。</p>
            <div class="modal-actions">
              <button @click="showSaveSuccess = false" class="apple-btn primary-btn">确定</button>
            </div>
          </div>
          
          <div v-if="showResetConfirm" class="modal-icon warning-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div v-if="showResetConfirm" class="modal-body">
            <h3>确认重置</h3>
            <p>此操作将清除所有设置和本地数据，且<strong>不可恢复</strong>！确定要继续吗？</p>
            <div class="modal-actions">
              <button @click="showResetConfirm = false" class="apple-btn secondary-btn">取消</button>
              <button @click="resetAllData" class="apple-btn danger-btn">确认重置</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SettingsView',
  data() {
    return {
      // 设置分区
      activeSection: 'system',
      
      // 原始设置备份 (用于检测变更)
      originalSettings: null,
      
      // 当前设置
      settings: {
        system: {
          apiUrl: 'http://localhost:3000',
          logLevel: 'info',
          logRetentionDays: 30,
          autoBackup: false,
          backupFrequency: 'weekly'
        },
        interface: {
          theme: 'light',
          language: 'zh_CN',
          tablePageSize: 20,
          enableAnimation: true
        },
        notification: {
          enabled: true,
          showErrors: true,
          showTaskCompletion: true
        },
        advanced: {
          experimentalFeatures: false,
          debugMode: false,
          apiTimeout: 30
        }
      },
      
      // UI状态
      showSaveSuccess: false,
      showResetConfirm: false,
      
      // 设置区域定义
      settingsSections: [
        { id: 'system', name: '系统设置', icon: 'fas fa-cog' },
        { id: 'interface', name: '界面设置', icon: 'fas fa-desktop' },
        { id: 'notification', name: '通知设置', icon: 'fas fa-bell' },
        { id: 'advanced', name: '高级设置', icon: 'fas fa-tools' }
      ]
    }
  },
  computed: {
    // 检测设置是否有变更
    hasChanges() {
      return JSON.stringify(this.settings) !== JSON.stringify(this.originalSettings)
    }
  },
  mounted() {
    this.loadSettings()
    this.loadFontAwesome()
  },
  watch: {
    'settings.interface.theme': {
      handler(newTheme) {
        this.applyTheme(newTheme)
      }
    }
  },
  methods: {
    loadFontAwesome() {
      // 如果页面没有加载 Font Awesome，则添加
      if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css'
        document.head.appendChild(link)
      }
    },
    closeModals() {
      this.showSaveSuccess = false
      this.showResetConfirm = false
    },
    async loadSettings() {
      try {
        // 从localStorage中加载
        const savedSettings = localStorage.getItem('appSettings')
        if (savedSettings) {
          this.settings = JSON.parse(savedSettings)
        }
        
        // 也可以从API加载，取决于系统设计
        // const response = await axios.get('/api/system/settings')
        // this.settings = response.data
        
        // 保存原始设置的深拷贝，用于检测变更
        this.originalSettings = JSON.parse(JSON.stringify(this.settings))
        
        // 应用已保存的主题
        if (this.settings.interface && this.settings.interface.theme) {
          this.applyTheme(this.settings.interface.theme)
        }
      } catch (err) {
        console.error('加载设置失败:', err)
      }
    },
    applyTheme(theme) {
      // 移除所有主题类
      document.body.classList.remove('theme-light', 'theme-dark')
      
      // 应用选择的主题
      if (theme === 'system') {
        // 检测系统主题偏好
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        document.body.classList.add(prefersDarkMode ? 'theme-dark' : 'theme-light')
        
        // 监听系统主题变化
        if (window.matchMedia) {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          mediaQuery.addEventListener('change', e => {
            if (this.settings.interface.theme === 'system') {
              document.body.classList.remove('theme-light', 'theme-dark')
              document.body.classList.add(e.matches ? 'theme-dark' : 'theme-light')
            }
          })
        }
      } else {
        // 直接应用明确的主题
        document.body.classList.add(`theme-${theme}`)
      }
    },
    async saveSettings() {
      try {
        // 将设置保存到localStorage
        localStorage.setItem('appSettings', JSON.stringify(this.settings))
        
        // 也可以向API保存，取决于系统设计
        // await axios.post('/api/system/settings', this.settings)
        
        // 更新原始设置
        this.originalSettings = JSON.parse(JSON.stringify(this.settings))
        
        // 显示成功提示
        this.showSaveSuccess = true
        setTimeout(() => {
          this.showSaveSuccess = false
        }, 2000)
      } catch (err) {
        console.error('保存设置失败:', err)
        alert('保存设置失败: ' + err.message)
      }
    },
    resetSettings() {
      // 重置为上次保存的设置
      this.settings = JSON.parse(JSON.stringify(this.originalSettings))
    },
    resetAllData() {
      // 删除所有本地数据
      localStorage.removeItem('appSettings')
      
      // 重置为默认设置
      this.settings = {
        system: {
          apiUrl: 'http://localhost:3000',
          logLevel: 'info',
          logRetentionDays: 30,
          autoBackup: false,
          backupFrequency: 'weekly'
        },
        interface: {
          theme: 'light',
          language: 'zh_CN',
          tablePageSize: 20,
          enableAnimation: true
        },
        notification: {
          enabled: true,
          showErrors: true,
          showTaskCompletion: true
        },
        advanced: {
          experimentalFeatures: false,
          debugMode: false,
          apiTimeout: 30
        }
      }
      
      // 更新原始设置
      this.originalSettings = JSON.parse(JSON.stringify(this.settings))
      
      // 关闭确认弹窗
      this.showResetConfirm = false
      
      // 显示成功提示
      this.showSaveSuccess = true
      setTimeout(() => {
        this.showSaveSuccess = false
      }, 2000)
    }
  }
}
</script> 

<style>
/* 应用主题到全局body元素 */
body {
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

/* 主题变量 - 浅色主题（默认） */
:root {
  --background-color: #f5f5f7;
  --card-background: #ffffff;
  --text-color: #1d1d1f;
  --text-secondary: #86868b;
  --border-color: rgba(0, 0, 0, 0.1);
  --hover-background: rgba(0, 0, 0, 0.03);
  --active-background: rgba(0, 122, 255, 0.1);
  --input-background: rgba(0, 0, 0, 0.02);
  --sidebar-background: rgba(255, 255, 255, 0.5);
  --header-background: rgba(255, 255, 255, 0.8);
  --divider-color: rgba(0, 0, 0, 0.05);
  --accent-color: #007aff;
  --toggle-background: rgba(0, 0, 0, 0.1);
  --toggle-active: #34c759;
  --danger-color: #ff3b30;
  --modal-backdrop: rgba(0, 0, 0, 0.3);
  --success-color: #34c759;
  --shadow-color: rgba(0, 0, 0, 0.05);
}

/* 深色主题 */
.theme-dark {
  --background-color: #1a1a1c;
  --card-background: #2c2c2e;
  --text-color: #ffffff;
  --text-secondary: #aeaeb2;
  --border-color: rgba(255, 255, 255, 0.1);
  --hover-background: rgba(255, 255, 255, 0.05);
  --active-background: rgba(10, 132, 255, 0.2);
  --input-background: rgba(255, 255, 255, 0.05);
  --sidebar-background: rgba(44, 44, 46, 0.5);
  --header-background: rgba(28, 28, 30, 0.8);
  --divider-color: rgba(255, 255, 255, 0.1);
  --accent-color: #0a84ff;
  --toggle-background: rgba(255, 255, 255, 0.2);
  --toggle-active: #30d158;
  --danger-color: #ff453a;
  --modal-backdrop: rgba(0, 0, 0, 0.5);
  --success-color: #30d158;
  --shadow-color: rgba(0, 0, 0, 0.2);
}

/* 基础样式 */
.settings-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 头部样式 */
.settings-header {
  background-color: var(--header-background);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.settings-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 内容区域 */
.settings-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 侧边栏 */
.settings-sidebar {
  width: 230px;
  background-color: var(--sidebar-background);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.sidebar-item {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid var(--divider-color);
  color: var(--text-color);
  transition: all 0.2s ease;
}

.sidebar-item i {
  margin-right: 12px;
  width: 20px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 1rem;
}

.sidebar-item:hover {
  background-color: var(--hover-background);
}

.sidebar-item.active {
  background-color: var(--active-background);
  color: var(--accent-color);
}

.sidebar-item.active i {
  color: var(--accent-color);
}

.sidebar-actions {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid var(--border-color);
}

/* 主内容区域 */
.settings-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.settings-section h2 {
  margin-top: 0;
  margin-bottom: 24px;
  padding-bottom: 8px;
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
}

.settings-group {
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--shadow-color);
  overflow: hidden;
  margin-bottom: 24px;
}

/* 设置项 */
.setting-item {
  display: flex;
  padding: 16px 24px;
  align-items: center;
  justify-content: space-between;
}

.setting-item.sub-setting {
  padding-left: 40px;
  background-color: var(--hover-background);
}

.setting-header {
  flex: 1;
}

.setting-control {
  width: 40%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.setting-divider {
  height: 1px;
  background-color: var(--divider-color);
  margin: 0 24px;
}

.setting-item label {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--text-color);
}

.setting-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

.setting-desc.warning {
  color: var(--danger-color);
}

/* 数字输入框容器 */
.number-input-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.input-suffix {
  margin-left: 8px;
  color: #86868b;
}

/* 表单控件样式 */
.apple-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.95rem;
  color: var(--text-color);
  background-color: var(--input-background);
  transition: all 0.2s ease;
}

.apple-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
}

input[type="number"].apple-input {
  width: 80px;
  text-align: center;
}

.apple-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  padding: 10px 12px;
  padding-right: 30px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--input-background);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  color: var(--text-color);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apple-select:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
}

/* 主题选择器 */
.theme-selector {
  display: flex;
  gap: 16px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.theme-option:hover {
  opacity: 0.9;
}

.theme-option.selected {
  opacity: 1;
}

.theme-preview {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin-bottom: 8px;
  overflow: hidden;
  position: relative;
}

.theme-preview.light {
  background-color: #ffffff;
}

.theme-preview.dark {
  background-color: #1d1d1f;
}

.theme-preview.system {
  background: linear-gradient(to right, #ffffff 50%, #1d1d1f 50%);
}

.theme-preview.selected {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.3);
}

.theme-label {
  font-size: 0.85rem;
  color: var(--text-color);
}

/* 按钮样式 */
button {
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

button i {
  margin-right: 8px;
}

.apple-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
}

.primary-btn {
  background-color: var(--accent-color);
  color: white;
}

.primary-btn:hover {
  background-color: #0064d1;
}

.secondary-btn {
  background-color: var(--hover-background);
  color: var(--text-color);
}

.secondary-btn:hover {
  background-color: var(--active-background);
}

.danger-btn {
  background-color: var(--danger-color);
  color: white;
}

.danger-btn:hover {
  background-color: #e02d23;
}

.text-btn {
  background: transparent;
  color: var(--accent-color);
  padding: 8px 12px;
}

.text-btn:hover {
  background-color: var(--active-background);
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 开关按钮样式 */
.apple-toggle {
  position: relative;
  display: inline-block;
  width: 51px;
  height: 31px;
}

.apple-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.apple-toggle label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--toggle-background);
  border-radius: 34px;
  transition: .2s;
}

.apple-toggle label:before {
  position: absolute;
  content: "";
  height: 27px;
  width: 27px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: .2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.apple-toggle input:checked + label {
  background-color: var(--toggle-active);
}

.apple-toggle input:checked + label:before {
  transform: translateX(20px);
}

.apple-toggle input:focus + label {
  box-shadow: 0 0 1px var(--toggle-active);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--modal-backdrop);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  display: flex;
  background-color: var(--card-background);
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  overflow: hidden;
  box-shadow: 0 10px 30px var(--shadow-color);
}

.modal-icon {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.success-icon {
  color: var(--success-color);
  background-color: rgba(52, 199, 89, 0.1);
}

.warning-icon {
  color: var(--danger-color);
  background-color: rgba(255, 59, 48, 0.1);
}

.modal-body {
  flex: 1;
  padding: 24px;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-weight: 500;
  color: var(--text-color);
}

.modal-content p {
  color: var(--text-secondary);
  margin-bottom: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  gap: 12px;
}

/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>