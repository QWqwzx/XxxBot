const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { promises: fsPromises } = require('fs');
const multer = require('multer');

// 文件存储目录，可以根据实际情况调整
const FILES_DIR = path.join(__dirname, '../../../../files');

// 确保文件目录存在
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, FILES_DIR);
  },
  filename: function (req, file, cb) {
    // 使用原始文件名，如果文件已存在，可以添加时间戳避免覆盖
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = path.basename(file.originalname, extension);
    cb(null, `${filename}-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制10MB
  }
});

// 获取文件列表
router.get('/list', async (req, res) => {
  try {
    const files = await fsPromises.readdir(FILES_DIR);
    const fileInfos = await Promise.all(
      files.map(async (fileName) => {
        try {
          const filePath = path.join(FILES_DIR, fileName);
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
    console.error('获取文件列表失败:', err);
    res.status(500).json({ error: '获取文件列表失败' });
  }
});

// 获取文件内容
router.get('/content/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    
    // 安全检查：确保文件名不包含路径操作符
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: '无效的文件名' });
    }
    
    const filePath = path.join(FILES_DIR, filename);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文件不存在' });
    }

    // 如果是下载请求
    if (req.query.download === 'true') {
      return res.download(filePath, filename);
    }
    
    // 读取文件内容
    const content = await fsPromises.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (err) {
    console.error('读取文件内容失败:', err);
    res.status(500).json({ error: '读取文件内容失败' });
  }
});

// 上传文件
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有接收到文件' });
    }
    
    res.json({ 
      success: true, 
      message: '文件上传成功',
      file: {
        name: req.file.filename,
        size: req.file.size,
        path: req.file.path
      }
    });
  } catch (err) {
    console.error('文件上传失败:', err);
    res.status(500).json({ error: '文件上传失败' });
  }
});

// 删除文件
router.delete('/delete/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    
    // 安全检查：确保文件名不包含路径操作符
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: '无效的文件名' });
    }
    
    const filePath = path.join(FILES_DIR, filename);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文件不存在' });
    }
    
    // 删除文件
    await fsPromises.unlink(filePath);
    
    res.json({ success: true, message: '文件删除成功' });
  } catch (err) {
    console.error('文件删除失败:', err);
    res.status(500).json({ error: '文件删除失败' });
  }
});

module.exports = router; 