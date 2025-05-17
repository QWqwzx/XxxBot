import request from '../utils/request';
import axios from 'axios';
import { proxifyUrl, fetchWithCorsRetry } from '../utils/corsProxy';

// External API configuration
const MARKETPLACE_API = {
  BASE_URL: 'http://xianan.xin:1562/api',
  LIST: '/plugins/?status=approved',
  CACHE_KEY: 'xybot_plugin_market_cache',
  CACHE_EXPIRY: 3600000 // 1 hour in milliseconds
};

/**
 * 获取所有插件
 * @returns {Promise<Array>} 插件列表
 */
export function getPlugins() {
  return request({
    url: '/api/system/plugins',
    method: 'get'
  }).then(response => {
    if (response.success && response.data) {
      return response.data.plugins || [];
    }
    return [];
  }).catch(error => {
    console.error('获取插件列表失败:', error);
    return []; // 出错时返回空数组
  });
}

/**
 * 启用/禁用插件
 * @param {string} pluginName 插件名称
 * @param {boolean} enable 是否启用
 * @returns {Promise<Object>} 操作结果
 */
export function togglePlugin(pluginName, enable) {
  return request({
    url: '/api/system/plugins/toggle',
    method: 'post',
    data: {
      pluginName,
      enable
    }
  }).then(response => {
    if (!response.success) {
      throw new Error(response.message || '操作失败');
    }
    return response.data;
  });
}

/**
 * 获取插件文档
 * @param {string} pluginName 插件名称
 * @returns {Promise<Object>} 插件文档内容
 */
export function getPluginDocs(pluginName) {
  return request({
    url: `/api/system/plugins/${encodeURIComponent(pluginName)}/docs`,
    method: 'get'
  }).then(response => {
    // 直接返回服务器响应，包括成功或失败的信息
    return response.data || {};
  }).catch(error => {
    console.error('获取插件文档请求失败:', error);
    // 将错误转换为数据格式
    return {
      success: false,
      error: error.message || '网络请求失败',
      docs: `# ${pluginName}\n\n获取文档失败: ${error.message || '网络请求错误'}`
    };
  });
}

/**
 * 获取插件配置
 * @param {string} pluginName 插件名称
 * @returns {Promise<Object>} 插件配置内容
 */
export function getPluginConfig(pluginName) {
  return request({
    url: `/api/system/plugins/${encodeURIComponent(pluginName)}/config`,
    method: 'get'
  }).then(response => {
    // 直接返回服务器响应中的数据部分
    return response.data || { config: {} };
  }).catch(error => {
    console.error('获取插件配置请求失败:', error);
    throw new Error(error.message || '获取配置失败');
  });
}

/**
 * 保存插件配置
 * @param {string} pluginName 插件名称
 * @param {Object} config 配置内容
 * @returns {Promise<Object>} 操作结果
 */
export function savePluginConfig(pluginName, config) {
  return request({
    url: `/api/system/plugins/${encodeURIComponent(pluginName)}/config`,
    method: 'post',
    data: {
      config
    }
  }).then(response => {
    if (!response.success) {
      throw new Error(response.message || response.error || '保存配置失败');
    }
    return response.data;
  }).catch(error => {
    console.error('保存插件配置请求失败:', error);
    throw error;
  });
}

/**
 * 从外部API获取插件市场数据
 * @returns {Promise<Array>} 插件市场数据
 */
export function getMarketplacePlugins() {
  // 尝试从缓存加载
  const cachedData = loadCachedMarketData();
  if (cachedData) {
    return Promise.resolve(cachedData);
  }

  // 构建API URL
  const apiUrl = `${MARKETPLACE_API.BASE_URL}${MARKETPLACE_API.LIST}`;
  console.log('正在请求插件市场数据:', apiUrl);
  
  // 使用CORS代理处理URL
  const proxiedUrl = proxifyUrl(apiUrl);
  console.log('代理后的URL:', proxiedUrl);

  // 使用带重试机制的请求
  return fetchWithCorsRetry(async () => {
    const response = await axios.get(proxiedUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 15000,
      withCredentials: false // 确保不发送凭证
    });
    
    const data = response.data;
    
    // 确保数据格式正确
    if (data && Array.isArray(data.plugins)) {
      // 转换数据格式为前端需要的形式
      const plugins = data.plugins.map(plugin => ({
        id: plugin.id,
        name: plugin.name,
        description: plugin.description || '暂无描述',
        author: plugin.author || '未知作者',
        version: plugin.version || '1.0.0',
        stars: plugin.stars || 0,
        updated: plugin.updated || new Date().toISOString().slice(0, 10),
        tags: plugin.tags ? plugin.tags.map(tag => tag.name) : [],
        github_url: plugin.github_url || ''
      }));
      
      // 缓存数据
      cacheMarketData(plugins);
      
      return plugins;
    }
    return [];
  }).catch(error => {
    console.error('获取插件市场数据失败:', error);
    
    // 如果有缓存数据，作为后备返回
    const cachedData = loadCachedMarketData();
    if (cachedData) {
      return cachedData;
    }
    
    throw error;
  });
}

/**
 * 从市场安装插件
 * @param {Object} plugin 插件数据
 * @returns {Promise<Object>} 安装结果
 */
export function installMarketplacePlugin(plugin) {
  // 处理GitHub URL - 移除.git后缀（如果存在）
  let githubUrl = plugin.github_url || '';
  if (githubUrl.endsWith('.git')) {
    githubUrl = githubUrl.slice(0, -4);
  }

  // 显示调试信息
  console.log(`正在安装插件: ${plugin.name}，github地址: ${githubUrl}`);

  return new Promise((resolve, reject) => {
    // 直接使用前端的axios库从GitHub下载并安装插件
    const pluginName = plugin.name;
    
    // 创建一个FormData对象用于提交到后端
    const formData = new FormData();
    formData.append('github_url', githubUrl);
    formData.append('plugin_name', pluginName);
    formData.append('plugin_version', plugin.version || '1.0.0');
    
    // 使用直接下载插件的方式
    directDownloadPlugin(githubUrl, pluginName)
      .then(result => {
        console.log('插件下载安装成功:', result);
        resolve({ 
          success: true, 
          message: `插件 ${pluginName} 安装成功！`,
          data: { plugin }
        });
      })
      .catch(error => {
        console.error('插件下载安装失败:', error);
        reject(error);
      });
  });
}

/**
 * 直接从GitHub下载并安装插件
 * @param {string} githubUrl GitHub仓库URL
 * @param {string} pluginName 插件名称
 * @returns {Promise<Object>} 安装结果
 */
function directDownloadPlugin(githubUrl, pluginName) {
  return new Promise((resolve, reject) => {
    console.log(`开始通过后端API从GitHub下载插件: ${pluginName}`);
    
    // 使用后端API下载和安装插件
    fetch('/api/system/plugins/download-and-install', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        githubUrl,
        pluginName
      })
    })
    .then(response => response.json())
    .then(result => {
      if (!result.success) {
        throw new Error(result.message || result.error || '安装插件失败');
      }
      
      console.log('插件下载安装成功:', result);
      resolve(result);
    })
    .catch(error => {
      console.error('插件下载安装失败:', error);
      reject(error);
    });
  });
}

/**
 * 缓存插件市场数据
 * @param {Array} plugins 插件数据
 */
function cacheMarketData(plugins) {
  try {
    const cacheData = {
      timestamp: Date.now(),
      plugins: plugins
    };
    localStorage.setItem(MARKETPLACE_API.CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('缓存插件市场数据失败:', error);
  }
}

/**
 * 加载缓存的插件市场数据
 * @returns {Array|null} 缓存的插件数据或null
 */
function loadCachedMarketData() {
  try {
    const cacheData = localStorage.getItem(MARKETPLACE_API.CACHE_KEY);
    if (!cacheData) return null;
    
    const parsedData = JSON.parse(cacheData);
    const cacheAge = Date.now() - parsedData.timestamp;
    
    // 检查缓存是否过期
    if (cacheAge > MARKETPLACE_API.CACHE_EXPIRY) {
      localStorage.removeItem(MARKETPLACE_API.CACHE_KEY);
      return null;
    }
    
    return parsedData.plugins;
  } catch (error) {
    console.error('加载缓存的插件市场数据失败:', error);
    return null;
  }
} 