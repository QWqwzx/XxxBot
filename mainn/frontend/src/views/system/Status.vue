<template>
  <div class="system-status-page">

    <!-- 系统概览卡片 -->
    <div class="overview-section">
      <h2 class="section-title">
        <el-icon><icon-monitor /></el-icon>
        系统概览
        <span class="last-updated">最后更新: {{ formattedDate }}</span>
      </h2>
      
      <el-row :gutter="24" class="stat-cards">
        <!-- 运行时间卡片 -->
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <div class="stat-card">
            <div class="stat-icon runtime-icon">
              <el-icon><icon-timer /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">运行时间</div>
              <div class="stat-value">{{ systemData.uptime || '15:48:27' }}</div>
              <div class="stat-detail">启动于 {{ systemData.startTime || '2025-05-16 06:51:19' }}</div>
            </div>
          </div>
        </el-col>
        
        <!-- 内存占用卡片 -->
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <div class="stat-card">
            <div class="stat-icon memory-icon">
              <el-icon><icon-data-board /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">内存占用</div>
              <div class="stat-value">{{ systemData.memoryUsed || '1.23GB' }} / {{ systemData.memoryTotal || '3.56GB' }}</div>
              <div class="progress-container">
                <div class="progress-bar" :style="{ width: systemData.memoryPercent || '35%' }"></div>
              </div>
            </div>
          </div>
        </el-col>
        
        <!-- CPU使用率卡片 -->
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <div class="stat-card">
            <div class="stat-icon cpu-icon">
              <el-icon><icon-cpu /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">CPU 使用率</div>
              <div class="stat-value">{{ systemData.cpuUsage || '14.1%' }}</div>
              <div class="progress-container">
                <div class="progress-bar" :style="{ width: systemData.cpuPercent || '14.1%' }"></div>
              </div>
            </div>
          </div>
        </el-col>
        
        <!-- 磁盘使用卡片 -->
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <div class="stat-card">
            <div class="stat-icon disk-icon">
              <el-icon><icon-disk /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">磁盘使用</div>
              <div class="stat-value">{{ systemData.diskPercent || '46.2%' }}</div>
              <div class="progress-container">
                <div class="progress-bar" :style="{ width: systemData.diskPercent || '46.2%' }"></div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 详细信息面板 -->
    <div class="details-section">
      <el-row :gutter="24">
        <!-- 系统信息面板 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12">
          <div class="info-panel">
            <div class="panel-header">
              <h3 class="panel-title">
                <el-icon><icon-info-filled /></el-icon>
                系统信息
              </h3>
              <el-button type="text" class="refresh-button" @click="refreshSystemInfo" :loading="isRefreshing">
                <el-icon><icon-refresh /></el-icon>
              </el-button>
            </div>
            
            <div class="info-table">
              <div class="info-row" v-for="(item, index) in systemInfo" :key="index">
                <div class="info-label">{{ item.label }}</div>
                <div class="info-value">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </el-col>
        
        <!-- 机器人信息面板 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12">
          <div class="info-panel">
            <div class="panel-header">
              <h3 class="panel-title">
                <el-icon><icon-service /></el-icon>
                机器人信息
              </h3>
              <div class="bot-status">
                <span class="status-indicator" :class="{ 'online': botInfo.isOnline }"></span>
                <span class="status-text">{{ botInfo.isOnline ? '正常运行中' : '离线' }}</span>
              </div>
            </div>
            
            <div class="info-table">
              <div class="info-row" v-for="(item, index) in botInfo.details" :key="index">
                <div class="info-label">{{ item.label }}</div>
                <div class="info-value">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 系统性能图表 -->
    <div class="performance-section">
      <h2 class="section-title">
        <el-icon><icon-trend-charts /></el-icon>
        系统性能监控
        <div class="chart-controls">
          <el-radio-group v-model="timeRange" size="small">
            <el-radio-button label="hour">1小时</el-radio-button>
            <el-radio-button label="day">24小时</el-radio-button>
            <el-radio-button label="week">1周</el-radio-button>
          </el-radio-group>
        </div>
      </h2>
      
      <div class="performance-charts">
        <div class="chart-placeholder">
          <el-empty description="性能数据加载中...">
            <template #image>
              <el-icon class="empty-icon"><icon-data-line /></el-icon>
            </template>
          </el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'SystemStatusView',
  setup() {
    const timeRange = ref('hour')
    const isRefreshing = ref(false)
    
    // 系统数据
    const systemData = ref({
      uptime: '15:48:27',
      startTime: '2025-05-16 06:51:19',
      memoryUsed: '1.23GB',
      memoryTotal: '3.56GB',
      memoryPercent: '35%',
      cpuUsage: '14.1%',
      cpuPercent: '14.1%',
      diskPercent: '46.2%'
    })
    
    // 系统信息
    const systemInfo = ref([
      { label: '主机名', value: '未知' },
      { label: '操作系统', value: 'Linux' },
      { label: 'Python版本', value: '3.11.12' },
      { label: 'CPU核心数', value: '未知' },
      { label: '总内存', value: '3.56 GB' },
      { label: '可用内存', value: '2.34 GB' },
      { label: '总磁盘空间', value: '39.25 GB' },
      { label: '可用磁盘空间', value: '21.95 GB' },
      { label: '更新时间', value: '2025/5/16 22:39:46' }
    ])
    
    // 机器人信息
    const botInfo = ref({
      isOnline: true,
      details: [
        { label: '微信昵称', value: 'AABOT' },
        { label: '微信ID', value: 'wxid_navjdkukcj5j22' },
        { label: '微信号', value: '-' },
        { label: '登录设备', value: '-' },
        { label: '登录时间', value: '-' }
      ]
    })
    
    // 格式化日期
    const formattedDate = ref('2025/5/16 22:39:46')
    
    // 刷新系统信息
    const refreshSystemInfo = async () => {
      isRefreshing.value = true
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800))
        formattedDate.value = new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      } catch (error) {
        console.error('Error fetching system info:', error)
      } finally {
        isRefreshing.value = false
      }
    }
    
    // 自动刷新定时器
    let refreshTimer = null
    
    onMounted(() => {
      refreshSystemInfo()
      // 每30秒自动刷新一次
      refreshTimer = setInterval(refreshSystemInfo, 30000)
    })
    
    onUnmounted(() => {
      if (refreshTimer) {
        clearInterval(refreshTimer)
      }
    })
    
    return {
      timeRange,
      systemData,
      systemInfo,
      botInfo,
      formattedDate,
      isRefreshing,
      refreshSystemInfo
    }
  }
}
</script>

<style scoped>
.system-status-page {
  padding: 32px;
  max-width: 1280px;
  margin: 0 auto;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
}

/* 页面标题部分 */
.page-header {
  margin-bottom: 36px;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.022em;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.version-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #f5f5f7;
  border-radius: 8px;
  font-size: 13px;
  color: #6e6e73;
  font-weight: 500;
}

.update-button {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

/* 系统概览部分 */
.overview-section, 
.details-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 20px;
  gap: 8px;
  letter-spacing: -0.01em;
}

.last-updated {
  margin-left: auto;
  font-size: 14px;
  font-weight: normal;
  color: #6e6e73;
}

.stat-cards {
  margin-bottom: 0;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03);
  display: flex;
  margin-bottom: 24px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 18px;
  font-size: 26px;
  color: white;
  background-size: 300% 300%;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.runtime-icon {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
}

.memory-icon {
  background: linear-gradient(135deg, #8e2de2, #4a00e0);
}

.cpu-icon {
  background: linear-gradient(135deg, #f7b733, #fc4a1a);
}

.disk-icon {
  background: linear-gradient(135deg, #00b09b, #96c93d);
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: #6e6e73;
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

.stat-detail {
  font-size: 13px;
  color: #86868b;
  margin-top: auto;
}

.progress-container {
  height: 8px;
  background-color: #f5f5f7;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 12px;
  position: relative;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(0, 122, 255, 0.7), rgba(0, 122, 255, 1));
  transition: width 0.5s ease-out;
  box-shadow: 0 1px 3px rgba(0, 122, 255, 0.2);
}

/* 信息面板部分 */
.info-panel {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03);
  padding: 24px;
  margin-bottom: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.info-panel:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.05);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f7;
  margin-bottom: 16px;
}

.panel-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  gap: 8px;
  letter-spacing: -0.015em;
}

.refresh-button {
  color: #6e6e73;
  transition: color 0.2s ease;
}

.refresh-button:hover {
  color: #0071e3;
}

.info-table {
  flex: 1;
}

.info-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f7;
  transition: background-color 0.2s ease;
}

.info-row:hover {
  background-color: #fafafa;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  width: 120px;
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 500;
}

.info-value {
  flex: 1;
  font-size: 14px;
  color: #6e6e73;
  font-family: "SF Mono", SFMono-Regular, Menlo, Monaco, monospace;
}

.bot-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #E74C3C;
  position: relative;
  box-shadow: 0 0 0 rgba(231, 76, 60, 0.4);
  animation: none;
}

.status-indicator.online {
  background-color: #2ECC71;
  box-shadow: 0 0 0 rgba(46, 204, 113, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(46, 204, 113, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
  }
}

.status-text {
  font-size: 14px;
  color: #6e6e73;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 16px;
  transition: all 0.2s ease;
}

.action-button:hover {
  transform: translateY(-2px);
}

/* 系统性能部分 */
.performance-section {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03);
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.chart-controls {
  margin-left: auto;
}

.chart-controls .el-radio-button__inner {
  border-radius: 6px;
  padding: 8px 16px;
}

.performance-charts {
  min-height: 360px;
  margin-top: 24px;
}

.chart-placeholder {
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  border-radius: 12px;
  overflow: hidden;
}

.empty-icon {
  font-size: 72px;
  color: #e0e0e0;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .system-status-page {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .system-status-page {
    padding: 20px;
  }
  
  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .version-info {
    width: 100%;
    justify-content: space-between;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .section-title {
    font-size: 18px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .last-updated, .chart-controls {
    margin-left: 0;
    margin-top: 8px;
  }
}

@media (max-width: 480px) {
  .system-status-page {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 22px;
  }
  
  .info-panel {
    padding: 20px;
  }
}
</style> 