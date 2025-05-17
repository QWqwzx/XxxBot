const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 导入路由
const systemRoutes = require('./routes/systemRoutes');

// CORS配置
const corsOptions = {
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
};

// 中间件
app.use(cors(corsOptions)); // 为所有路由启用CORS，明确允许前端域名
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码的请求体

// 基础路由
app.get('/', (req, res) => {
  res.send('管理面板后端服务正在运行!');
});

// API路由
app.use('/api/system', systemRoutes);

app.listen(PORT, () => {
  console.log(`后端服务器正在运行于 http://localhost:${PORT}`);
}); 