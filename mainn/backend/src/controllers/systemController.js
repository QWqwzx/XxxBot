const os = require('os');
const process = require('process');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const TOML = require('@iarna/toml');

// 获取系统状态
exports.getSystemStatus = (req, res) => {
  try {
    const cpuUsage = process.cpuUsage();
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();

    const systemStatus = {
      cpu: {
        // 将微秒转换为毫秒并计算CPU使用百分比(简化计算)
        usage: Math.round((cpuUsage.user + cpuUsage.system) / 1000) / 1000,
        cores: os.cpus().length
      },
      memory: {
        total: Math.round(totalMem / (1024 * 1024)),
        free: Math.round(freeMem / (1024 * 1024)),
        used: Math.round((totalMem - freeMem) / (1024 * 1024)),
        usagePercentage: Math.round(((totalMem - freeMem) / totalMem) * 100),
        processUsage: Math.round(memUsage.rss / (1024 * 1024))
      },
      uptime: {
        system: Math.round(os.uptime()),
        process: Math.round(process.uptime())
      },
      lastUpdate: new Date().toISOString()
    };

    res.json({
      success: true,
      data: systemStatus
    });
  } catch (error) {
    console.error('获取系统状态失败:', error);
    res.status(500).json({
      success: false,
      message: '获取系统状态失败',
      error: error.message
    });
  }
};

// 获取系统详细信息
exports.getSystemInfo = (req, res) => {
  try {
    const systemInfo = {
      os: {
        platform: os.platform(),
        release: os.release(),
        type: os.type(),
        arch: os.arch(),
        hostname: os.hostname()
      },
      cpu: {
        model: os.cpus()[0].model,
        cores: os.cpus().length,
        speed: os.cpus()[0].speed
      },
      memory: {
        total: Math.round(os.totalmem() / (1024 * 1024 * 1024) * 100) / 100 + " GB",
        free: Math.round(os.freemem() / (1024 * 1024 * 1024) * 100) / 100 + " GB"
      },
      network: {
        interfaces: Object.keys(os.networkInterfaces())
      },
      node: {
        version: process.version,
        pid: process.pid,
        execPath: process.execPath
      },
      uptime: {
        system: formatUptime(os.uptime()),
        process: formatUptime(process.uptime())
      }
    };

    res.json({
      success: true,
      data: systemInfo
    });
  } catch (error) {
    console.error('获取系统信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取系统信息失败',
      error: error.message
    });
  }
};

// 获取机器人状态 (模拟数据，实际应从数据库或真实机器人状态获取)
exports.getBotStatus = (req, res) => {
  try {
    // 这里是模拟数据，实际项目中应该从真实的机器人状态数据获取
    const botStatus = {
      status: "online", // online, offline, error
      lastActive: new Date().toISOString(),
      connections: 3,
      uptime: 1234567, // 秒
      messagesProcessed: 1500,
      errors: 0,
      warnings: 2
    };

    res.json({
      success: true,
      data: botStatus
    });
  } catch (error) {
    console.error('获取机器人状态失败:', error);
    res.status(500).json({
      success: false,
      message: '获取机器人状态失败',
      error: error.message
    });
  }
};

// 检查新版本 (模拟数据)
exports.checkVersion = (req, res) => {
  try {
    const versionInfo = {
      currentVersion: "1.0.0",
      latestVersion: "1.1.0",
      hasUpdate: true,
      releaseDate: "2025-05-16",
      releaseNotes: "- 修复了若干bug\n- 优化了性能\n- 添加了新功能",
      downloadUrl: "https://example.com/download/v1.1.0"
    };

    res.json({
      success: true,
      data: versionInfo
    });
  } catch (error) {
    console.error('检查版本失败:', error);
    res.status(500).json({
      success: false,
      message: '检查版本失败',
      error: error.message
    });
  }
};

// 更新应用程序 (模拟)
exports.updateSystem = (req, res) => {
  // 实际应用中，这里应执行更新逻辑
  setTimeout(() => {
    res.json({
      success: true,
      message: '系统已成功更新到最新版本'
    });
  }, 2000); // 模拟更新需要的时间
};

// 获取系统日志 (模拟)
exports.getSystemLogs = (req, res) => {
  try {
    const { logLevel, limit } = req.query;
    
    // 生成一些模拟日志
    const logLevels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];
    const filteredLevels = logLevel ? logLevels.slice(logLevels.indexOf(logLevel.toUpperCase())) : logLevels;
    
    const logs = [];
    const maxLogs = limit ? parseInt(limit) : 100;
    
    for (let i = 0; i < maxLogs; i++) {
      const level = filteredLevels[Math.floor(Math.random() * filteredLevels.length)];
      const timestamp = new Date(Date.now() - i * 60000).toISOString(); // 每条日志间隔1分钟
      
      logs.push({
        timestamp,
        level,
        message: `这是一条${level}级别的系统日志消息 #${i+1}`,
        source: i % 3 === 0 ? 'system' : i % 3 === 1 ? 'bot' : 'user'
      });
    }
    
    res.json({
      success: true,
      data: {
        logs,
        total: logs.length
      }
    });
  } catch (error) {
    console.error('获取系统日志失败:', error);
    res.status(500).json({
      success: false,
      message: '获取系统日志失败',
      error: error.message
    });
  }
};

// 下载系统日志 (示例，实际应生成真实的日志文件)
exports.downloadSystemLogs = (req, res) => {
  try {
    const logType = req.query.t || 'system';
    
    // 创建临时日志内容
    const logContent = `=== ${logType.toUpperCase()} LOGS ===\n` +
      `Generated at: ${new Date().toISOString()}\n\n` +
      Array(100).fill(0).map((_, i) => 
        `[${new Date(Date.now() - i * 60000).toISOString()}] [INFO] 日志行 ${i+1}\n`
      ).join('');
    
    // 设置响应头，使浏览器下载此内容为文件
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename=${logType}_logs_${Date.now()}.txt`);
    
    res.send(logContent);
  } catch (error) {
    console.error('下载系统日志失败:', error);
    res.status(500).json({
      success: false,
      message: '下载系统日志失败',
      error: error.message
    });
  }
};

// 获取插件列表
exports.getPlugins = async (req, res) => {
  try {
    // 查找主项目根目录（假设后端在主项目的子目录中）
    const rootDir = path.resolve(__dirname, '../../../..');
    const pluginsDir = path.join(rootDir, 'plugins');
    const configPath = path.join(rootDir, 'main_config.toml');
    
    console.log('查找插件目录:', pluginsDir);
    console.log('配置文件路径:', configPath);

    // 检查插件目录是否存在
    if (!fs.existsSync(pluginsDir)) {
      console.error('插件目录不存在:', pluginsDir);
      return res.status(404).json({
        success: false,
        message: '插件目录不存在',
        error: `路径 ${pluginsDir} 不存在`
      });
    }

    // 检查配置文件是否存在
    if (!fs.existsSync(configPath)) {
      console.error('配置文件不存在:', configPath);
      // 尝试使用示例配置文件
      const exampleConfigPath = path.join(rootDir, 'main_config.toml.example');
      if (fs.existsSync(exampleConfigPath)) {
        console.log('使用示例配置文件:', exampleConfigPath);
        fs.copyFileSync(exampleConfigPath, configPath);
      } else {
        return res.status(404).json({
          success: false,
          message: '配置文件不存在',
          error: `路径 ${configPath} 不存在`
        });
      }
    }

    // 读取配置文件
    const configContent = fs.readFileSync(configPath, 'utf-8');
    let config = {};
    try {
      config = TOML.parse(configContent);
    } catch (tomlError) {
      console.error('解析TOML配置文件失败:', tomlError);
      return res.status(500).json({
        success: false,
        message: '解析配置文件失败',
        error: tomlError.message
      });
    }
    
    // 获取禁用的插件列表
    const disabledPlugins = config.XYBot?.['disabled-plugins'] || [];

    // 扫描插件目录
    const plugins = [];
    let dirs = [];
    try {
      dirs = fs.readdirSync(pluginsDir);
    } catch (readdirError) {
      console.error('读取插件目录失败:', readdirError);
      return res.status(500).json({
        success: false,
        message: '读取插件目录失败',
        error: readdirError.message
      });
    }
    
    console.log(`找到 ${dirs.length} 个插件目录`);
    
    for (const dir of dirs) {
      const pluginDir = path.join(pluginsDir, dir);
      let stats;
      
      try {
        stats = fs.statSync(pluginDir);
      } catch (statError) {
        console.error(`获取 ${pluginDir} 状态失败:`, statError);
        continue;
      }
      
      if (stats.isDirectory()) {
        const mainPath = path.join(pluginDir, 'main.py');
        
        // 检查是否有main.py文件
        if (fs.existsSync(mainPath)) {
          try {
            // 读取main.py文件内容以提取插件信息
            const content = fs.readFileSync(mainPath, 'utf-8');
            
            // 尝试提取插件类名
            const classMatch = content.match(/class\s+(\w+)\s*\(\s*PluginBase\s*\)/);
            if (!classMatch) {
              console.log(`跳过 ${dir}: 未找到插件类定义`);
              continue;
            }
            
            const className = classMatch[1];
            console.log(`处理插件: ${className} (${dir})`);
            
            // 提取描述
            const descMatch = content.match(/description\s*=\s*(['"])(.*?)\1/);
            const description = descMatch ? descMatch[2] : '';
            
            // 提取作者
            const authorMatch = content.match(/author\s*=\s*(['"])(.*?)\1/);
            const author = authorMatch ? authorMatch[2] : '';
            
            // 提取版本
            const versionMatch = content.match(/version\s*=\s*(['"])(.*?)\1/);
            const version = versionMatch ? versionMatch[2] : '1.0.0';
            
            // 确定是否为核心插件
            const isCore = className === 'ManagePlugin';
            
            // 确定是否启用
            const enabled = !disabledPlugins.includes(className);
            
            // 尝试读取README.md获取更多信息
            let readme = '';
            const readmePath = path.join(pluginDir, 'README.md');
            if (fs.existsSync(readmePath)) {
              readme = fs.readFileSync(readmePath, 'utf-8');
            }
            
            plugins.push({
              name: className,
              description,
              author,
              version,
              enabled,
              isCore,
              directory: dir,
              readme
            });
          } catch (error) {
            console.error(`处理插件 ${dir} 时出错:`, error);
            // 继续处理下一个插件
          }
        } else {
          console.log(`跳过 ${dir}: 未找到main.py文件`);
        }
      }
    }
    
    console.log(`成功处理 ${plugins.length} 个插件`);
    
    res.json({
      success: true,
      data: {
        plugins,
        total: plugins.length
      }
    });
  } catch (error) {
    console.error('获取插件列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取插件列表失败',
      error: error.message
    });
  }
};

// 启用/禁用插件
exports.togglePlugin = async (req, res) => {
  try {
    const { pluginName, enable } = req.body;
    if (!pluginName) {
      return res.status(400).json({
        success: false,
        message: '缺少插件名称'
      });
    }
    
    // 查找主项目根目录
    const rootDir = path.resolve(__dirname, '../../../..');
    const configPath = path.join(rootDir, 'main_config.toml');
    
    // 读取配置文件
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = TOML.parse(configContent);
    
    // 获取禁用的插件列表
    let disabledPlugins = config.XYBot?.['disabled-plugins'] || [];
    
    // 修改禁用列表
    if (enable) {
      // 启用插件 - 从禁用列表中移除
      disabledPlugins = disabledPlugins.filter(p => p !== pluginName);
    } else {
      // 禁用插件 - 添加到禁用列表
      if (!disabledPlugins.includes(pluginName)) {
        disabledPlugins.push(pluginName);
      }
    }
    
    // 更新配置
    config.XYBot['disabled-plugins'] = disabledPlugins;
    
    // 写回配置文件
    fs.writeFileSync(configPath, TOML.stringify(config));
    
    res.json({
      success: true,
      message: enable ? `插件 ${pluginName} 已启用` : `插件 ${pluginName} 已禁用`,
      data: {
        pluginName,
        enabled: enable
      }
    });
  } catch (error) {
    console.error('修改插件状态失败:', error);
    res.status(500).json({
      success: false,
      message: '修改插件状态失败',
      error: error.message
    });
  }
};

// 获取插件文档
exports.getPluginDocs = async (req, res) => {
  try {
    const { pluginName } = req.params;
    if (!pluginName) {
      return res.status(400).json({
        success: false,
        message: '缺少插件名称'
      });
    }
    
    // 查找主项目根目录
    const rootDir = path.resolve(__dirname, '../../../..');
    const pluginsDir = path.join(rootDir, 'plugins');
    
    // 找到包含该插件的目录
    let pluginDir = null;
    const dirs = fs.readdirSync(pluginsDir);
    
    for (const dir of dirs) {
      const dirPath = path.join(pluginsDir, dir);
      if (!fs.statSync(dirPath).isDirectory()) continue;
      
      const mainPath = path.join(dirPath, 'main.py');
      
      if (fs.existsSync(mainPath)) {
        try {
          const content = fs.readFileSync(mainPath, 'utf-8');
          if (content.includes(`class ${pluginName}(`)) {
            pluginDir = dirPath;
            break;
          }
        } catch (readError) {
          console.error(`读取 ${mainPath} 时出错:`, readError);
        }
      }
    }
    
    if (!pluginDir) {
      return res.status(404).json({
        success: false,
        message: `找不到插件 ${pluginName}`,
        error: '在插件目录中无法找到匹配的插件'
      });
    }
    
    // 尝试读取README.md（多种可能的文件名和大小写）
    const possibleReadmeNames = ['README.md', 'Readme.md', 'readme.md', 'README.MD', 'README.markdown', 'README.txt', 'readme.txt'];
    let docs = '';
    let readmeFound = false;
    let attemptedPaths = [];
    
    for (const readmeName of possibleReadmeNames) {
      const readmePath = path.join(pluginDir, readmeName);
      attemptedPaths.push(readmePath);
      
      if (fs.existsSync(readmePath)) {
        try {
          docs = fs.readFileSync(readmePath, 'utf-8');
          readmeFound = true;
          console.log(`找到并读取 ${readmeName} 文件: ${readmePath}`);
          break;
        } catch (readError) {
          console.error(`读取 ${readmePath} 时出错:`, readError);
        }
      }
    }
    
    if (!readmeFound) {
      docs = `# ${pluginName}\n\n该插件暂无文档。`;
      console.log(`未找到 ${pluginName} 的文档文件，尝试过以下路径:\n${attemptedPaths.join('\n')}`);
      
      return res.json({
        success: false,
        message: '加载文档失败',
        data: {
          pluginName,
          docs: `# ${pluginName}\n\n加载文档失败，可能原因：\n\n* README.md文件不存在或无法读取\n* 服务器错误\n* 文件权限问题\n\n尝试过以下路径:\n${attemptedPaths.map(p => `* ${p}`).join('\n')}`,
          error: '找不到README.md文件'
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        pluginName,
        docs
      }
    });
  } catch (error) {
    console.error('获取插件文档失败:', error);
    res.status(500).json({
      success: false,
      message: '获取插件文档失败',
      error: error.message
    });
  }
};

// 获取插件配置
exports.getPluginConfig = async (req, res) => {
  try {
    const { pluginName } = req.params;
    if (!pluginName) {
      return res.status(400).json({
        success: false,
        message: '缺少插件名称'
      });
    }
    
    // 查找主项目根目录
    const rootDir = path.resolve(__dirname, '../../../..');
    const pluginsDir = path.join(rootDir, 'plugins');
    
    // 找到包含该插件的目录
    let pluginDir = null;
    const dirs = fs.readdirSync(pluginsDir);
    
    for (const dir of dirs) {
      const dirPath = path.join(pluginsDir, dir);
      if (!fs.statSync(dirPath).isDirectory()) continue;
      
      const mainPath = path.join(dirPath, 'main.py');
      
      if (fs.existsSync(mainPath)) {
        try {
          const content = fs.readFileSync(mainPath, 'utf-8');
          if (content.includes(`class ${pluginName}(`)) {
            pluginDir = dirPath;
            break;
          }
        } catch (readError) {
          console.error(`读取 ${mainPath} 时出错:`, readError);
        }
      }
    }
    
    if (!pluginDir) {
      return res.status(404).json({
        success: false,
        message: `找不到插件 ${pluginName}`,
        error: '在插件目录中无法找到匹配的插件'
      });
    }
    
    // 尝试读取config.toml或config.json
    const tomlConfigPath = path.join(pluginDir, 'config.toml');
    const jsonConfigPath = path.join(pluginDir, 'config.json');
    let config = {};
    let configFound = false;
    let configError = null;
    let configPath = null;
    
    // 先尝试读取config.toml
    if (fs.existsSync(tomlConfigPath)) {
      try {
        const content = fs.readFileSync(tomlConfigPath, 'utf-8');
        config = TOML.parse(content);
        configFound = true;
        configPath = tomlConfigPath;
        console.log(`找到并解析 config.toml: ${tomlConfigPath}`);
      } catch (tomlError) {
        console.error(`解析 ${tomlConfigPath} 失败:`, tomlError);
        configError = `解析TOML文件失败: ${tomlError.message}`;
      }
    }
    
    // 如果没有找到或解析config.toml失败，尝试读取config.json
    if (!configFound && fs.existsSync(jsonConfigPath)) {
      try {
        const content = fs.readFileSync(jsonConfigPath, 'utf-8');
        config = JSON.parse(content);
        configFound = true;
        configPath = jsonConfigPath;
        console.log(`找到并解析 config.json: ${jsonConfigPath}`);
      } catch (jsonError) {
        console.error(`解析 ${jsonConfigPath} 失败:`, jsonError);
        
        if (configError) {
          configError += `\n解析JSON文件失败: ${jsonError.message}`;
        } else {
          configError = `解析JSON文件失败: ${jsonError.message}`;
        }
      }
    }
    
    if (!configFound) {
      console.log(`未找到 ${pluginName} 的配置文件`);
      if (configError) {
        return res.status(400).json({
          success: false,
          message: '配置文件解析失败',
          error: configError,
          data: {
            pluginName,
            config: {}
          }
        });
      }
    }
    
    res.json({
      success: configFound,
      message: configFound ? '成功获取配置' : '未找到配置文件',
      data: {
        pluginName,
        config,
        configType: configPath ? path.extname(configPath).substring(1) : null
      }
    });
  } catch (error) {
    console.error('获取插件配置失败:', error);
    res.status(500).json({
      success: false,
      message: '获取插件配置失败',
      error: error.message
    });
  }
};

// 保存插件配置
exports.savePluginConfig = async (req, res) => {
  try {
    const { pluginName } = req.params;
    const { config } = req.body;
    
    if (!pluginName) {
      return res.status(400).json({
        success: false,
        message: '缺少插件名称'
      });
    }
    
    if (!config) {
      return res.status(400).json({
        success: false,
        message: '缺少配置内容'
      });
    }
    
    // 查找主项目根目录
    const rootDir = path.resolve(__dirname, '../../../..');
    const pluginsDir = path.join(rootDir, 'plugins');
    
    // 找到包含该插件的目录
    let pluginDir = null;
    const dirs = fs.readdirSync(pluginsDir);
    
    for (const dir of dirs) {
      const dirPath = path.join(pluginsDir, dir);
      if (!fs.statSync(dirPath).isDirectory()) continue;
      
      const mainPath = path.join(dirPath, 'main.py');
      
      if (fs.existsSync(mainPath)) {
        try {
          const content = fs.readFileSync(mainPath, 'utf-8');
          if (content.includes(`class ${pluginName}(`)) {
            pluginDir = dirPath;
            break;
          }
        } catch (readError) {
          console.error(`读取 ${mainPath} 时出错:`, readError);
        }
      }
    }
    
    if (!pluginDir) {
      return res.status(404).json({
        success: false,
        message: `找不到插件 ${pluginName}`,
        error: '在插件目录中无法找到匹配的插件'
      });
    }
    
    // 检查是否存在config.toml或config.json并保存配置
    const tomlConfigPath = path.join(pluginDir, 'config.toml');
    const jsonConfigPath = path.join(pluginDir, 'config.json');
    let saveResult = { success: false, path: null, error: null };
    
    // 确定要保存的配置文件格式和路径
    if (fs.existsSync(tomlConfigPath)) {
      // 如果存在config.toml，优先使用TOML格式保存
      try {
        const tomlString = TOML.stringify(config);
        fs.writeFileSync(tomlConfigPath, tomlString);
        saveResult = { success: true, path: tomlConfigPath, format: 'toml' };
        console.log(`配置已保存到 ${tomlConfigPath} (TOML格式)`);
      } catch (tomlError) {
        console.error(`保存到 ${tomlConfigPath} 失败:`, tomlError);
        saveResult.error = `保存TOML配置失败: ${tomlError.message}`;
      }
    } else if (fs.existsSync(jsonConfigPath)) {
      // 如果存在config.json，使用JSON格式保存
      try {
        fs.writeFileSync(jsonConfigPath, JSON.stringify(config, null, 2));
        saveResult = { success: true, path: jsonConfigPath, format: 'json' };
        console.log(`配置已保存到 ${jsonConfigPath} (JSON格式)`);
      } catch (jsonError) {
        console.error(`保存到 ${jsonConfigPath} 失败:`, jsonError);
        saveResult.error = `保存JSON配置失败: ${jsonError.message}`;
      }
    } else {
      // 如果两种配置文件都不存在，默认使用JSON格式创建新文件
      try {
        fs.writeFileSync(jsonConfigPath, JSON.stringify(config, null, 2));
        saveResult = { success: true, path: jsonConfigPath, format: 'json', created: true };
        console.log(`创建并保存配置到 ${jsonConfigPath} (JSON格式)`);
      } catch (createError) {
        console.error(`创建配置文件 ${jsonConfigPath} 失败:`, createError);
        saveResult.error = `创建配置文件失败: ${createError.message}`;
      }
    }
    
    if (!saveResult.success) {
      return res.status(500).json({
        success: false,
        message: '保存配置失败',
        error: saveResult.error
      });
    }
    
    res.json({
      success: true,
      message: `插件 ${pluginName} 配置已保存到 ${saveResult.format.toUpperCase()} 格式文件`,
      data: {
        pluginName,
        config,
        format: saveResult.format,
        created: saveResult.created || false
      }
    });
  } catch (error) {
    console.error('保存插件配置失败:', error);
    res.status(500).json({
      success: false,
      message: '保存插件配置失败',
      error: error.message
    });
  }
};

// 直接安装插件（从前端上传的文件）
exports.directInstallPlugin = async (req, res) => {
  try {
    const pluginName = req.body.plugin_name;
    const files = req.files || [];
    
    if (!pluginName) {
      return res.status(400).json({
        success: false,
        message: '缺少插件名称参数',
        error: '请提供 plugin_name 参数'
      });
    }
    
    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件',
        error: '请上传插件文件'
      });
    }
    
    console.log(`收到插件 ${pluginName} 的 ${files.length} 个文件`);
    
    // 查找主项目根目录
    const rootDir = path.resolve(__dirname, '../../../..');
    const pluginsDir = path.join(rootDir, 'plugins');
    const pluginDir = path.join(pluginsDir, pluginName);
    
    // 确保插件目录存在
    if (!fs.existsSync(pluginsDir)) {
      fs.mkdirSync(pluginsDir, { recursive: true });
      console.log(`创建插件目录: ${pluginsDir}`);
    }
    
    // 如果插件目录已存在，先备份配置文件
    let configBackup = null;
    const configPath = path.join(pluginDir, 'config.toml');
    
    if (fs.existsSync(pluginDir)) {
      // 备份配置文件（如果存在）
      if (fs.existsSync(configPath)) {
        configBackup = fs.readFileSync(configPath);
        console.log(`备份了插件配置文件: ${configPath}`);
      }
      
      // 删除旧目录
      fs.rmSync(pluginDir, { recursive: true, force: true });
      console.log(`删除了旧的插件目录: ${pluginDir}`);
    }
    
    // 创建插件目录
    fs.mkdirSync(pluginDir, { recursive: true });
    console.log(`创建插件目录: ${pluginDir}`);
    
    // 处理上传的文件
    const filePaths = req.body.file_paths ? JSON.parse(req.body.file_paths) : [];
    let processedFiles = 0;
    
    if (filePaths.length > 0 && filePaths.length === files.length) {
      // 如果提供了文件路径映射
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = filePaths[i];
        
        const destPath = path.join(pluginDir, filePath);
        const destDir = path.dirname(destPath);
        
        // 确保目标目录存在
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        // 移动文件
        fs.copyFileSync(file.path, destPath);
        
        // 删除临时文件
        fs.unlinkSync(file.path);
        
        processedFiles++;
      }
    } else {
      // 否则，直接将文件复制到插件目录
      for (const file of files) {
        const destPath = path.join(pluginDir, file.originalname);
        
        // 移动文件
        fs.copyFileSync(file.path, destPath);
        
        // 删除临时文件
        fs.unlinkSync(file.path);
        
        processedFiles++;
      }
    }
    
    // 恢复配置文件（如果有）
    if (configBackup) {
      fs.writeFileSync(configPath, configBackup);
      console.log(`恢复了插件配置文件: ${configPath}`);
    }
    
    console.log(`插件 ${pluginName} 安装成功，处理了 ${processedFiles} 个文件`);
    
    // 返回成功结果
    res.json({
      success: true,
      message: `插件 ${pluginName} 安装成功！`,
      data: {
        plugin_name: pluginName,
        files_processed: processedFiles
      }
    });
  } catch (error) {
    console.error('直接安装插件失败:', error);
    res.status(500).json({
      success: false,
      message: '安装插件失败',
      error: error.message
    });
  }
};

// 安装插件 (从API代理到管理后台)
exports.installPlugin = async (req, res) => {
  try {
    const https = require('https');
    const http = require('http');

    // 获取管理后台主机和端口（根据admin/server.py的默认值）
    // 实际使用时应从环境变量或配置中读取
    const ADMIN_HOST = 'localhost';
    const ADMIN_PORT = 8080; // 默认管理后台端口是8080，不是8000

    // 构建请求选项
    const options = {
      hostname: ADMIN_HOST,
      port: ADMIN_PORT,
      path: '/api/plugin_market/install',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30秒超时
    };

    // 将原始请求数据传递给admin server
    const data = req.body;
    
    console.log('正在代理插件安装请求到管理后台:', JSON.stringify(data));
    console.log(`管理后台地址: http://${ADMIN_HOST}:${ADMIN_PORT}/api/plugin_market/install`);

    // 创建请求
    const proxyReq = http.request(options, (proxyRes) => {
      // 获取响应状态码
      const statusCode = proxyRes.statusCode;
      console.log('管理后台响应状态码:', statusCode);

      // 读取响应数据
      let responseData = '';
      proxyRes.on('data', (chunk) => {
        responseData += chunk;
      });

      // 处理响应完成
      proxyRes.on('end', () => {
        try {
          // 尝试解析JSON响应
          const parsedData = JSON.parse(responseData);
          console.log('管理后台响应结果:', parsedData);
          
          // 将admin响应转发回客户端
          res.status(statusCode).json(parsedData);
        } catch (error) {
          console.error('解析管理后台响应失败:', error);
          console.error('原始响应数据:', responseData);
          // 转发原始响应
          res.status(statusCode).send(responseData);
        }
      });
    });

    // 处理请求错误
    proxyReq.on('error', (error) => {
      console.error('代理请求失败:', error);
      
      // 返回更详细的错误信息
      res.status(500).json({
        success: false,
        message: '无法连接到管理后台服务器',
        error: error.message,
        details: `请确保管理后台服务器 (http://${ADMIN_HOST}:${ADMIN_PORT}) 正在运行`,
        troubleshooting: [
          '1. 管理后台服务器是否正在运行?',
          '2. 管理后台服务器端口是否为 8080?',
          '3. 防火墙是否阻止了连接?',
          '4. 网络连接是否正常?'
        ]
      });
    });

    // 设置请求超时处理
    proxyReq.on('timeout', () => {
      proxyReq.destroy();
      res.status(504).json({
        success: false,
        message: '连接管理后台超时',
        error: '请求超时，管理后台未响应',
        details: `尝试连接 http://${ADMIN_HOST}:${ADMIN_PORT} 超时`
      });
    });

    // 发送请求数据
    proxyReq.write(JSON.stringify(data));
    proxyReq.end();
    
  } catch (error) {
    console.error('安装插件请求处理失败:', error);
    res.status(500).json({
      success: false,
      message: '处理安装插件请求失败',
      error: error.message,
      stack: error.stack
    });
  }
};

// 格式化正常运行时间
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  
  let uptime = '';
  if (days > 0) uptime += `${days}天 `;
  if (hours > 0 || days > 0) uptime += `${hours}小时 `;
  if (minutes > 0 || hours > 0 || days > 0) uptime += `${minutes}分钟 `;
  uptime += `${seconds}秒`;
  
  return uptime;
}

// 接收插件下载的文件并安装 (来自前端解压的文件)
exports.saveExtractedPlugin = async (req, res) => {
  try {
    const { pluginName, files } = req.body;
    
    if (!pluginName) {
      return res.status(400).json({
        success: false,
        message: '缺少插件名称',
        error: '请提供插件名称'
      });
    }
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有收到文件数据',
        error: '请提供插件文件数据'
      });
    }
    
    // 查找主项目根目录
    const rootDir = path.resolve(__dirname, '../../../..');
    const pluginsDir = path.join(rootDir, 'plugins');
    const pluginDir = path.join(pluginsDir, pluginName);
    
    console.log(`准备安装插件 ${pluginName}，共有 ${files.length} 个文件`);
    
    // 确保插件目录存在
    if (!fs.existsSync(pluginsDir)) {
      fs.mkdirSync(pluginsDir, { recursive: true });
      console.log(`创建插件目录: ${pluginsDir}`);
    }
    
    // 如果插件目录已存在，先备份配置文件
    let configBackup = null;
    const configPath = path.join(pluginDir, 'config.toml');
    
    if (fs.existsSync(pluginDir)) {
      // 备份配置文件（如果存在）
      if (fs.existsSync(configPath)) {
        configBackup = fs.readFileSync(configPath);
        console.log(`备份了插件配置文件: ${configPath}`);
      }
      
      // 删除旧目录
      fs.rmSync(pluginDir, { recursive: true, force: true });
      console.log(`删除了旧的插件目录: ${pluginDir}`);
    }
    
    // 创建插件目录
    fs.mkdirSync(pluginDir, { recursive: true });
    console.log(`创建插件目录: ${pluginDir}`);
    
    // 保存文件
    let processedFiles = 0;
    
    for (const file of files) {
      const { path: filePath, content: fileContentBase64 } = file;
      
      if (!filePath) {
        console.warn('跳过没有路径的文件');
        continue;
      }
      
      // 确保没有尝试访问上级目录（安全检查）
      if (filePath.includes('..')) {
        console.warn(`跳过可疑路径: ${filePath}`);
        continue;
      }
      
      const destPath = path.join(pluginDir, filePath);
      const destDir = path.dirname(destPath);
      
      // 确保目标目录存在
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // 将Base64内容解码为Buffer并写入文件
      try {
        // 处理文件内容 - 支持Base64字符串或原始Buffer
        let fileContent;
        if (typeof fileContentBase64 === 'string') {
          // 如果是Base64字符串，解码
          fileContent = Buffer.from(fileContentBase64, 'base64');
        } else {
          // 如果已经是Buffer或ArrayBuffer，直接使用
          fileContent = Buffer.from(fileContentBase64);
        }
        
        fs.writeFileSync(destPath, fileContent);
        processedFiles++;
        console.log(`写入文件: ${destPath}`);
      } catch (writeError) {
        console.error(`写入文件 ${destPath} 失败:`, writeError);
      }
    }
    
    // 恢复配置文件（如果有）
    if (configBackup) {
      fs.writeFileSync(configPath, configBackup);
      console.log(`恢复了插件配置文件: ${configPath}`);
    }
    
    console.log(`插件 ${pluginName} 安装成功，处理了 ${processedFiles} 个文件`);
    
    // 返回成功结果
    res.json({
      success: true,
      message: `插件 ${pluginName} 安装成功`,
      data: {
        pluginName,
        filesProcessed: processedFiles
      }
    });
  } catch (error) {
    console.error('保存解压的插件文件失败:', error);
    res.status(500).json({
      success: false,
      message: '安装插件失败',
      error: error.message
    });
  }
};

// 从GitHub下载并安装插件
exports.downloadAndInstallPlugin = async (req, res) => {
  try {
    const { githubUrl, pluginName } = req.body;
    
    if (!githubUrl) {
      return res.status(400).json({
        success: false,
        message: '缺少GitHub仓库地址',
        error: '请提供githubUrl参数'
      });
    }
    
    if (!pluginName) {
      return res.status(400).json({
        success: false,
        message: '缺少插件名称',
        error: '请提供pluginName参数'
      });
    }
    
    console.log(`从GitHub下载插件: ${pluginName}, URL: ${githubUrl}`);
    
    // 查找主项目根目录
    const rootDir = path.resolve(__dirname, '../../../..');
    const pluginsDir = path.join(rootDir, 'plugins');
    const pluginDir = path.join(pluginsDir, pluginName);
    const tempZipPath = path.join(os.tmpdir(), `${pluginName}-${Date.now()}.zip`);
    
    // 确保插件目录存在
    if (!fs.existsSync(pluginsDir)) {
      fs.mkdirSync(pluginsDir, { recursive: true });
      console.log(`创建插件目录: ${pluginsDir}`);
    }
    
    // 使用Node.js内置库下载ZIP文件
    const https = require('https');
    const http = require('http');
    const url = require('url');
    const { exec } = require('child_process');
    const { pipeline } = require('stream');
    const { promisify } = require('util');
    const streamPipeline = promisify(pipeline);
    
    // 构建下载URL
    let downloadUrl = `${githubUrl}/archive/refs/heads/main.zip`;
    console.log(`尝试下载: ${downloadUrl}`);
    
    // 使用node-fetch或其他HTTP客户端下载
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    
    try {
      // 尝试下载main分支
      const mainResponse = await fetch(downloadUrl, { timeout: 15000 });
      
      if (!mainResponse.ok) {
        // 如果main分支下载失败，尝试master分支
        downloadUrl = `${githubUrl}/archive/refs/heads/master.zip`;
        console.log(`main分支不存在，尝试下载: ${downloadUrl}`);
        
        const masterResponse = await fetch(downloadUrl, { timeout: 15000 });
        
        if (!masterResponse.ok) {
          throw new Error(`无法下载ZIP文件，HTTP状态: ${masterResponse.status}`);
        }
        
        // 使用masterResponse下载
        const fileStream = fs.createWriteStream(tempZipPath);
        await streamPipeline(masterResponse.body, fileStream);
      } else {
        // 使用mainResponse下载
        const fileStream = fs.createWriteStream(tempZipPath);
        await streamPipeline(mainResponse.body, fileStream);
      }
    } catch (fetchError) {
      console.error(`下载插件ZIP文件失败:`, fetchError);
      
      // 尝试使用curl或wget命令行工具下载
      try {
        console.log(`使用命令行工具下载: ${downloadUrl}`);
        
        // 使用curl下载
        await new Promise((resolve, reject) => {
          exec(`curl -L -o "${tempZipPath}" "${downloadUrl}"`, (error, stdout, stderr) => {
            if (error) {
              reject(new Error(`curl下载失败: ${error.message}`));
              return;
            }
            resolve();
          });
        });
      } catch (curlError) {
        console.error(`curl下载失败:`, curlError);
        
        try {
          // 使用wget下载
          await new Promise((resolve, reject) => {
            exec(`wget -O "${tempZipPath}" "${downloadUrl}"`, (error, stdout, stderr) => {
              if (error) {
                reject(new Error(`wget下载失败: ${error.message}`));
                return;
              }
              resolve();
            });
          });
        } catch (wgetError) {
          console.error(`wget下载失败:`, wgetError);
          throw new Error(`所有下载方法都失败了: ${fetchError.message}`);
        }
      }
    }
    
    console.log(`ZIP文件下载成功，保存到: ${tempZipPath}`);
    
    // 如果插件目录已存在，先备份配置文件
    let configBackup = null;
    const configPath = path.join(pluginDir, 'config.toml');
    
    if (fs.existsSync(pluginDir)) {
      // 备份配置文件（如果存在）
      if (fs.existsSync(configPath)) {
        configBackup = fs.readFileSync(configPath);
        console.log(`备份了插件配置文件: ${configPath}`);
      }
      
      // 删除旧目录
      fs.rmSync(pluginDir, { recursive: true, force: true });
      console.log(`删除了旧的插件目录: ${pluginDir}`);
    }
    
    // 创建插件目录
    fs.mkdirSync(pluginDir, { recursive: true });
    console.log(`创建插件目录: ${pluginDir}`);
    
    // 解压ZIP文件
    const AdmZip = require('adm-zip');
    try {
      const zip = new AdmZip(tempZipPath);
      const zipEntries = zip.getEntries();
      
      // 查找基础目录名称
      let baseDir = '';
      const baseDirRegex = /^([^\/]+)\//;
      
      for (const entry of zipEntries) {
        const match = entry.entryName.match(baseDirRegex);
        if (match && !baseDir) {
          baseDir = match[1];
          break;
        }
      }
      
      console.log(`ZIP文件中的基本目录: ${baseDir}`);
      
      // 提取文件
      let extractedFiles = 0;
      
      for (const entry of zipEntries) {
        if (entry.isDirectory) {
          continue;
        }
        
        // 从基础目录中提取相对路径
        let relativePath = entry.entryName;
        if (baseDir && relativePath.startsWith(`${baseDir}/`)) {
          relativePath = relativePath.substring(baseDir.length + 1);
        }
        
        // 确保目标目录存在
        const destPath = path.join(pluginDir, relativePath);
        const destDir = path.dirname(destPath);
        
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        // 提取文件
        zip.extractEntryTo(entry, destDir, false, true);
        extractedFiles++;
      }
      
      console.log(`成功提取 ${extractedFiles} 个文件到 ${pluginDir}`);
    } catch (zipError) {
      console.error(`解压ZIP文件失败:`, zipError);
      
      // 尝试使用命令行工具解压
      try {
        await new Promise((resolve, reject) => {
          exec(`cd "${pluginsDir}" && mkdir -p "${pluginName}" && unzip -o "${tempZipPath}" -d "${pluginName}"`, (error, stdout, stderr) => {
            if (error) {
              reject(new Error(`unzip解压失败: ${error.message}`));
              return;
            }
            resolve();
          });
        });
        
        console.log(`使用命令行unzip工具解压成功`);
      } catch (unzipError) {
        console.error(`命令行解压失败:`, unzipError);
        throw new Error(`解压ZIP文件失败: ${zipError.message}`);
      }
    }
    
    // 清理临时文件
    try {
      fs.unlinkSync(tempZipPath);
      console.log(`已删除临时ZIP文件: ${tempZipPath}`);
    } catch (unlinkError) {
      console.warn(`删除临时ZIP文件失败:`, unlinkError);
    }
    
    // 恢复配置文件（如果有）
    if (configBackup) {
      fs.writeFileSync(configPath, configBackup);
      console.log(`恢复了插件配置文件: ${configPath}`);
    }
    
    // 返回成功结果
    res.json({
      success: true,
      message: `插件 ${pluginName} 安装成功！`,
      data: {
        pluginName,
        githubUrl
      }
    });
  } catch (error) {
    console.error('下载并安装插件失败:', error);
    res.status(500).json({
      success: false,
      message: '下载并安装插件失败',
      error: error.message
    });
  }
};

// 删除插件
exports.deletePlugin = async (req, res) => {
  try {
    const { pluginName } = req.body;
    
    if (!pluginName) {
      return res.status(400).json({
        success: false,
        message: '缺少插件名称',
        error: '请提供pluginName参数'
      });
    }
    
    console.log(`准备删除插件: ${pluginName}`);
    
    // 查找主项目根目录
    const rootDir = path.resolve(__dirname, '../../../..');
    const pluginsDir = path.join(rootDir, 'plugins');
    const pluginDir = path.join(pluginsDir, pluginName);
    
    // 检查插件目录是否存在
    if (!fs.existsSync(pluginDir)) {
      return res.status(404).json({
        success: false,
        message: `插件 ${pluginName} 不存在`,
        error: `找不到插件目录: ${pluginDir}`
      });
    }
    
    // 检查是否为核心插件 (可选)
    const mainPyPath = path.join(pluginDir, 'main.py');
    if (fs.existsSync(mainPyPath)) {
      const content = fs.readFileSync(mainPyPath, 'utf-8');
      if (content.includes('class ManagePlugin') || pluginName === 'ManagePlugin') {
        return res.status(403).json({
          success: false,
          message: '不能删除核心插件',
          error: '此操作被禁止'
        });
      }
    }
    
    // 删除插件目录
    fs.rmSync(pluginDir, { recursive: true, force: true });
    console.log(`已删除插件目录: ${pluginDir}`);
    
    // 同时从disabled-plugins列表中移除插件(如果存在)
    try {
      const configPath = path.join(rootDir, 'main_config.toml');
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const config = TOML.parse(configContent);
        
        if (config.XYBot && config.XYBot['disabled-plugins']) {
          const disabledPlugins = config.XYBot['disabled-plugins'];
          const index = disabledPlugins.indexOf(pluginName);
          
          if (index !== -1) {
            disabledPlugins.splice(index, 1);
            console.log(`从disabled-plugins列表中移除了 ${pluginName}`);
            fs.writeFileSync(configPath, TOML.stringify(config));
          }
        }
      }
    } catch (configError) {
      console.error('更新配置文件失败:', configError);
    }
    
    // 返回成功结果
    res.json({
      success: true,
      message: `插件 ${pluginName} 已成功删除`,
      data: {
        pluginName
      }
    });
  } catch (error) {
    console.error('删除插件失败:', error);
    res.status(500).json({
      success: false,
      message: '删除插件失败',
      error: error.message
    });
  }
}; 