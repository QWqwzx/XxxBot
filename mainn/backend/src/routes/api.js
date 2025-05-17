// 此文件为API路由的占位符。
// 示例:
// const express = require('express');
// const router = express.Router();
// router.get('/users', (req, res) => { res.send('用户列表') });
// module.exports = router; 

// API路由
const express = require('express');
const router = express.Router();

// 添加路由
router.get('/', (req, res) => {
  res.json({
    message: 'API is working',
    version: '1.0.0',
    endpoints: [
      { path: '/api/system/status', method: 'GET', description: '获取系统状态' },
      { path: '/api/system/info', method: 'GET', description: '获取系统信息' },
      { path: '/api/proxy', method: 'GET', description: '代理服务用于处理跨域请求' },
      // ... 其他端点
    ]
  });
});

// 跨域代理路由
router.get('/proxy', async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({
      success: false,
      message: '缺少URL参数'
    });
  }
  
  try {
    // 引入axios用于请求
    const axios = require('axios');
    
    // 执行代理请求
    const response = await axios({
      method: req.query.method || 'get',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'XYBot-Proxy/1.0'
      },
      timeout: 15000,
      responseType: 'arraybuffer' // 处理任何类型的响应
    });
    
    // 设置适当的响应头
    const contentType = response.headers['content-type'];
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // 返回响应数据
    res.send(response.data);
    
  } catch (error) {
    console.error('代理请求失败:', error.message);
    
    res.status(error.response?.status || 500).json({
      success: false,
      message: '代理请求失败',
      error: error.message
    });
  }
});

module.exports = router; 