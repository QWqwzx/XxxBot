const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 导入路由
const systemRoutes = require('./routes/systemRoutes');
const apiRoutes = require('./routes/api'); // 导入API路由

// CORS配置
const corsOptions = {
  origin: '*', // 允许所有来源
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

// 中间件
app.use(cors(corsOptions)); // 为所有路由启用CORS
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码的请求体

// 基础路由
app.get('/', (req, res) => {
  res.send('管理面板后端服务正在运行!');
});

// 处理预检请求
app.options('*', cors(corsOptions));

// API路由
app.use('/api/system', systemRoutes);
app.use('/api', apiRoutes); // 使用API路由

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`后端服务器正在运行于 http://localhost:${PORT}`);
}); 