<template>
  <div class="dashboard">
    <!-- 页面标题 -->
    <div class="dashboard-header">
      <h1 class="page-title">控制台</h1>
      <p class="page-subtitle">实时监控和统计数据</p>
    </div>
    
    <!-- 状态通知横幅 -->
    <el-alert
      v-if="showAlert"
      type="info"
      :closable="true"
      @close="closeAlert"
      class="update-alert"
      show-icon
    >
      <template #title>
        <span class="alert-title">无法更新项目、下载/更新插件?</span>
      </template>
      <div class="alert-content">
        <p>
          自从4月13日GitHub主动屏蔽国内大部分IP导致多地无法访问，如果在更新XxxBot或者下载插件时遇到下载缓慢/无法下载的问题（如：报错403），可以自建免费的加速服务（基于Demo，全程大约2分钟）。
          <a href="https://Xxxbot.app/others/github-proxy.html" target="_blank">参考</a>
        </p>
      </div>
    </el-alert>

    <!-- 主要状态卡片 -->
    <div class="main-status-section">
      <div class="section-header">
        <h2 class="section-title">系统状态</h2>
        <span class="refresh-time">
          <el-icon><icon-timer /></el-icon>
          最后更新：{{ formattedTime }}
          <el-button 
            type="text" 
            class="refresh-icon-btn"
            @click="refreshStatusData"
            :loading="isRefreshing"
          >
            <el-icon><icon-refresh /></el-icon>
          </el-button>
        </span>
      </div>
      
      <el-row :gutter="20">
        <!-- 消息总数卡片 -->
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <div class="status-card purple-gradient">
            <div class="card-content">
              <div class="card-header-label">消息总数</div>
              <div class="card-value-large">{{ statusData.messageCount || 0 }}</div>
              <div class="card-description">所有平台发送的消息统计</div>
            </div>
          </div>
        </el-col>
        
        <!-- 消息平台卡片 -->
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <div class="status-card blue-gradient">
            <div class="card-content">
              <div class="card-header-label">消息平台</div>
              <div class="card-value-large">{{ statusData.platformCount || 2 }}</div>
              <div class="card-description">已连接的消息平台数量</div>
            </div>
          </div>
        </el-col>
        
        <!-- 运行时间卡片 -->
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <div class="status-card green-gradient">
            <div class="card-content">
              <div class="card-header-label">运行时间</div>
              <div class="card-value-time">{{ statusData.uptime || '41小时34分14秒' }}</div>
              <div class="card-description">XxxBot 运行时间</div>
            </div>
          </div>
        </el-col>
        
        <!-- 内存占用卡片 -->
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <div class="status-card orange-gradient">
            <div class="card-content">
              <div class="card-header-label">内存占用</div>
              <div class="card-value-large">
                {{ statusData.memoryUsage || 82 }} <span class="unit">MB</span>
              </div>
              <div class="card-description">{{ statusData.totalMemory || '3645 MB' }} 总内存</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 数据分析部分 -->
    <div class="analytics-section">
      <div class="section-header">
        <h2 class="section-title">数据分析</h2>
        <div class="section-tools">
          <el-radio-group v-model="timeRange" size="small">
            <el-radio-button label="1">今天</el-radio-button>
            <el-radio-button label="7">本周</el-radio-button>
            <el-radio-button label="30">本月</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      
      <el-row :gutter="20" class="analytics-row">
        <!-- 消息趋势分析 -->
        <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
          <div class="analytics-card messages-analytics-card">
            <div class="card-header">
              <div class="header-left">
                <h3 class="card-title">消息趋势分析</h3>
                <p class="card-subtitle">跟踪消息数量随时间的变化</p>
              </div>
            </div>
            
            <div class="analytics-metrics">
              <div class="metric-item">
                <div class="metric-value">0</div>
                <div class="metric-label">总消息数</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">0</div>
                <div class="metric-label">平均每天</div>
              </div>
              <div class="metric-item">
                <div class="metric-value decrease">0%</div>
                <div class="metric-label">增长率</div>
              </div>
            </div>
            
            <div class="chart-container">
              <div class="empty-state">
                <el-icon class="empty-icon"><icon-data-line /></el-icon>
                <p>暂无消息数据</p>
                <span>数据将在有消息活动后自动显示</span>
              </div>
            </div>
          </div>
        </el-col>
        
        <!-- 系统信息部分 -->
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <div class="analytics-card system-info-card">
            <div class="card-header">
              <div class="header-left">
                <h3 class="card-title">系统信息</h3>
                <p class="card-subtitle">当前系统运行状态</p>
              </div>
              <div class="header-right">
                <el-button type="primary" size="small" class="refresh-button" @click="refreshStatusData" :loading="isRefreshing">
                  <el-icon><icon-refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </div>
            
            <div class="system-info-content">
              <!-- 机器人状态 -->
              <div class="bot-status-section">
                <div class="bot-icon-container">
                  <div class="bot-icon">
                    <img src="https://img95.699pic.com/photo/60004/2631.jpg_wh300.jpg!/fh/300/quality/90" alt="机器人图标" class="bot-avatar">
                  </div>
                </div>
                <div class="bot-status-info">
                  <div class="bot-status-title">机器人状态</div>
                  <div class="bot-status-badge">
                    <span class="status-dot online"></span>
                    <span>ready</span>
                  </div>
                  <div class="bot-status-description">机器人已准备就绪</div>
                </div>
              </div>
              
              <!-- 机器人信息列表 -->
              <div class="bot-info-list">
                <div class="bot-info-item">
                  <div class="bot-info-icon">
                    <el-icon><icon-user /></el-icon>
                  </div>
                  <div class="bot-info-label">昵称：</div>
                  <div class="bot-info-value">{{ botInfo.nickname || 'AABOT' }}</div>
                </div>
                
                <div class="bot-info-item">
                  <div class="bot-info-icon">
                    <el-icon><icon-chat-dot-square /></el-icon>
                  </div>
                  <div class="bot-info-label">微信号：</div>
                  <div class="bot-info-value">{{ botInfo.wxid || 'wxid_navjdkukcj5j22' }}</div>
                </div>
                
                <div class="bot-info-item">
                  <div class="bot-info-icon">
                    <el-icon><icon-connection /></el-icon>
                  </div>
                  <div class="bot-info-label">协议版本：</div>
                  <div class="bot-info-value">{{ botInfo.protocol || 'Mac协议' }}</div>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="bot-action-buttons">
                <el-button class="bot-action-btn protocol-btn">
                  <el-icon><icon-monitor /></el-icon>
                  Mac协议
                  <el-icon class="dropdown-icon"><icon-arrow-down /></el-icon>
                </el-button>
                
                <el-button class="bot-action-btn filter-btn">
                  <el-icon><icon-filter /></el-icon>
                  不过滤
                  <el-icon class="dropdown-icon"><icon-arrow-down /></el-icon>
                </el-button>
              </div>
              
              <div class="bot-action-buttons">
                <el-button class="bot-action-btn account-btn">
                  <el-icon><icon-refresh-right /></el-icon>
                  切换账号
                </el-button>
                
                <el-button class="bot-action-btn settings-btn">
                  <el-icon><icon-setting /></el-icon>
                  系统配置
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'DashboardView',
  setup() {
    const showAlert = ref(true)
    const timeRange = ref('1')
    const isRefreshing = ref(false)
    
    // 获取当前时间
    const now = new Date()
    const formattedTime = computed(() => {
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    })
    
    // 机器人信息
    const botInfo = ref({
      status: 'ready',
      nickname: 'AABOT',
      wxid: 'wxid_navjdkukcj5j22',
      protocol: 'Mac协议',
      isOnline: true
    })
    
    // 状态数据
    const statusData = ref({
      messageCount: 1524,
      messagePeriod: '今日: +24',
      messageTrend: 3.5,
      platformCount: 2,
      platforms: [
        { name: '微信', status: 'active' },
        { name: 'QQ', status: 'active' }
      ],
      uptime: '41小时34分14秒',
      uptimePercent: '98%',
      startTime: '2023-08-15 08:24',
      memoryUsage: 82,
      totalMemory: '3645 MB',
      memoryPercent: '98%'
    })
    
    // 系统信息数据
    const systemInfo = ref([
      { name: '系统负载', value: '0.34', status: 'normal' },
      { name: 'CPU使用率', value: '12%', status: 'normal' },
      { name: '内存使用率', value: '82 MB / 3645 MB (98%)', status: 'warning' },
      { name: '磁盘空间', value: '12.5 GB / 50 GB (25%)', status: 'normal' },
      { name: '网络状态', value: '连接正常', status: 'normal' },
      { name: '插件状态', value: '8 个已启用 / 12 个总数', status: 'normal' },
      { name: 'Redis 状态', value: '已连接 (127.0.0.1:6379)', status: 'normal' }
    ])
    
    // 刷新状态数据
    const refreshStatusData = async () => {
      isRefreshing.value = true
      
      try {
        // 这里应该是从后端获取数据的API调用
        // const response = await fetch('/api/status');
        // const data = await response.json();
        // statusData.value = data;
        // botInfo.value = data.botInfo;
        
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 刷新当前显示时间
        const updateTime = new Date()
        formattedTime.value = `${updateTime.getHours().toString().padStart(2, '0')}:${updateTime.getMinutes().toString().padStart(2, '0')}`
      } catch (error) {
        console.error('Error fetching status data:', error)
      } finally {
        isRefreshing.value = false
      }
    }
    
    // 初始化页面时加载数据
    onMounted(() => {
      refreshStatusData()
    })
    
    const closeAlert = () => {
      showAlert.value = false
    }
    
    const getIconName = (name) => {
      switch (name) {
        case '系统负载': return 'icon-odometer'
        case 'CPU使用率': return 'icon-cpu'
        case '内存使用率': return 'icon-coin'
        case '磁盘空间': return 'icon-disk'
        case '网络状态': return 'icon-connection'
        case '插件状态': return 'icon-connection'
        case 'Redis 状态': return 'icon-data-analysis'
        default: return 'icon-info'
      }
    }
    
    const getIconClass = (name) => {
      switch (name) {
        case '系统负载': return 'icon-blue'
        case 'CPU使用率': return 'icon-orange'
        case '内存使用率': return 'icon-purple'
        case '磁盘空间': return 'icon-green'
        case '网络状态': return 'icon-blue'
        case '插件状态': return 'icon-purple'
        case 'Redis 状态': return 'icon-orange'
        default: return ''
      }
    }
    
    return {
      showAlert,
      closeAlert,
      timeRange,
      systemInfo,
      formattedTime,
      getIconName,
      getIconClass,
      statusData,
      refreshStatusData,
      isRefreshing,
      botInfo
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding-bottom: 40px;
  animation: fade-in 0.6s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 页面标题样式 */
.dashboard-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  background: linear-gradient(90deg, var(--apple-accent), #5ac8fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px;
}

.page-subtitle {
  color: var(--apple-text-secondary);
  font-size: 16px;
  margin: 0;
}

/* 警告横幅样式 */
.update-alert {
  margin-bottom: 28px;
  border-radius: var(--apple-radius);
  border: none;
  background-color: rgba(0, 122, 255, 0.08);
  border-left: 4px solid var(--apple-info);
}

.alert-title {
  font-weight: 600;
}

.alert-content {
  font-size: 14px;
  line-height: 1.5;
  padding-top: 6px;
}

.alert-content a {
  color: var(--apple-accent);
  text-decoration: none;
  font-weight: 500;
}

.alert-content a:hover {
  text-decoration: underline;
}

/* 区域标题样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--apple-text-primary);
  margin: 0;
}

.refresh-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--apple-text-secondary);
  font-size: 14px;
}

.section-tools {
  display: flex;
  gap: 12px;
}

/* 主要状态卡片样式 */
.main-status-section {
  margin-bottom: 32px;
}

.status-card {
  height: 180px;
  border-radius: var(--apple-radius-lg);
  padding: 24px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.status-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: right bottom;
  background-repeat: no-repeat;
  background-size: 80%;
  opacity: 0.15;
  transition: opacity 0.3s ease;
}

.status-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.status-card:hover::before {
  opacity: 0.2;
}

.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.card-header-label {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 16px;
}

.card-value-large {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.card-value-time {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.card-description {
  font-size: 14px;
  opacity: 0.8;
}

.unit {
  font-size: 20px;
  font-weight: 500;
  margin-left: 4px;
}

.purple-gradient {
  background: linear-gradient(135deg, #5e5ce6, #bf5af2);
  color: white;
}

.blue-gradient {
  background: linear-gradient(135deg, #007aff, #5ac8fa);
  color: white;
}

.green-gradient {
  background: linear-gradient(135deg, #34c759, #30d158);
  color: white;
}

.orange-gradient {
  background: linear-gradient(135deg, #ff9500, #ffcc00);
  color: white;
}

.purple-gradient::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15s-2-4-9-4-9 4-9 4'%3E%3C/path%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M9 9h.01'%3E%3C/path%3E%3Cpath d='M15 9h.01'%3E%3C/path%3E%3C/svg%3E");
}

.blue-gradient::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'%3E%3C/path%3E%3Cpolyline points='15 3 21 3 21 9'%3E%3C/polyline%3E%3Cline x1='10' y1='14' x2='21' y2='3'%3E%3C/line%3E%3C/svg%3E");
}

.green-gradient::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolyline points='12 6 12 12 16 14'%3E%3C/polyline%3E%3C/svg%3E");
}

.orange-gradient::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='2' width='16' height='20' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M9 22v-4h6v4'%3E%3C/path%3E%3Cpath d='M8 6h.01'%3E%3C/path%3E%3Cpath d='M16 6h.01'%3E%3C/path%3E%3Cpath d='M12 6h.01'%3E%3C/path%3E%3Cpath d='M12 10h.01'%3E%3C/path%3E%3Cpath d='M12 14h.01'%3E%3C/path%3E%3Cpath d='M16 10h.01'%3E%3C/path%3E%3Cpath d='M16 14h.01'%3E%3C/path%3E%3Cpath d='M8 10h.01'%3E%3C/path%3E%3Cpath d='M8 14h.01'%3E%3C/path%3E%3C/svg%3E");
}

/* 数据分析部分 */
.analytics-section {
  margin-bottom: 32px;
}

.analytics-row {
  display: flex;
  margin-bottom: 0;
}

.analytics-row > .el-col {
  display: flex;
  flex-direction: column;
}

.analytics-card {
  background-color: white;
  border-radius: var(--apple-radius-lg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  padding: 24px;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 380px;
}

.messages-analytics-card {
  height: 380px;
}

.analytics-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--apple-text-primary);
}

.card-subtitle {
  font-size: 13px;
  color: var(--apple-text-secondary);
  margin: 6px 0 0;
}

.analytics-metrics {
  display: flex;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--apple-border-light);
  flex-shrink: 0;
}

.metric-item {
  flex: 1;
  text-align: center;
  padding: 0 10px;
  border-right: 1px solid var(--apple-border-light);
}

.metric-item:last-child {
  border-right: none;
}

.metric-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--apple-text-primary);
  margin-bottom: 8px;
}

.metric-value.decrease {
  color: var(--apple-error);
}

.metric-label {
  font-size: 13px;
  color: var(--apple-text-secondary);
}

.chart-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  color: var(--apple-text-secondary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--apple-border);
}

.empty-state p {
  font-size: 15px;
  margin: 0 0 8px;
  font-weight: 500;
  color: var(--apple-text-primary);
}

.empty-state span {
  font-size: 13px;
  color: var(--apple-text-secondary);
}

/* 系统信息卡片样式 */
.system-info-card {
  height: 380px;
  display: flex;
  flex-direction: column;
}

.system-info-content {
  flex: 1;
  overflow-y: auto;
}

.system-info-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--apple-border-light);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.system-info-item:last-child {
  border-bottom: none;
}

.info-item-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-icon-wrapper {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f7;
}

.info-icon {
  font-size: 14px;
}

.icon-blue {
  color: var(--apple-info);
}

.icon-green {
  color: var(--apple-success);
}

.icon-orange {
  color: var(--apple-warning);
}

.icon-purple {
  color: #5e5ce6;
}

.info-name {
  font-weight: 500;
  font-size: 14px;
  color: var(--apple-text-primary);
}

.info-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 34px;
}

.info-value {
  font-family: "SF Mono", SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 13px;
  color: var(--apple-text-secondary);
}

.info-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
}

.info-status.normal {
  background-color: rgba(52, 199, 89, 0.1);
  color: var(--apple-success);
}

.info-status.warning {
  background-color: rgba(255, 149, 0, 0.1);
  color: var(--apple-warning);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.info-status.normal .status-dot {
  background-color: var(--apple-success);
}

.info-status.warning .status-dot {
  background-color: var(--apple-warning);
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 6px 12px;
  height: auto;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .status-card {
    height: auto;
    padding: 20px;
  }
  
  .status-value {
    font-size: 28px;
  }
  
  .time-value {
    font-size: 18px;
  }
  
  .analytics-metrics {
    flex-direction: column;
    gap: 16px;
  }
  
  .metric-item {
    border-right: none;
    border-bottom: 1px solid var(--apple-border-light);
    padding: 0 0 16px;
  }
  
  .metric-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .chart-container {
    height: 200px;
  }
}

/* 状态卡片详情样式 */
.status-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.8;
}

.status-period {
  font-weight: 500;
}

.trend {
  display: flex;
  align-items: center;
  gap: 2px;
  border-radius: 4px;
  padding: 2px 6px;
  font-weight: 600;
}

.trend.increase {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.trend.decrease {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.platform-list {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.platform-tag {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
  color: white !important;
  font-weight: 500;
}

.no-platforms {
  font-size: 12px;
  opacity: 0.8;
}

.uptime-details {
  margin-top: 8px;
}

.uptime-bar {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 6px;
}

.uptime-progress {
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 2px;
}

.uptime-text {
  font-size: 12px;
  opacity: 0.8;
  text-align: right;
}

.refresh-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 0;
  margin-left: 6px;
  color: var(--apple-text-secondary);
  transition: all 0.2s ease;
}

.refresh-icon-btn:hover {
  color: var(--apple-accent);
  background-color: rgba(0, 102, 204, 0.1);
  transform: rotate(30deg);
}

.refresh-icon-btn:active {
  transform: rotate(180deg);
}

/* 机器人状态部分 */
.bot-status-section {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid var(--apple-border-light);
}

.bot-icon-container {
  margin-right: 16px;
}

.bot-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bot-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bot-status-info {
  flex: 1;
}

.bot-status-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--apple-text-primary);
  margin-bottom: 8px;
}

.bot-status-badge {
  display: inline-flex;
  align-items: center;
  background-color: rgba(52, 199, 89, 0.1);
  color: var(--apple-success);
  border-radius: 100px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-dot.online {
  background-color: var(--apple-success);
}

.bot-status-description {
  font-size: 14px;
  color: var(--apple-text-secondary);
}

/* 机器人信息列表 */
.bot-info-list {
  padding: 16px 0;
  border-bottom: 1px solid var(--apple-border-light);
}

.bot-info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.bot-info-item:last-child {
  margin-bottom: 0;
}

.bot-info-icon {
  width: 20px;
  margin-right: 8px;
  color: var(--apple-text-secondary);
}

.bot-info-label {
  font-size: 14px;
  color: var(--apple-text-primary);
  font-weight: 500;
  width: 70px;
}

.bot-info-value {
  font-size: 14px;
  color: var(--apple-text-secondary);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: "SF Mono", SFMono-Regular, Menlo, Monaco, monospace;
}

/* 操作按钮 */
.bot-action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.bot-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--apple-border);
  background-color: transparent;
  color: var(--apple-text-primary);
  font-size: 14px;
  transition: all 0.2s ease;
}

.bot-action-btn:hover {
  background-color: rgba(0, 122, 255, 0.05);
  border-color: var(--apple-accent);
  color: var(--apple-accent);
}

.dropdown-icon {
  font-size: 12px;
  margin-left: 4px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .bot-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
  
  .bot-action-buttons {
    flex-direction: column;
  }
}
</style> 