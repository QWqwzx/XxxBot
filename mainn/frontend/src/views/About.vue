<template>
  <div class="about-page">
    <el-card class="about-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h2 class="title">关于 XxxBot</h2>
        </div>
      </template>
      
      <div class="about-content">
        <div class="logo-section">
          <div class="app-logo">
            <h1>XxxBot</h1>
          </div>
          <div class="version">版本: v3.5.9</div>
        </div>
        
        <div class="description">
          <p>XxxBot 是一个高效、灵活的消息管理平台，支持多种消息渠道的集成和管理。</p>
          <p>本管理面板基于 Node.js 和 Vue.js 构建，为您提供直观、现代化的用户界面来管理您的 XxxBot 实例。</p>
        </div>
        
        <div class="features">
          <h3>主要功能</h3>
          <ul>
            <li>多平台消息集成与管理</li>
            <li>插件系统支持功能扩展</li>
            <li>文件管理与远程操作</li>
            <li>用户与联系人管理</li>
            <li>系统监控与日志分析</li>
            <li>通知与提醒系统</li>
          </ul>
        </div>
        
        <div class="links">
          <h3>相关链接</h3>
          <div class="link-buttons">
            <el-button type="primary" plain>
              <el-icon><icon-document /></el-icon>
              文档
            </el-button>
            <el-button type="info" plain>
              <el-icon><icon-position /></el-icon>
              GitHub
            </el-button>
            <el-button type="success" plain>
              <el-icon><icon-chat-dot-round /></el-icon>
              社区支持
            </el-button>
          </div>
        </div>
        
        <div class="license">
          <h3>许可证</h3>
          <p>AGPL-3.0</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  animation: fade-in 0.6s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.about-card {
  border-radius: var(--apple-radius);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: var(--apple-text-primary);
}

.about-content {
  padding: 16px 0;
}

.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.app-logo h1 {
  font-size: 36px;
  font-weight: 600;
  background: linear-gradient(90deg, #0066cc, #5ac8fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px;
}

.version {
  font-size: 14px;
  color: var(--apple-text-secondary);
}

.description {
  margin-bottom: 24px;
  text-align: center;
}

.description p {
  margin: 12px 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--apple-text-secondary);
}

.features, .links, .license {
  margin-bottom: 24px;
}

.features h3, .links h3, .license h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--apple-text-primary);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--apple-border-light);
}

.features ul {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.features li {
  padding: 8px 0;
  font-size: 14px;
  color: var(--apple-text-secondary);
  position: relative;
  padding-left: 24px;
}

.features li:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-color: var(--apple-accent);
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E");
  mask-size: cover;
  -webkit-mask-size: cover;
}

.link-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.license p {
  font-size: 14px;
  color: var(--apple-text-secondary);
}

@media (max-width: 600px) {
  .features ul {
    grid-template-columns: 1fr;
  }
  
  .link-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .link-buttons .el-button {
    width: 100%;
  }
}
</style> 
 