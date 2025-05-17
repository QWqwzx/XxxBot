// 此文件为API路由的占位符。
// 示例:
// const express = require('express');
// const router = express.Router();
// router.get('/users', (req, res) => { res.send('用户列表') });
// module.exports = router; 

// API路由
const express = require('express');
const router = express.Router();
const axios = require('axios');

// 添加路由
router.get('/', (req, res) => {
  res.json({
    message: 'API is working',
    version: '1.0.0',
    endpoints: [
      { path: '/api/system/status', method: 'GET', description: '获取系统状态' },
      { path: '/api/system/info', method: 'GET', description: '获取系统信息' },
      { path: '/api/proxy', method: 'GET', description: '代理服务用于处理跨域请求' },
      { path: '/api/test/plugins', method: 'GET', description: '测试用插件列表数据' },
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
  
  console.log(`处理代理请求: ${url}`);
  
  try {
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

    // 添加CORS头，确保可以从任何源访问
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    
    // 返回响应数据
    console.log(`代理请求成功，状态码: ${response.status}`);
    res.send(response.data);
    
  } catch (error) {
    console.error('代理请求失败:', error.message);
    console.error('详细错误:', error);
    
    let errorResponse = {
      success: false,
      message: '代理请求失败',
      error: error.message
    };

    // 如果有详细的错误响应，添加到返回结果中
    if (error.response) {
      errorResponse.status = error.response.status;
      errorResponse.statusText = error.response.statusText;
      
      try {
        // 尝试解析响应内容
        if (error.response.data) {
          if (Buffer.isBuffer(error.response.data)) {
            errorResponse.data = error.response.data.toString('utf8');
          } else {
            errorResponse.data = error.response.data;
          }
        }
      } catch (parseError) {
        errorResponse.parseError = parseError.message;
      }
    }
    
    res.status(error.response?.status || 500).json(errorResponse);
  }
});

// 测试用插件列表数据
router.get('/test/plugins', (req, res) => {
  // 返回一些测试用的插件数据
  const testPlugins = [
    {
      id: "plugin1",
      name: "测试插件1",
      enabled: true,
      description: "这是一个用于测试的插件",
      author: "测试作者",
      version: "1.0.0",
      path: "/path/to/plugin1",
      framework: "original"
    },
    {
      id: "plugin2",
      name: "测试插件2",
      enabled: false,
      description: "另一个测试插件",
      author: "测试团队",
      version: "1.2.3",
      path: "/path/to/plugin2",
      framework: "original"
    }
  ];
  
  res.json({
    success: true,
    message: "获取插件列表成功",
    data: {
      plugins: testPlugins
    }
  });
});

module.exports = router; 