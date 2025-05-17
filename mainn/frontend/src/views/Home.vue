<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="hero-title">欢迎使用管理面板</h1>
      <p class="hero-description">
        一个基于 Node.js 和 Vue.js 构建的高效、简洁、现代化管理系统
      </p>
    </div>
    
    <div class="features-section">
      <div class="section-title">功能模块</div>
      
      <div class="feature-cards">
        <!-- 系统管理卡片 -->
        <div class="feature-card" @click="navigateTo('/system')">
          <div class="card-icon system-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div class="card-content">
            <h3 class="card-title">系统管理</h3>
            <p class="card-description">查看系统状态、信息、日志及版本管理</p>
          </div>
          <div class="card-arrow">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
        
        <!-- 用户管理卡片 (示例) -->
        <div class="feature-card disabled">
          <div class="card-icon user-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="card-content">
            <h3 class="card-title">用户管理 <span class="coming-soon">即将推出</span></h3>
            <p class="card-description">管理用户账户、权限及访问控制</p>
          </div>
          <div class="card-arrow">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
        
        <!-- 数据分析卡片 (示例) -->
        <div class="feature-card disabled">
          <div class="card-icon analytics-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <div class="card-content">
            <h3 class="card-title">数据分析 <span class="coming-soon">即将推出</span></h3>
            <p class="card-description">查看数据统计、图表及性能分析</p>
          </div>
          <div class="card-arrow">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <div class="status-section">
      <div class="status-card">
        <div class="status-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div class="status-content">
          <div class="status-title">系统状态</div>
          <div class="status-value">运行中</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    navigateTo(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  animation: fade-in 0.6s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-section {
  text-align: center;
  margin-bottom: 48px;
  padding-top: 20px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px;
  background: linear-gradient(135deg, var(--apple-accent) 0%, #5ac8fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 18px;
  color: var(--apple-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.features-section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--apple-text-primary);
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.feature-card {
  background-color: white;
  border-radius: var(--apple-radius);
  box-shadow: 0 4px 16px var(--apple-shadow);
  padding: 24px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, var(--apple-accent), #5ac8fa);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.feature-card.disabled:hover {
  transform: none;
  box-shadow: 0 4px 16px var(--apple-shadow);
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.system-icon {
  background-color: rgba(0, 122, 255, 0.1);
  color: #007aff;
}

.user-icon {
  background-color: rgba(88, 86, 214, 0.1);
  color: #5856d6;
}

.analytics-icon {
  background-color: rgba(255, 149, 0, 0.1);
  color: #ff9500;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--apple-text-primary);
}

.coming-soon {
  font-size: 12px;
  background-color: #f5f5f7;
  padding: 2px 8px;
  border-radius: 10px;
  color: var(--apple-text-secondary);
  font-weight: 500;
  margin-left: 8px;
  vertical-align: middle;
}

.card-description {
  font-size: 14px;
  color: var(--apple-text-secondary);
  margin: 0;
  line-height: 1.4;
}

.card-arrow {
  color: var(--apple-text-secondary);
  transition: transform 0.2s ease;
}

.feature-card:hover .card-arrow {
  transform: translateX(4px);
  color: var(--apple-accent);
}

.status-section {
  margin-bottom: 48px;
}

.status-card {
  background-color: white;
  border-radius: var(--apple-radius);
  box-shadow: 0 4px 16px var(--apple-shadow);
  padding: 16px 24px;
  display: flex;
  align-items: center;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e3f9eb;
  color: #34c759;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.status-content {
  flex: 1;
}

.status-title {
  font-size: 14px;
  color: var(--apple-text-secondary);
  margin-bottom: 4px;
}

.status-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--apple-text-primary);
}
</style> 