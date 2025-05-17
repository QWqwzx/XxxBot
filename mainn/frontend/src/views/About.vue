<template>
  <div class="about-page">
    <el-card class="about-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="logo-and-badges">
            <div class="logo-container">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8.75 16.54C7.33 15.66 6.5 13.87 6.5 12C6.5 10.14 7.33 8.34 8.75 7.46V16.54ZM12 17.5C11.17 17.5 10.4 16.9 10.4 16V8C10.4 7.1 11.17 6.5 12 6.5C12.83 6.5 13.6 7.1 13.6 8V16C13.6 16.9 12.83 17.5 12 17.5ZM15.25 16.54V7.46C16.67 8.34 17.5 10.14 17.5 12C17.5 13.87 16.67 15.66 15.25 16.54Z" 
                  fill="url(#paint0_linear)" />
                <defs>
                  <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#0066CC" />
                    <stop offset="1" stop-color="#5AC8FA" />
                  </linearGradient>
                </defs>
              </svg>
              <h1 class="logo-text">XxxBot</h1>
            </div>
            <div class="badges">
              <div class="badge version">
                <el-icon><Odometer /></el-icon>
                <span>v3.5.9</span>
              </div>
              <div class="badge license">
                <el-icon><Lock /></el-icon>
                <span>AGPL-3.0</span>
              </div>
              <div class="badge python">
                <el-icon><Tickets /></el-icon>
                <span>Python 3.11+</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <div class="about-content">
        <div class="section description">
          <h2 class="section-title">
            <el-icon class="section-icon"><InfoFilled /></el-icon>
            什么是 XxxBot？
          </h2>
          <p>XxxBot 是一个基于微信的多功能智能机器人系统，通过整合多种 API 和功能，提供丰富的交互体验。系统包含完整的管理后台界面，支持插件扩展，具备联系人管理、文件管理、系统状态监控等功能，并与人工智能服务集成，提供智能对话能力。</p>
          <p>XxxBot 支持多种微信接口和协议，包括 PAD 协议和 Mac 协议，可根据需要灵活切换，满足不同场景下的部署需求。</p>
        </div>
        
        <div class="divider">
          <div class="divider-icon"><el-icon><Magic /></el-icon></div>
        </div>
        
        <div class="section features">
          <h2 class="section-title">
            <el-icon class="section-icon"><Star /></el-icon>
            主要特性
          </h2>
          
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon"><el-icon><Connection /></el-icon></div>
              <h3>多协议支持</h3>
              <p>支持 849（iPad）、855（安卓PAD）、ipad 和 Mac 协议，可灵活切换</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon"><el-icon><RefreshRight /></el-icon></div>
              <h3>双框架模式</h3>
              <p>支持同时运行原始框架和 DOW 框架，拓展功能更丰富</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon"><el-icon><Grid /></el-icon></div>
              <h3>插件系统</h3>
              <p>完善的插件系统，可自由扩展各种功能</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon"><el-icon><ChatDotRound /></el-icon></div>
              <h3>智能对话</h3>
              <p>集成多种 AI 模型，支持图文结合、语音交互</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon"><el-icon><PictureRounded /></el-icon></div>
              <h3>图片识别</h3>
              <p>支持引用图片识别功能，让 AI 分析图片内容</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon"><el-icon><TrendCharts /></el-icon></div>
              <h3>管理后台</h3>
              <p>提供完整的 Web 管理界面，实现远程管理</p>
            </div>
          </div>
        </div>
        
        <div class="divider">
          <div class="divider-icon"><el-icon><Magic /></el-icon></div>
        </div>
        
        <div class="section system">
          <h2 class="section-title">
            <el-icon class="section-icon"><SetUp /></el-icon>
            系统架构
          </h2>
          <p>XxxBot 采用模块化的设计架构，主要由以下部分组成：</p>
          
          <div class="architecture">
            <div class="arch-item">
              <div class="arch-icon"><el-icon><Cpu /></el-icon></div>
              <div class="arch-details">
                <h3>主控模块</h3>
                <p>负责整体控制和消息转发</p>
              </div>
            </div>
            
            <div class="arch-item">
              <div class="arch-icon"><el-icon><Link /></el-icon></div>
              <div class="arch-details">
                <h3>协议层</h3>
                <p>负责与微信通信，支持多种协议版本</p>
              </div>
            </div>
            
            <div class="arch-item">
              <div class="arch-icon"><el-icon><DataLine /></el-icon></div>
              <div class="arch-details">
                <h3>框架层</h3>
                <p>原始框架和 DOW 框架，提供基础功能</p>
              </div>
            </div>
            
            <div class="arch-item">
              <div class="arch-icon"><el-icon><Box /></el-icon></div>
              <div class="arch-details">
                <h3>插件系统</h3>
                <p>用于扩展系统功能</p>
              </div>
            </div>
            
            <div class="arch-item">
              <div class="arch-icon"><el-icon><Monitor /></el-icon></div>
              <div class="arch-details">
                <h3>管理后台</h3>
                <p>提供 Web 界面管理系统</p>
              </div>
            </div>
            
            <div class="arch-item">
              <div class="arch-icon"><el-icon><Files /></el-icon></div>
              <div class="arch-details">
                <h3>数据存储</h3>
                <p>使用 SQLite 和 Redis 存储数据</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="divider">
          <div class="divider-icon"><el-icon><Magic /></el-icon></div>
        </div>
        
        <div class="section deployment">
          <h2 class="section-title">
            <el-icon class="section-icon"><Download /></el-icon>
            部署方式
          </h2>
          
          <div class="deployment-options">
            <div class="deploy-card">
              <div class="deploy-icon">
                <el-icon><Terminal /></el-icon>
              </div>
              <div class="deploy-content">
                <h3>直接安装</h3>
                <p>适合有技术基础的用户，可完全控制安装过程和配置</p>
                <div class="tech-tags">
                  <span class="tech-tag"><el-icon><Platform /></el-icon> Python</span>
                  <span class="tech-tag"><el-icon><Memo /></el-icon> Redis</span>
                  <span class="tech-tag"><el-icon><VideoPlay /></el-icon> FFmpeg</span>
                </div>
              </div>
            </div>
            
            <div class="deploy-card">
              <div class="deploy-icon">
                <el-icon><Ship /></el-icon>
              </div>
              <div class="deploy-content">
                <h3>Docker 部署</h3>
                <p>一键部署，快速启动，适合希望便捷使用的用户</p>
                <div class="tech-tags">
                  <span class="tech-tag"><el-icon><Box /></el-icon> Docker</span>
                  <span class="tech-tag"><el-icon><Coordinate /></el-icon> Docker Compose</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="divider">
          <div class="divider-icon"><el-icon><Magic /></el-icon></div>
        </div>
        
        <div class="section links">
          <h2 class="section-title">
            <el-icon class="section-icon"><Link /></el-icon>
            相关链接
          </h2>
          
          <div class="link-buttons">
            <el-button type="primary" size="large">
              <el-icon><Reading /></el-icon>
              <span>文档中心</span>
            </el-button>
            
            <el-button type="info" size="large" @click="openGithubRepo">
              <el-icon><Collection /></el-icon>
              <span>GitHub 仓库</span>
            </el-button>
            
            <el-button type="success" size="large">
              <el-icon><ChatDotSquare /></el-icon>
              <span>社区支持</span>
            </el-button>
            
            <el-button type="warning" size="large">
              <el-icon><Warning /></el-icon>
              <span>问题反馈</span>
            </el-button>
          </div>
        </div>
        
        <div class="divider">
          <div class="divider-icon"><el-icon><Magic /></el-icon></div>
        </div>
        
        <div class="footer">
          <div class="qr-code-section">
            <div class="qr-code">
              <el-icon class="qr-icon"><Scan /></el-icon>
              <div class="qr-placeholder">扫码加入交流群</div>
            </div>
            <p>扫描二维码加入官方交流群，获取最新功能更新和技术支持</p>
          </div>
          
          <div class="tech-showcase">
            <h3>技术栈</h3>
            <div class="tech-list">
              <span class="tech-pill"><el-icon><Location /></el-icon> Python 3.11+</span>
              <span class="tech-pill"><el-icon><DataAnalysis /></el-icon> Vue 3</span>
              <span class="tech-pill"><el-icon><ElementPlus /></el-icon> Element Plus</span>
              <span class="tech-pill"><el-icon><Coin /></el-icon> Redis</span>
              <span class="tech-pill"><el-icon><DataBoard /></el-icon> SQLite</span>
              <span class="tech-pill"><el-icon><Message /></el-icon> WeChatAPI</span>
            </div>
          </div>
          
          <div class="copyright">
            <p><strong>XxxBot</strong> © 2024 <a href="https://github.com/NanSsye">NanSsye</a>. 基于 <strong>AGPL-3.0</strong> 开源。</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import {
  Odometer, Lock, Tickets, InfoFilled, Magic, Star, Connection, 
  RefreshRight, Grid, ChatDotRound, PictureRounded, TrendCharts,
  SetUp, Cpu, Link, DataLine, Box, Monitor, Files, Download,
  Terminal, Platform, Memo, VideoPlay, Ship, Coordinate,
  Collection, Reading, ChatDotSquare, Warning, Scan,
  Location, DataAnalysis, ElementPlus, Coin, DataBoard, Message
} from '@element-plus/icons-vue'

export default {
  name: 'AboutView',
  components: {
    Odometer, Lock, Tickets, InfoFilled, Magic, Star, Connection, 
    RefreshRight, Grid, ChatDotRound, PictureRounded, TrendCharts,
    SetUp, Cpu, Link, DataLine, Box, Monitor, Files, Download,
    Terminal, Platform, Memo, VideoPlay, Ship, Coordinate,
    Collection, Reading, ChatDotSquare, Warning, Scan,
    Location, DataAnalysis, ElementPlus, Coin, DataBoard, Message
  },
  setup() {
    const elementInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };
    
    const animateOnScroll = () => {
      const sections = document.querySelectorAll('.section');
      sections.forEach(section => {
        if (elementInViewport(section) && !section.classList.contains('animated')) {
          section.classList.add('animated');
        }
      });
    };
    
    const openGithubRepo = () => {
      window.open('https://github.com/QWqwzx/XxxBot.git', '_blank');
    };
    
    onMounted(() => {
      // 初始化时添加动画类
      setTimeout(() => {
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
          setTimeout(() => {
            section.classList.add('animated');
          }, index * 150);
        });
      }, 300);
      
      // 滚动时添加动画类
      window.addEventListener('scroll', animateOnScroll);
      
      return () => {
        window.removeEventListener('scroll', animateOnScroll);
      };
    });
    
    return {
      openGithubRepo
    };
  }
}
</script>

<style scoped>
:root {
  --shadow-color: rgba(0, 0, 0, 0.05);
  --shadow-deeper: rgba(0, 0, 0, 0.1);
  --card-background: #ffffff;
  --text-secondary: #4e4e4e;
  --active-background: rgba(0, 102, 204, 0.1);
  --hover-background: #f5f7fa;
}

.about-page {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px;
  animation: fade-in 0.6s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.about-card {
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 20px;
}

.about-card:hover {
  transform: translateY(-4px);
}

.card-header {
  padding: 0;
}

.logo-and-badges {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 48px;
  height: 48px;
}

.logo-text {
  font-size: 32px;
  font-weight: 600;
  background: linear-gradient(90deg, #0066cc, #5ac8fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.badge {
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge.version {
  background-color: rgba(0, 102, 204, 0.1);
  color: #0066cc;
}

.badge.license {
  background-color: rgba(52, 199, 89, 0.1);
  color: #34c759;
}

.badge.python {
  background-color: rgba(255, 204, 0, 0.1);
  color: #ffcc00;
}

.about-content {
  padding: 16px 0;
}

.section {
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.section.animated {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 16px;
  color: #1d1d1f;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  color: #0066cc;
}

.description p {
  margin: 12px 0;
  font-size: 15px;
  line-height: 1.6;
  color: #4e4e4e;
}

.divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
  margin: 32px 0;
  position: relative;
}

.divider-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4e4e4e;
  box-shadow: 0 0 0 4px #ffffff;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.feature-card {
  background-color: #ffffff;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.feature-card::after {
  content: '';
  position: absolute;
  top: -150%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 100%);
  transform: rotate(45deg);
  transition: transform 0.5s ease;
  z-index: -1;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.feature-card:hover::after {
  transform: rotate(45deg) translate(50%, 50%);
}

.feature-icon {
  width: 40px;
  height: 40px;
  background-color: rgba(0, 102, 204, 0.1);
  color: #0066cc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.feature-icon .el-icon {
  font-size: 20px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1d1d1f;
}

.feature-card p {
  font-size: 14px;
  color: #4e4e4e;
  margin: 0;
  line-height: 1.5;
}

.architecture {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.arch-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.arch-item:hover {
  transform: translateX(4px);
  background-color: #f5f7fa;
}

.arch-icon {
  width: 36px;
  height: 36px;
  background-color: rgba(0, 102, 204, 0.1);
  color: #0066cc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.arch-icon .el-icon {
  font-size: 18px;
}

.arch-details h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: #1d1d1f;
}

.arch-details p {
  font-size: 13px;
  color: #4e4e4e;
  margin: 0;
}

.deployment-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.deploy-card {
  background-color: #ffffff;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.deploy-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.deploy-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #0066cc, #5AC8FA);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.deploy-icon .el-icon {
  font-size: 24px;
}

.deploy-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1d1d1f;
}

.deploy-content p {
  font-size: 14px;
  color: #4e4e4e;
  margin: 0 0 12px;
  line-height: 1.5;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f5f7fa;
  color: #4e4e4e;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.link-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.link-buttons .el-button {
  min-width: 160px;
}

.footer {
  text-align: center;
  padding-top: 16px;
}

.qr-code-section {
  margin-bottom: 24px;
}

.qr-code {
  width: 180px;
  height: 180px;
  background-color: #ffffff;
  border-radius: 6px;
  margin: 0 auto 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(0, 0, 0, 0.05);
}

.qr-icon {
  font-size: 40px;
  margin-bottom: 8px;
  color: #4e4e4e;
  opacity: 0.5;
}

.qr-placeholder {
  color: #4e4e4e;
  font-size: 14px;
}

.qr-code-section p {
  font-size: 14px;
  color: #4e4e4e;
  max-width: 280px;
  margin: 0 auto;
}

.tech-showcase {
  margin: 32px 0;
}

.tech-showcase h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
  color: #1d1d1f;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.tech-pill {
  padding: 6px 12px;
  border-radius: 100px;
  background-color: #f5f7fa;
  color: #4e4e4e;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.copyright {
  font-size: 13px;
  color: #4e4e4e;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.copyright a {
  color: #0066cc;
  text-decoration: none;
}

@media (max-width: 768px) {
  .feature-grid, .architecture, .deployment-options {
    grid-template-columns: 1fr;
  }
  
  .link-buttons {
    flex-direction: column;
  }
  
  .link-buttons .el-button {
    width: 100%;
  }
  
  .tech-pill {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style> 
 