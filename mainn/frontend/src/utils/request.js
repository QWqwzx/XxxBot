import axios from 'axios';
import { ElMessage } from 'element-plus';

// 创建一个axios实例
const service = axios.create({
  baseURL: 'http://localhost:3000', // 直接指向后端服务器地址
  timeout: 15000, // 请求超时时间15秒
  withCredentials: false, // 不发送凭证信息
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 调试输出请求信息
    console.log(`发送请求: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    // 处理请求错误
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    console.log(`收到响应: ${response.config.url}`, res);
    
    // 业务级错误处理
    if (res.success === false) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5000
      });
      
      return res; // 保持返回原始响应，让调用方处理
    } else {
      return res; // 返回正常响应
    }
  },
  error => {
    console.error('响应错误:', error);
    // 详细记录错误信息
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应头:', error.response.headers);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('请求已发送但没有收到响应');
      console.error('请求:', error.request);
    } else {
      console.error('请求配置错误:', error.message);
    }
    
    // 网络级错误处理
    let message = '网络错误，请稍后再试';
    
    if (error.response) {
      // 服务器返回了错误状态码
      const status = error.response.status;
      switch (status) {
        case 400:
          message = '请求参数错误';
          break;
        case 401:
          message = '未登录或登录已过期';
          break;
        case 403:
          message = '无权限进行此操作';
          break;
        case 404:
          message = '请求的资源不存在';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = `请求失败(${status})`;
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      message = '服务器无响应，请稍后再试';
    }
    
    ElMessage({
      message,
      type: 'error',
      duration: 5000
    });
    
    return Promise.reject(error);
  }
);

export default service; 