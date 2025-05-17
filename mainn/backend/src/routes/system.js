const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

// 获取系统状态
router.get('/status', systemController.getSystemStatus);

// 获取系统信息
router.get('/info', systemController.getSystemInfo);

// 获取机器人状态
router.get('/bot/status', systemController.getBotStatus);

// 获取系统配置
router.get('/config', systemController.getSystemConfig);

// 更新系统配置
router.post('/config/update', systemController.updateSystemConfig);

// 更新协议版本
router.post('/protocol/update', systemController.updateProtocolVersion);

// 更新过滤模式
router.post('/filter/update', systemController.updateFilterMode);

// 获取原始配置文件内容
router.get('/config/raw', systemController.getRawConfig);

// 保存原始配置文件内容
router.post('/config/raw/save', systemController.saveRawConfig);

// 检查新版本
router.post('/version/check', systemController.checkVersion);

// 更新系统
router.post('/version/update', systemController.updateSystem);

// 获取系统日志
router.get('/logs', systemController.getSystemLogs);

// 下载系统日志
router.get('/logs/download', systemController.downloadSystemLogs);

module.exports = router; 