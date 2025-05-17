const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置文件上传中间件
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 临时将文件保存到uploads目录
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // 使用原始文件名
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// 系统状态
router.get('/status', systemController.getSystemStatus);

// 系统信息
router.get('/info', systemController.getSystemInfo);

// 机器人状态
router.get('/bot/status', systemController.getBotStatus);

// 版本检查
router.post('/version/check', systemController.checkVersion);

// 系统更新
router.post('/version/update', systemController.updateSystem);

// 系统日志
router.get('/logs', systemController.getSystemLogs);

// 下载系统日志
router.get('/logs/download', systemController.downloadSystemLogs);

// 插件管理路由
// 获取所有插件列表
router.get('/plugins', systemController.getPlugins);

// 启用/禁用插件
router.post('/plugins/toggle', systemController.togglePlugin);

// 获取插件文档
router.get('/plugins/:pluginName/docs', systemController.getPluginDocs);

// 获取插件配置
router.get('/plugins/:pluginName/config', systemController.getPluginConfig);

// 保存插件配置
router.post('/plugins/:pluginName/config', systemController.savePluginConfig);

// 安装插件
router.post('/plugins/install', systemController.installPlugin);

// 新增：处理通过前端直接下载安装的插件
router.post('/plugins/direct-install', upload.array('files'), systemController.directInstallPlugin);

// 新增：保存从前端下载和解压的插件文件
router.post('/plugins/save-extracted', systemController.saveExtractedPlugin);

// 新增：从GitHub下载并安装插件
router.post('/plugins/download-and-install', systemController.downloadAndInstallPlugin);

// 新增：删除插件
router.post('/plugins/delete', systemController.deletePlugin);

module.exports = router; 