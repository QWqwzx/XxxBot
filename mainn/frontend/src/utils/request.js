import axios from 'axios';
import { ElMessage } from 'element-plus';

// 创建一个axios实例
const service = axios.create({
  baseURL: 'http://localhost:3000', // 直接指向后端服务器地址
  timeout: 10000, // 请求超时时间10秒
  withCredentials: true // 跨域请求时发送cookie
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送前做一些处理，例如添加token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
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
    
    // 业务级错误处理
    if (res.success === false) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5000
      });
      
      // 特定错误码处理，例如未授权（401）、无权限（403）等
      if (res.code === 401) {
        // 处理未登录/token过期
        // 可以重定向到登录页或刷新token
      }
      
      return res; // 保持返回原始响应，让调用方处理
    } else {
      return res; // 返回正常响应
    }
  },
  error => {
    console.error('响应错误:', error);
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
          // 可以重定向到登录页
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