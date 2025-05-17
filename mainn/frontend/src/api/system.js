import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000 // 请求超时时间
});

// 系统管理API
export const systemApi = {
  // 获取系统状态
  getSystemStatus() {
    return apiClient.get('/system/status');
  },
  
  // 获取系统信息
  getSystemInfo() {
    return apiClient.get('/system/info');
  },
  
  // 获取机器人状态
  getBotStatus() {
    return apiClient.get('/system/bot/status');
  },
  
  // 检查新版本
  checkVersion() {
    return apiClient.post('/system/version/check');
  },
  
  // 更新系统
  updateSystem() {
    return apiClient.post('/system/version/update');
  },
  
  // 获取系统日志
  getLogs(params) {
    return apiClient.get('/system/logs', { params });
  },
  
  // 下载系统日志
  downloadLogs(logType) {
    // 使用window.open直接下载文件
    window.open(`${API_URL}/system/logs/download${logType ? `?t=${logType}` : ''}`);
    return Promise.resolve(); // 返回一个已解决的Promise以保持一致的API
  }
}; 