/**
 * CORS 代理工具
 * 用于解决跨域请求问题
 */

/**
 * 尝试使用不同的CORS代理
 * @param {string} url 原始URL
 * @returns {string} 代理后的URL
 */
export function proxifyUrl(url) {
  // 如果URL已经是相对路径或同源，则不需要代理
  if (!url.startsWith('http')) {
    return url;
  }
  
  // 尝试使用开源的CORS代理服务
  // 注意：生产环境应该使用自己的代理服务
  // 以下代理服务仅用于开发和测试
  const availableProxies = [
    url => `https://cors-anywhere.herokuapp.com/${url}`,
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    url => `https://thingproxy.freeboard.io/fetch/${url}`
  ];
  
  // 使用本地存储记录当前使用的代理索引
  let proxyIndex = parseInt(localStorage.getItem('cors_proxy_index') || '0');
  
  // 如果索引超出范围，重置为0
  if (proxyIndex >= availableProxies.length) {
    proxyIndex = 0;
    localStorage.setItem('cors_proxy_index', '0');
  }
  
  // 获取代理URL
  const proxiedUrl = availableProxies[proxyIndex](url);
  
  return proxiedUrl;
}

/**
 * 切换到下一个CORS代理
 * @returns {number} 新的代理索引
 */
export function switchToNextProxy() {
  const availableProxies = 3; // 与上面的availableProxies数组长度一致
  
  let proxyIndex = parseInt(localStorage.getItem('cors_proxy_index') || '0');
  proxyIndex = (proxyIndex + 1) % availableProxies;
  
  localStorage.setItem('cors_proxy_index', proxyIndex.toString());
  
  return proxyIndex;
}

/**
 * 根据错误尝试切换代理并重试请求
 * @param {Function} requestFn 请求函数
 * @param {number} maxRetries 最大重试次数
 * @returns {Promise<any>} 请求结果
 */
export async function fetchWithCorsRetry(requestFn, maxRetries = 2) {
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      return await requestFn();
    } catch (error) {
      // 如果是CORS错误或网络错误，尝试切换代理
      if (error.message.includes('CORS') || 
          error.message.includes('Network Error') ||
          error.name === 'NetworkError') {
        
        if (retries < maxRetries) {
          // 切换到下一个代理
          switchToNextProxy();
          retries++;
          // 继续下一次尝试
          continue;
        }
      }
      
      // 其他错误或超过重试次数，抛出错误
      throw error;
    }
  }
} 