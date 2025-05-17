import axios from 'axios';

// 使用相对路径而不是硬编码的localhost URL
const API_URL = '/api';

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
  getSystemStatus(params) {
    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    const queryParams = { ...params, t: timestamp };
    return apiClient.get('/system/status', { params: queryParams });
  },
  
  // 获取系统信息
  getSystemInfo() {
    return apiClient.get('/system/info');
  },
  
  // 获取机器人状态
  getBotStatus() {
    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    return apiClient.get(`/system/bot/status?t=${timestamp}`);
  },
  
  // 获取系统配置
  getSystemConfig() {
    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    return apiClient.get(`/system/config?t=${timestamp}`);
  },
  
  // 更新系统配置
  updateSystemConfig(section, key, value) {
    return apiClient.post('/system/config/update', { section, key, value });
  },
  
  // 更新协议版本
  updateProtocolVersion(version) {
    return apiClient.post('/system/protocol/update', { version });
  },
  
  // 更新过滤模式
  updateFilterMode(mode) {
    return apiClient.post('/system/filter/update', { mode });
  },
  
  // 获取原始配置文件内容
  getRawConfig() {
    const timestamp = new Date().getTime();
    return apiClient.get(`/system/config/raw?t=${timestamp}`);
  },
  
  // 保存原始配置文件内容
  saveRawConfig(content) {
    return apiClient.post('/system/config/raw/save', { content });
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