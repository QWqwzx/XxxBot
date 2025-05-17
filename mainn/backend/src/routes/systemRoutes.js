const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

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

module.exports = router; 