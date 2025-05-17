const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { promises: fsPromises } = require('fs');

// 日志目录路径，可以根据实际情况调整
const LOG_DIR = path.join(__dirname, '../../../../logs');

// 获取日志文件列表
router.get('/files', async (req, res) => {
    try {
        // 确保日志目录存在
        if (!fs.existsSync(LOG_DIR)) {
            fs.mkdirSync(LOG_DIR, { recursive: true });
        }

        const files = await fsPromises.readdir(LOG_DIR);
        const fileInfos = await Promise.all(
            files.map(async (fileName) => {
                try {
                    const filePath = path.join(LOG_DIR, fileName);
                    const stats = await fsPromises.stat(filePath);
                    
                    // 只返回文件，不返回目录
                    if (stats.isFile()) {
                        return {
                            name: fileName,
                            size: stats.size,
                            modifiedTime: stats.mtime
                        };
                    }
                    return null;
                } catch (err) {
                    console.error(`获取文件信息失败: ${fileName}`, err);
                    return null;
                }
            })
        );

        // 过滤掉非文件和获取失败的项
        const validFiles = fileInfos.filter(file => file !== null);
        
        res.json(validFiles);
    } catch (err) {
        console.error('获取日志文件列表失败:', err);
        res.status(500).json({ error: '获取日志文件列表失败' });
    }
});

// 获取日志文件内容
router.get('/content/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        
        // 安全检查：确保文件名不包含路径操作符
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return res.status(400).json({ error: '无效的文件名' });
        }
        
        const filePath = path.join(LOG_DIR, filename);
        
        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: '文件不存在' });
        }
        
        // 读取文件内容
        const content = await fsPromises.readFile(filePath, 'utf-8');
        res.json({ content });
    } catch (err) {
        console.error('读取日志文件内容失败:', err);
        res.status(500).json({ error: '读取日志文件内容失败' });
    }
});

module.exports = router; 