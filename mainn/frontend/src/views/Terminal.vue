<template>
  <div class="terminal-container">
    <el-card class="terminal-card">
      <template #header>
        <div class="card-header">
          <h2>日志查看器</h2>
        </div>
      </template>
      
      <div class="content">
        <div class="sidebar">
          <div class="file-list-header">
            <h3>日志文件</h3>
            <el-button 
              @click="refreshLogFiles" 
              size="small" 
              :icon="RefreshRight"
              :loading="loading"
            >
              刷新
            </el-button>
          </div>
          <div class="file-list">
            <div 
              v-for="file in logFiles" 
              :key="file.name" 
              :class="['file-item', selectedFile === file.name ? 'selected' : '']"
              @click="selectFile(file.name)">
              <div class="file-name">
                <el-icon><Document /></el-icon>
                <span>{{ file.name }}</span>
              </div>
              <span class="file-time">{{ formatTime(file.time) }}</span>
            </div>
            <div v-if="logFiles.length === 0" class="no-files">
              暂无日志文件
            </div>
          </div>
        </div>
        
        <div class="log-content">
          <div class="log-header">
            <div class="log-title">
              <h3>{{ selectedFile || '请选择一个日志文件' }}</h3>
            </div>
            <div class="log-actions" v-if="selectedFile">
              <el-button 
                @click="refreshLogContent" 
                size="small" 
                :icon="RefreshRight"
                :loading="loading"
              >
                刷新
              </el-button>
              <el-input
                v-model="searchTerm"
                placeholder="搜索日志内容"
                class="search-box"
                clearable
                @input="filterContent"
                @clear="clearSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
          </div>
          
          <div class="log-viewer" ref="logViewer">
            <div v-if="!selectedFile" class="no-selection">
              <el-empty description="请从左侧列表选择一个日志文件" />
            </div>
            <div v-else-if="loading" class="loading">
              <el-skeleton :rows="10" animated />
            </div>
            <div v-else-if="error" class="error">
              <el-alert
                :title="error"
                type="error"
                :closable="false"
                show-icon
              />
            </div>
            <div v-else>
              <pre v-if="filteredContent.length > 0">{{ filteredContent.join('\n') }}</pre>
              <div v-else class="no-content">
                <el-empty :description="searchTerm ? '没有找到匹配的内容' : '日志文件为空'" />
              </div>
            </div>
          </div>
          
          <div class="log-status" v-if="selectedFile && !loading">
            <span>总行数: {{ logContent.length }}</span>
            <span v-if="searchTerm">匹配行数: {{ filteredContent.length }}</span>
            <span>最后更新: {{ formatTime(new Date()) }}</span>
            <div class="auto-refresh">
              <el-switch
                v-model="autoRefresh"
                active-text="自动刷新"
              />
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import axios from 'axios'
import { Document, Search, RefreshRight } from '@element-plus/icons-vue'

export default {
  name: 'TerminalView',
  components: {
    Document,
    Search
  },
  setup() {
    const logFiles = ref([])
    const selectedFile = ref('')
    const logContent = ref([])
    const filteredContent = ref([])
    const searchTerm = ref('')
    const loading = ref(false)
    const error = ref(null)
    const autoRefresh = ref(false)
    const refreshInterval = ref(null)
    const logViewer = ref(null)
    
    const fetchLogFiles = async () => {
      try {
        loading.value = true
        const response = await axios.get('/api/logs/files')
        logFiles.value = response.data.map(file => ({
          name: file.name,
          time: new Date(file.modifiedTime)
        })).sort((a, b) => b.time - a.time)
      } catch (err) {
        console.error('获取日志文件列表失败:', err)
        error.value = '获取日志文件列表失败'
      } finally {
        loading.value = false
      }
    }
    
    const fetchLogContent = async (filename) => {
      if (!filename) return
      
      try {
        loading.value = true
        error.value = null
        const response = await axios.get(`/api/logs/content/${filename}`)
        logContent.value = response.data.content.split('\n')
        filteredContent.value = [...logContent.value]
        
        // 滚动到底部
        nextTick(() => {
          if (logViewer.value) {
            logViewer.value.scrollTop = logViewer.value.scrollHeight
          }
        })
      } catch (err) {
        console.error('获取日志内容失败:', err)
        error.value = '获取日志内容失败'
        logContent.value = []
        filteredContent.value = []
      } finally {
        loading.value = false
      }
    }
    
    const selectFile = (filename) => {
      selectedFile.value = filename
      searchTerm.value = ''
      fetchLogContent(filename)
      
      // 设置自动刷新
      setupAutoRefresh()
    }
    
    const refreshLogFiles = () => {
      fetchLogFiles()
    }
    
    const refreshLogContent = () => {
      fetchLogContent(selectedFile.value)
    }
    
    const filterContent = () => {
      if (!searchTerm.value) {
        filteredContent.value = [...logContent.value]
        return
      }
      
      filteredContent.value = logContent.value.filter(line => 
        line.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    }
    
    const clearSearch = () => {
      searchTerm.value = ''
      filteredContent.value = [...logContent.value]
    }
    
    const formatTime = (time) => {
      if (!time) return ''
      const date = new Date(time)
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }
    
    const setupAutoRefresh = () => {
      // 清除之前的定时器
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value)
      }
      
      // 如果启用了自动刷新且有选中的文件
      if (autoRefresh.value && selectedFile.value) {
        refreshInterval.value = setInterval(() => {
          refreshLogContent()
        }, 5000) // 每5秒刷新一次
      }
    }
    
    onMounted(() => {
      fetchLogFiles()
    })
    
    watch(autoRefresh, () => {
      setupAutoRefresh()
    })
    
    onBeforeUnmount(() => {
      // 组件销毁前清除定时器
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value)
      }
    })
    
    return {
      logFiles,
      selectedFile,
      logContent,
      filteredContent,
      searchTerm,
      loading,
      error,
      autoRefresh,
      logViewer,
      fetchLogFiles,
      selectFile,
      refreshLogFiles,
      refreshLogContent,
      filterContent,
      clearSearch,
      formatTime,
      RefreshRight
    }
  }
}
</script>

<style scoped>
.terminal-container {
  height: 100%;
  width: 100%;
}

.terminal-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: var(--apple-radius);
  background-color: var(--card-background);
  color: var(--text-color);
  box-shadow: 0 4px 16px var(--shadow-color);
}

.terminal-card :deep(.el-card__body) {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-color);
}

.content {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: 100%;
}

.sidebar {
  width: 250px;
  background-color: var(--background-color);
  border-right: 1px solid var(--divider-color);
  display: flex;
  flex-direction: column;
}

.file-list-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--divider-color);
}

.file-list-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
}

.file-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.file-item {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: var(--apple-radius-sm);
  margin: 0 6px 6px;
  transition: var(--apple-transition);
}

.file-item:hover {
  background-color: var(--hover-background);
}

.file-item.selected {
  background-color: var(--active-background);
  color: var(--accent-color);
}

.file-name {
  display: flex;
  align-items: center;
  gap: 6px;
}

.file-time {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
  margin-left: 22px;
}

.log-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.log-header {
  padding: 12px 16px;
  background-color: var(--card-background);
  border-bottom: 1px solid var(--divider-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.log-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-box {
  width: 200px;
}

.log-viewer {
  flex: 1;
  overflow-y: auto;
  background-color: var(--card-background);
  padding: 16px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  white-space: pre-wrap;
  line-height: 1.5;
}

pre {
  margin: 0;
  color: var(--text-color);
  font-size: 13px;
}

.log-status {
  padding: 10px 16px;
  background-color: var(--background-color);
  border-top: 1px solid var(--divider-color);
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
}

.log-status span {
  margin-right: 16px;
}

.auto-refresh {
  margin-left: auto;
}

.no-selection, .loading, .error, .no-content, .no-files {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 30px;
}

.loading {
  width: 100%;
  padding: 20px;
}
</style>