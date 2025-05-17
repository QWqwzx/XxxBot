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
          <el-radio-group v-model="timeRange" size="small" @change="handleTimeRangeChange">
            <el-radio-button label="hour">1小时</el-radio-button>
            <el-radio-button label="day">24小时</el-radio-button>
            <el-radio-button label="week">1周</el-radio-button>
          </el-radio-group>
        </div>
      </h2>
      
      <div class="performance-charts">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <div class="chart-container" ref="cpuChartRef">
              <div v-if="isLoading" class="chart-loading">
                <el-icon class="loading-icon"><icon-loading /></el-icon>
                <p>加载中...</p>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <div class="chart-container" ref="memoryChartRef">
              <div v-if="isLoading" class="chart-loading">
                <el-icon class="loading-icon"><icon-loading /></el-icon>
                <p>加载中...</p>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <div class="chart-container" ref="diskChartRef">
              <div v-if="isLoading" class="chart-loading">
                <el-icon class="loading-icon"><icon-loading /></el-icon>
                <p>加载中...</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { systemApi } from '../../api/system' // 导入系统API客户端
import * as echarts from 'echarts' // 导入echarts库

export default {
  name: 'SystemStatusView',
  setup() {
    const timeRange = ref('hour')
    const isRefreshing = ref(false)
    const isLoading = ref(true)
    const cpuChartRef = ref(null)
    const memoryChartRef = ref(null)
    const diskChartRef = ref(null)
    let cpuChart = null
    let memoryChart = null
    let diskChart = null
    
    // 系统数据
    const systemData = ref({
      uptime: '00:00:00',
      startTime: '加载中...',
      memoryUsed: '0 GB',
      memoryTotal: '0 GB',
      memoryPercent: '0.00%',
      cpuUsage: '0.00%',
      cpuPercent: '0.00%',
      diskPercent: '0.00%'
    })
    
    // 系统信息
    const systemInfo = ref([
      { label: '主机名', value: '加载中...' },
      { label: '操作系统', value: '加载中...' },
      { label: 'Python版本', value: '加载中...' },
      { label: 'CPU核心数', value: '加载中...' },
      { label: '总内存', value: '加载中...' },
      { label: '可用内存', value: '加载中...' },
      { label: '总磁盘空间', value: '加载中...' },
      { label: '可用磁盘空间', value: '加载中...' },
      { label: '更新时间', value: '加载中...' }
    ])
    
    // 机器人信息
    const botInfo = ref({
      isOnline: false,
      details: [
        { label: '微信昵称', value: '加载中...' },
        { label: '微信ID', value: '加载中...' },
        { label: '微信号', value: '加载中...' },
        { label: '登录设备', value: '加载中...' },
        { label: '登录时间', value: '加载中...' }
      ]
    })
    
    // 格式化日期
    const formattedDate = ref('加载中...')
    
    // 性能历史数据
    const performanceData = ref({
      timestamps: [],
      cpuData: [],
      memoryData: [],
      diskData: []
    })
    
    // 在setup函数的最前面添加本地历史数据存储
    const loadLocalStorageData = () => {
      try {
        const savedData = localStorage.getItem('performanceHistory');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // 验证数据结构是否完整
          if (parsedData && 
              Array.isArray(parsedData.timestamps) && 
              Array.isArray(parsedData.cpuData) &&
              Array.isArray(parsedData.memoryData) &&
              (parsedData.timestamps.length === parsedData.cpuData.length) &&
              (parsedData.timestamps.length === parsedData.memoryData.length)) {
            
            // 添加缺失的diskData字段(如果没有)
            if (!Array.isArray(parsedData.diskData) || parsedData.diskData.length !== parsedData.timestamps.length) {
              parsedData.diskData = Array(parsedData.timestamps.length).fill('0.00');
            }
            
            console.log("从localStorage加载历史性能数据:", parsedData);
            return parsedData;
          }
        }
      } catch (error) {
        console.error("加载localStorage历史数据失败:", error);
      }
      
      // 返回空数据结构
      return {
        timestamps: [],
        cpuData: [],
        memoryData: [],
        diskData: []
      };
    };
    
    // 初始化本地历史数据
    const localPerformanceHistory = loadLocalStorageData();
    
    // 定期保存历史数据
    const saveLocalStorageData = () => {
      try {
        // 只保存最近3小时的数据到localStorage以避免数据过大
        const recentData = {
          timestamps: localPerformanceHistory.timestamps.slice(-180), // 最多180个点
          cpuData: localPerformanceHistory.cpuData.slice(-180),
          memoryData: localPerformanceHistory.memoryData.slice(-180),
          diskData: localPerformanceHistory.diskData.slice(-180)
        };
        localStorage.setItem('performanceHistory', JSON.stringify(recentData));
      } catch (error) {
        console.error("保存性能历史数据到localStorage失败:", error);
      }
    };
    
    // 辅助函数：从可能带有单位的字符串中提取字节数
    const getBytesValue = (value) => {
      if (value === undefined || value === null) return 0;
      
      // 如果已经是数字，直接返回
      if (typeof value === 'number') return value;
      
      // 尝试把字符串转换为数字
      if (typeof value === 'string') {
        // 移除所有非数字、非小数点字符
        const numStr = value.replace(/[^\d.]/g, '');
        const num = parseFloat(numStr);
        
        if (!isNaN(num)) {
          // 根据原字符串中的单位进行转换
          if (value.toLowerCase().includes('kb')) {
            return num * 1024;
          } else if (value.toLowerCase().includes('mb')) {
            return num * 1024 * 1024;
          } else if (value.toLowerCase().includes('gb')) {
            return num * 1024 * 1024 * 1024;
          } else if (value.toLowerCase().includes('tb')) {
            return num * 1024 * 1024 * 1024 * 1024;
          }
          return num; // 假设是字节
        }
      }
      
      return 0; // 默认返回0
    };
    
    // 刷新系统信息
    const refreshSystemInfo = async () => {
      isRefreshing.value = true;
      
      try {
        // 并行发起多个API请求
        const [statusRes, infoRes, botStatusRes] = await Promise.all([
          systemApi.getSystemStatus(),
          systemApi.getSystemInfo(),
          systemApi.getBotStatus()
        ]);
        
        // 使用console.log调试API返回的数据
        console.log("获取到的状态数据:", JSON.stringify(statusRes.data, null, 2));
        console.log("获取到的系统信息:", JSON.stringify(infoRes.data, null, 2));
        console.log("获取到的机器人状态:", JSON.stringify(botStatusRes.data, null, 2));
        
        // 解析数据，支持多种可能的数据结构
        const statusData = statusRes.data?.data || statusRes.data || {};
        const infoData = infoRes.data?.data || infoRes.data || {};
        const botData = botStatusRes.data?.data || botStatusRes.data || {};
        
        // 更详细地处理系统数据
        // 内存使用相关 - 根据API返回的实际结构调整
        let memoryUsed = 0;
        let memoryTotal = 0;
        let memoryPercent = 0;
        
        console.log("内存数据原始值:", 
          JSON.stringify({
            memory: statusData.memory,
            memory_total: infoData.memory_total, 
            memory_available: infoData.memory_available
          }, null, 2)
        );
        
        if (statusData.memory) {
          // 使用正确的字段名和单位转换
          memoryUsed = getBytesValue(statusData.memory.used);
          memoryTotal = getBytesValue(statusData.memory.total);
          memoryPercent = Number(statusData.memory.usagePercentage || 0);
          console.log("从statusData获取内存信息(处理后):", {memoryUsed, memoryTotal, memoryPercent});
        } else if (infoData.memory_total || infoData.memory_available) {
          // 备选方案，同样处理单位
          memoryTotal = getBytesValue(infoData.memory_total);
          const available = getBytesValue(infoData.memory_available);
          memoryUsed = Math.max(0, memoryTotal - available);
          memoryPercent = memoryTotal > 0 ? (memoryUsed / memoryTotal) * 100 : 0;
          console.log("从infoData获取内存信息(处理后):", {memoryTotal, available, memoryUsed, memoryPercent});
        }
        
        // CPU使用率 - 调整为使用API返回的实际字段
        let cpuPercent = 0;
        console.log("CPU数据原始值:", JSON.stringify(statusData.cpu, null, 2));
        
        if (statusData.cpu) {
          if (typeof statusData.cpu.usage === 'number') {
            // API返回的是小数形式的使用率(如0.749)，需要转换为百分比
            cpuPercent = statusData.cpu.usage * 100;
            console.log("从usage获取CPU使用率:", {original: statusData.cpu.usage, percent: cpuPercent});
          } else if (typeof statusData.cpu.percent === 'number') {
            cpuPercent = statusData.cpu.percent;
            console.log("从percent获取CPU使用率:", cpuPercent);
          }
        }
        
        // 运行时间 - 使用系统运行时间而不是进程运行时间
        let uptime = 0;
        console.log("运行时间原始值:", JSON.stringify(statusData.uptime, null, 2));
        
        if (statusData.uptime) {
          if (typeof statusData.uptime.system === 'number') {
            // 使用系统运行时间
            uptime = statusData.uptime.system;
            console.log("从system获取运行时间:", uptime);
          } else if (typeof statusData.uptime === 'number') {
            uptime = statusData.uptime;
            console.log("直接获取运行时间:", uptime);
          }
        }
        
        // 磁盘使用率 - 从API或infoData中获取
        let diskPercent = 0;
        console.log("磁盘数据原始值:", 
          JSON.stringify({
            disk: statusData.disk, 
            disk_total: infoData.disk_total, 
            disk_free: infoData.disk_free
          }, null, 2)
        );
        
        if (statusData.disk && typeof statusData.disk.percent === 'number') {
          diskPercent = statusData.disk.percent;
          console.log("从disk.percent获取磁盘使用率:", diskPercent);
        } else if (statusData.disk && statusData.disk.total && statusData.disk.free) {
          const diskTotal = getBytesValue(statusData.disk.total);
          const diskFree = getBytesValue(statusData.disk.free);
          const diskUsed = Math.max(0, diskTotal - diskFree);
          diskPercent = diskTotal > 0 ? (diskUsed / diskTotal) * 100 : 0;
          console.log("从statusData.disk计算磁盘使用率:", {diskTotal, diskFree, diskUsed, diskPercent});
        } else if (infoData.disk_total && infoData.disk_free) {
          const diskTotal = getBytesValue(infoData.disk_total);
          const diskFree = getBytesValue(infoData.disk_free);
          const diskUsed = Math.max(0, diskTotal - diskFree);
          diskPercent = diskTotal > 0 ? (diskUsed / diskTotal) * 100 : 0;
          console.log("从infoData计算磁盘使用率:", {diskTotal, diskFree, diskUsed, diskPercent});
        }
        
        // 更新系统数据，确保格式正确
        systemData.value = {
          uptime: formatUptime(uptime),
          startTime: uptime > 0 ? 
                    new Date(Date.now() - (uptime * 1000)).toLocaleString('zh-CN') : 
                    'Invalid Date',
          memoryUsed: formatMemory(memoryUsed),
          memoryTotal: formatMemory(memoryTotal),
          memoryPercent: `${memoryPercent.toFixed(2)}%`,
          cpuUsage: `${cpuPercent.toFixed(2)}%`,
          cpuPercent: `${cpuPercent.toFixed(2)}%`,
          diskPercent: `${diskPercent.toFixed(2)}%`
        };
        
        // 在这里也收集性能数据点，以便更新图表
        const currentTime = Date.now();
        localPerformanceHistory.timestamps.push(currentTime);
        localPerformanceHistory.cpuData.push(cpuPercent.toFixed(2));
        localPerformanceHistory.memoryData.push(memoryPercent.toFixed(2));
        localPerformanceHistory.diskData.push(diskPercent.toFixed(2));
        
        // 保持历史记录长度适中
        const maxHistoryLength = timeRange.value === 'hour' ? 60 : 
                               timeRange.value === 'day' ? 144 : 42;
        
        if (localPerformanceHistory.timestamps.length > maxHistoryLength) {
          localPerformanceHistory.timestamps = localPerformanceHistory.timestamps.slice(-maxHistoryLength);
          localPerformanceHistory.cpuData = localPerformanceHistory.cpuData.slice(-maxHistoryLength);
          localPerformanceHistory.memoryData = localPerformanceHistory.memoryData.slice(-maxHistoryLength);
          localPerformanceHistory.diskData = localPerformanceHistory.diskData.slice(-maxHistoryLength);
        }
        
        // 更新图表数据
        performanceData.value = {
          timestamps: [...localPerformanceHistory.timestamps],
          cpuData: [...localPerformanceHistory.cpuData],
          memoryData: [...localPerformanceHistory.memoryData],
          diskData: [...localPerformanceHistory.diskData]
        };
        
        // 详细处理操作系统信息
        let osValue = '未知';
        if (infoData.os) {
          if (typeof infoData.os === 'string') {
            // 如果是字符串形式的JSON，尝试解析
            if (infoData.os.includes('{') || infoData.os.includes('[')) {
              try {
                const osObj = JSON.parse(infoData.os);
                // 尝试构建友好的操作系统描述
                if (osObj.platform && osObj.release) {
                  osValue = `${osObj.platform} ${osObj.release}`;
                } else if (osObj.type && osObj.version) {
                  osValue = `${osObj.type} ${osObj.version}`;
                } else {
                  osValue = JSON.stringify(osObj);
                }
              } catch (e) {
                // 解析失败，保留原始字符串
                osValue = infoData.os;
              }
            } else {
              // 普通字符串，直接使用
              osValue = infoData.os;
            }
          } else if (typeof infoData.os === 'object' && infoData.os !== null) {
            // 如果是对象，直接提取相关信息
            if (infoData.os.platform && infoData.os.release) {
              osValue = `${infoData.os.platform} ${infoData.os.release}`;
            } else if (infoData.os.type && infoData.os.version) {
              osValue = `${infoData.os.type} ${infoData.os.version}`;
            } else {
              try {
                osValue = JSON.stringify(infoData.os);
              } catch (e) {
                osValue = '对象无法序列化';
              }
            }
          } else {
            // 其他情况，转为字符串
            osValue = String(infoData.os);
          }
        } else if (typeof navigator !== 'undefined') {
          // 浏览器环境下，可以尝试获取用户代理信息作为备选
          osValue = navigator.platform || navigator.userAgent || '未知';
        }
        
        // 更新系统信息
        systemInfo.value = [
          { label: '主机名', value: infoData.hostname || '未知' },
          { label: '操作系统', value: osValue },
          { label: 'Python版本', value: infoData.python_version || '3.x' },
          { label: 'CPU核心数', value: infoData.cpu_count || '未知' },
          { label: '总内存', value: formatMemory(memoryTotal) },
          { label: '可用内存', value: formatMemory(Number(infoData.memory_available || 0)) },
          { label: '总磁盘空间', value: formatMemory(Number(infoData.disk_total || 0)) },
          { label: '可用磁盘空间', value: formatMemory(Number(infoData.disk_free || 0)) },
          { label: '更新时间', value: new Date().toLocaleString('zh-CN') }
        ];
        
        // 更新机器人信息
        botInfo.value = {
          isOnline: ['online', 'ready'].includes(String(botData.status || '').toLowerCase()),
          details: [
            { label: '微信昵称', value: botData.nickname || '未知' },
            { label: '微信ID', value: botData.wxid || botData.wx_id || '未知' },
            { label: '微信号', value: botData.wx_account || botData.account || '-' },
            { label: '登录设备', value: botData.device || '-' },
            { label: '登录时间', value: botData.lastActive || botData.login_time ? 
              new Date(botData.lastActive || botData.login_time).toLocaleString('zh-CN') : '-' },
            { label: '今日消息', value: botData.todayMessages || '0' },
            { label: '日均消息', value: botData.avg_daily || '0' },
            { label: '消息总数', value: botData.messagesProcessed || '0' }
          ]
        };
        
        formattedDate.value = new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      } catch (error) {
        console.error('Error fetching system info:', error);
      } finally {
        isRefreshing.value = false;
      }
    }
    
    // 初始化图表
    const initCharts = () => {
      // 确保DOM元素已经渲染，如果不存在则不初始化
      if (!cpuChartRef.value || !memoryChartRef.value || !diskChartRef.value) {
        console.warn('图表容器DOM元素不存在，无法初始化图表');
        return;
      }
      
      try {
        // 销毁现有图表实例
        if (cpuChart) cpuChart.dispose();
        if (memoryChart) memoryChart.dispose();
        if (diskChart) diskChart.dispose();
        
        // 创建CPU使用率图表
        cpuChart = echarts.init(cpuChartRef.value);
        const cpuOption = {
          title: {
            text: 'CPU 使用率',
            left: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              const time = params[0].name;
              const value = Number(params[0].value).toFixed(2);
              return `${time}<br/>${params[0].seriesName}: ${value}%`;
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: performanceData.value.timestamps.map(ts => new Date(ts).toLocaleTimeString()),
            axisLine: { lineStyle: { color: '#ddd' } },
            axisLabel: { color: '#666' }
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: '#eee' } },
            axisLabel: {
              color: '#666',
              formatter: '{value}%'
            }
          },
          series: [{
            name: 'CPU',
            type: 'line',
            smooth: true,
            symbol: 'emptyCircle',
            symbolSize: 6,
            data: performanceData.value.cpuData.map(value => Number(value).toFixed(2)),
            itemStyle: { color: '#fc4a1a' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(252, 74, 26, 0.3)' },
                { offset: 1, color: 'rgba(252, 74, 26, 0.1)' }
              ])
            }
          }]
        };
        cpuChart.setOption(cpuOption);
        
        // 创建内存使用率图表
        memoryChart = echarts.init(memoryChartRef.value);
        const memoryOption = {
          title: {
            text: '内存使用率',
            left: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              const time = params[0].name;
              const value = Number(params[0].value).toFixed(2);
              return `${time}<br/>${params[0].seriesName}: ${value}%`;
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: performanceData.value.timestamps.map(ts => new Date(ts).toLocaleTimeString()),
            axisLine: { lineStyle: { color: '#ddd' } },
            axisLabel: { color: '#666' }
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: '#eee' } },
            axisLabel: {
              color: '#666',
              formatter: '{value}%'
            }
          },
          series: [{
            name: '内存',
            type: 'line',
            smooth: true,
            symbol: 'emptyCircle',
            symbolSize: 6,
            data: performanceData.value.memoryData.map(value => Number(value).toFixed(2)),
            itemStyle: { color: '#8e2de2' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(142, 45, 226, 0.3)' },
                { offset: 1, color: 'rgba(142, 45, 226, 0.1)' }
              ])
            }
          }]
        };
        memoryChart.setOption(memoryOption);
        
        // 创建磁盘使用率图表
        diskChart = echarts.init(diskChartRef.value);
        const diskOption = {
          title: {
            text: '磁盘使用率',
            left: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              const time = params[0].name;
              const value = Number(params[0].value).toFixed(2);
              return `${time}<br/>${params[0].seriesName}: ${value}%`;
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: performanceData.value.timestamps.map(ts => new Date(ts).toLocaleTimeString()),
            axisLine: { lineStyle: { color: '#ddd' } },
            axisLabel: { color: '#666' }
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: '#eee' } },
            axisLabel: {
              color: '#666',
              formatter: '{value}%'
            }
          },
          series: [{
            name: '磁盘',
            type: 'line',
            smooth: true,
            symbol: 'emptyCircle',
            symbolSize: 6,
            data: performanceData.value.diskData.map(value => Number(value).toFixed(2)),
            itemStyle: { color: '#00b09b' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 176, 155, 0.3)' },
                { offset: 1, color: 'rgba(0, 176, 155, 0.1)' }
              ])
            }
          }]
        };
        diskChart.setOption(diskOption);
        
        // 添加窗口大小变化监听
        window.addEventListener('resize', handleResize);
        
        console.log('图表初始化成功');
      } catch (error) {
        console.error('图表初始化失败:', error);
      }
    };
    
    // 处理窗口大小变化
    const handleResize = () => {
      cpuChart && cpuChart.resize();
      memoryChart && memoryChart.resize();
      diskChart && diskChart.resize();
    };
    
    // 更新时间范围处理函数
    const handleTimeRangeChange = () => {
      // 根据选定的时间范围过滤数据
      const currentTime = Date.now();
      let cutoffTime;
      
      switch (timeRange.value) {
        case 'hour':
          cutoffTime = currentTime - (60 * 60 * 1000); // 1小时前
          break;
        case 'day':
          cutoffTime = currentTime - (24 * 60 * 60 * 1000); // 24小时前
          break;
        case 'week':
          cutoffTime = currentTime - (7 * 24 * 60 * 60 * 1000); // 1周前
          break;
        default:
          cutoffTime = currentTime - (60 * 60 * 1000); // 默认1小时
      }
      
      // 过滤数据
      const filteredData = {
        timestamps: [],
        cpuData: [],
        memoryData: [],
        diskData: []
      };
      
      // 选择符合时间范围的数据点
      for (let i = 0; i < localPerformanceHistory.timestamps.length; i++) {
        if (localPerformanceHistory.timestamps[i] >= cutoffTime) {
          filteredData.timestamps.push(localPerformanceHistory.timestamps[i]);
          filteredData.cpuData.push(localPerformanceHistory.cpuData[i]);
          filteredData.memoryData.push(localPerformanceHistory.memoryData[i]);
          filteredData.diskData.push(localPerformanceHistory.diskData[i]);
        }
      }
      
      // 更新图表数据
      performanceData.value = filteredData;
      
      // 重新初始化图表
      nextTick(() => {
        initCharts();
      });
    };

    // 格式化内存数据 (字节转换为GB)
    const formatMemory = (bytes) => {
      if (bytes === undefined || bytes === null || isNaN(bytes)) return '0 GB';
      
      // 确保bytes是数值类型
      bytes = Number(bytes);
      
      // 如果值太小，可能单位已经是GB或者确实是很小的值
      if (bytes < 1024) {
        // 可能已经是GB单位，直接显示
        return `${bytes.toFixed(2)} GB`;
      }
      
      // 如果是B为单位，则转换到GB
      if (bytes >= 1024 * 1024 * 1024) {
        // 大于1GB的数据
        const gb = bytes / (1024 * 1024 * 1024);
        return `${gb.toFixed(2)} GB`;
      } else if (bytes >= 1024 * 1024) {
        // MB数量级，转换为GB
        const gb = bytes / (1024 * 1024 * 1024);
        return `${gb.toFixed(2)} GB`;
      } else {
        // KB数量级，转换为GB
        const gb = bytes / (1024 * 1024 * 1024);
        return `${gb.toFixed(2)} GB`;
      }
    };

    // 格式化运行时间
    const formatUptime = (seconds) => {
      if (!seconds || isNaN(seconds)) return '00:00:00';
      // 确保seconds是数值类型
      seconds = Number(seconds);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    onMounted(() => {
      // 刷新基础系统信息
      refreshSystemInfo();

      // 初始化图表数据
      if (localPerformanceHistory.timestamps.length > 0) {
        // 如果有历史数据，直接使用
        performanceData.value = {
          timestamps: [...localPerformanceHistory.timestamps],
          cpuData: [...localPerformanceHistory.cpuData],
          memoryData: [...localPerformanceHistory.memoryData],
          diskData: [...localPerformanceHistory.diskData]
        };
        
        console.log("使用localStorage加载的历史性能数据初始化图表:", performanceData.value);
      } else {
        // 如果没有历史数据，初始化一个空的数据结构
        performanceData.value = {
          timestamps: [],
          cpuData: [],
          memoryData: [],
          diskData: []
        };
      }

      // 初始化图表
      nextTick(() => {
        setTimeout(() => {
          if (cpuChartRef.value && memoryChartRef.value && diskChartRef.value) {
            initCharts();
          } else {
            console.warn('图表容器DOM元素尚未准备好');
          }
        }, 300);
      });

      // 每30秒刷新一次系统信息和性能数据点
      const refreshTimer = setInterval(() => {
        refreshSystemInfo();
        
        // 每次获取新数据后重新初始化图表
        nextTick(() => {
          if (cpuChartRef.value && memoryChartRef.value && diskChartRef.value) {
            initCharts();
          }
        });
      }, 30000);
      
      // 每30分钟保存一次历史数据到localStorage
      const saveInterval = setInterval(() => {
        saveLocalStorageData();
      }, 30 * 60 * 1000);
      
      onUnmounted(() => {
        if (refreshTimer) {
          clearInterval(refreshTimer);
        }
        
        if (saveInterval) {
          clearInterval(saveInterval);
        }
        
        // 移除窗口大小变化监听
        window.removeEventListener('resize', handleResize);
        
        // 销毁图表实例
        if (cpuChart) cpuChart.dispose();
        if (memoryChart) memoryChart.dispose();
        if (diskChart) diskChart.dispose();
        
        // 保存本地历史数据
        saveLocalStorageData();
      });
    });
    
    return {
      timeRange,
      systemData,
      systemInfo,
      botInfo,
      formattedDate,
      isRefreshing,
      isLoading,
      cpuChartRef,
      memoryChartRef,
      diskChartRef,
      refreshSystemInfo,
      handleTimeRangeChange
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
  margin-top: 24px;
}

.chart-container {
  height: 360px;
  position: relative;
  margin-bottom: 24px;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  z-index: 10;
}

.loading-icon {
  font-size: 36px;
  color: #0071e3;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.chart-loading p {
  margin-top: 12px;
  color: #6e6e73;
  font-size: 14px;
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