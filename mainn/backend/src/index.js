const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 导入路由
const systemRoutes = require('./routes/system');
const apiRoutes = require('./routes/api'); // 导入API路由
const pluginsRoutes = require('./routes/systemRoutes'); // 导入插件路由
const logsRoutes = require('./routes/logs'); // 导入日志路由
const filesRoutes = require('./routes/files'); // 导入文件管理路由

// CORS配置
const corsOptions = {
  origin: 'http://localhost:8080', // 明确指定前端域名，不使用通配符
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
app.use('/api/system', pluginsRoutes); // 使用插件路由，挂载在/api/system下
app.use('/api/logs', logsRoutes); // 使用日志路由，挂载在/api/logs下
app.use('/api/files', filesRoutes); // 使用文件管理路由，挂载在/api/files下
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