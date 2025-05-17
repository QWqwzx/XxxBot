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
  
  // 首先尝试使用本地API代理
  // 这允许后端处理CORS问题
  const useLocalProxy = true; // 设置为true优先使用本地代理
  
  if (useLocalProxy) {
    // 使用本地API端点作为代理
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }
  
  // 备用开源CORS代理服务
  const availableProxies = [
    url => `/api/proxy?url=${encodeURIComponent(url)}`, // 优先使用本地代理
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    url => `https://thingproxy.freeboard.io/fetch/${url}`,
    url => `https://cors-anywhere.herokuapp.com/${url}` // 放在最后因为限制最严格
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
  const availableProxies = 5; // 与上面的availableProxies数组长度一致
  
  let proxyIndex = parseInt(localStorage.getItem('cors_proxy_index') || '0');
  proxyIndex = (proxyIndex + 1) % availableProxies;
  
  localStorage.setItem('cors_proxy_index', proxyIndex.toString());
  console.log(`已切换到代理 #${proxyIndex}`);
  
  return proxyIndex;
}

/**
 * 根据错误尝试切换代理并重试请求
 * @param {Function} requestFn 请求函数
 * @param {number} maxRetries 最大重试次数
 * @returns {Promise<any>} 请求结果
 */
export async function fetchWithCorsRetry(requestFn, maxRetries = 3) {
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      return await requestFn();
    } catch (error) {
      console.log(`请求失败(尝试 ${retries+1}/${maxRetries+1}): `, error.message);
      
      // 如果是CORS错误或网络错误，尝试切换代理
      if (error.message.includes('CORS') || 
          error.message.includes('Network Error') ||
          error.message.includes('403') ||
          error.message.includes('Forbidden') ||
          error.status === 403 ||
          error.name === 'NetworkError') {
        
        if (retries < maxRetries) {
          // 切换到下一个代理
          switchToNextProxy();
          retries++;
          console.log(`正在使用不同的代理重试请求...`);
          // 继续下一次尝试
          continue;
        }
      }
      
      // 其他错误或超过重试次数，抛出错误
      throw error;
    }
  }
} 