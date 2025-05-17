<template>
  <div class="contacts-page">
    <div class="header-section">
      <h1 class="page-title">消息平台</h1>
      <div class="controls">
        <el-button type="primary" @click="showAddPlatformDialog">
          <el-icon><icon-plus /></el-icon>
          添加平台
        </el-button>
        <el-button :loading="isRefreshing" @click="refreshPlatforms">
          <el-icon><icon-refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 平台概览卡片 -->
    <div class="platform-overview" v-if="platforms.length > 0">
      <div v-for="(platform, index) in platforms" :key="index" class="platform-card">
        <div class="platform-icon" :class="{ 'connected': platform.connected }">
          <el-icon v-if="platform.type === 'wechat'"><icon-chat-dot-round /></el-icon>
          <el-icon v-else-if="platform.type === 'telegram'"><icon-connection /></el-icon>
          <el-icon v-else-if="platform.type === 'discord'"><icon-headset /></el-icon>
          <el-icon v-else-if="platform.type === 'slack'"><icon-chat-line-round /></el-icon>
          <el-icon v-else-if="platform.type === 'email'"><icon-message /></el-icon>
          <el-icon v-else><icon-chat-dot-square /></el-icon>
        </div>
        <div class="platform-info">
          <div class="platform-name">{{ platform.name }}</div>
          <div class="platform-status" :class="{ 'connected': platform.connected }">
            {{ platform.connected ? '已连接' : '未连接' }}
          </div>
          <div class="platform-account">{{ platform.account }}</div>
        </div>
        <div class="platform-actions">
          <el-dropdown trigger="click" @command="(cmd) => handlePlatformCommand(cmd, platform)">
            <el-button type="text" class="more-btn">
              <el-icon><icon-more /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <el-dropdown-item command="messages">消息记录</el-dropdown-item>
                <el-dropdown-item command="connect" v-if="!platform.connected">连接</el-dropdown-item>
                <el-dropdown-item command="disconnect" v-else>断开连接</el-dropdown-item>
                <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <el-icon><icon-chat-line-square /></el-icon>
      </div>
      <h3>暂无消息平台</h3>
      <p>添加消息平台以接收和发送消息</p>
      <el-button type="primary" @click="showAddPlatformDialog">添加平台</el-button>
    </div>
    
    <!-- 统计数据 -->
    <div class="stats-section" v-if="platforms.length > 0">
      <div class="stats-title">
        <h2>消息统计</h2>
      </div>
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalMessages }}</div>
          <div class="stat-label">总消息数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalContacts }}</div>
          <div class="stat-label">联系人</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.todayMessages }}</div>
          <div class="stat-label">今日消息</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.connectedPlatforms }}/{{ platforms.length }}</div>
          <div class="stat-label">已连接平台</div>
        </div>
      </div>
    </div>
    
    <!-- 最近消息 -->
    <div class="recent-messages" v-if="recentMessages.length > 0">
      <div class="section-header">
        <h2>最近消息</h2>
        <el-button type="text" @click="viewAllMessages">查看全部</el-button>
      </div>
      <el-table :data="recentMessages" style="width: 100%">
        <el-table-column prop="platform" label="平台" width="120">
          <template #default="scope">
            <div class="platform-chip" :class="scope.row.platform">
              <el-icon v-if="scope.row.platform === 'wechat'"><icon-chat-dot-round /></el-icon>
              <el-icon v-else-if="scope.row.platform === 'telegram'"><icon-connection /></el-icon>
              <el-icon v-else-if="scope.row.platform === 'discord'"><icon-headset /></el-icon>
              <el-icon v-else-if="scope.row.platform === 'slack'"><icon-chat-line-round /></el-icon>
              <el-icon v-else-if="scope.row.platform === 'email'"><icon-message /></el-icon>
              <span>{{ getPlatformName(scope.row.platform) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sender" label="发送者" width="180" />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="time" label="时间" width="180">
          <template #default="scope">
            {{ formatTime(scope.row.time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="text" size="small" @click="replyMessage(scope.row)">回复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加平台对话框 -->
    <el-dialog
      v-model="addPlatformDialogVisible"
      title="添加消息平台"
      width="500px"
    >
      <el-form :model="newPlatform" label-width="120px">
        <el-form-item label="平台类型">
          <el-select v-model="newPlatform.type" placeholder="请选择平台类型">
            <el-option label="微信" value="wechat" />
            <el-option label="Telegram" value="telegram" />
            <el-option label="Discord" value="discord" />
            <el-option label="Slack" value="slack" />
            <el-option label="电子邮件" value="email" />
          </el-select>
        </el-form-item>
        <el-form-item label="平台名称">
          <el-input v-model="newPlatform.name" placeholder="请输入平台名称" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="newPlatform.account" placeholder="请输入账号" />
        </el-form-item>
        
        <!-- 微信平台特有设置 -->
        <template v-if="newPlatform.type === 'wechat'">
          <el-form-item label="API密钥">
            <el-input v-model="newPlatform.apiKey" placeholder="请输入API密钥" show-password />
          </el-form-item>
          <el-form-item label="启用自动回复">
            <el-switch v-model="newPlatform.autoReply" />
          </el-form-item>
        </template>
        
        <!-- Telegram平台特有设置 -->
        <template v-if="newPlatform.type === 'telegram'">
          <el-form-item label="Bot Token">
            <el-input v-model="newPlatform.token" placeholder="请输入Bot Token" show-password />
          </el-form-item>
        </template>
        
        <!-- 通用设置 -->
        <el-form-item label="连接设置">
          <el-radio-group v-model="newPlatform.connectNow">
            <el-radio :label="true">立即连接</el-radio>
            <el-radio :label="false">稍后连接</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addPlatformDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addPlatform">添加</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 平台设置对话框 -->
    <el-dialog
      v-model="platformSettingsVisible"
      :title="`${selectedPlatform?.name || '平台'} 设置`"
      width="600px"
    >
      <el-tabs v-if="selectedPlatform">
        <el-tab-pane label="基本设置">
          <el-form label-width="140px">
            <el-form-item label="平台名称">
              <el-input v-model="selectedPlatform.name" />
            </el-form-item>
            <el-form-item label="账号">
              <el-input v-model="selectedPlatform.account" />
            </el-form-item>
            <el-form-item label="启用自动回复">
              <el-switch v-model="selectedPlatform.autoReply" />
            </el-form-item>
            <el-form-item label="消息通知">
              <el-switch v-model="selectedPlatform.notifications" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="高级设置">
          <el-form label-width="140px">
            <el-form-item label="API地址">
              <el-input v-model="selectedPlatform.apiUrl" />
            </el-form-item>
            <el-form-item label="API密钥">
              <el-input v-model="selectedPlatform.apiKey" show-password />
            </el-form-item>
            <el-form-item label="轮询间隔">
              <el-input-number v-model="selectedPlatform.pollingInterval" :min="10" :max="300" />
              <span class="input-hint">秒</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="消息模板">
          <div class="template-list">
            <div class="template-item" v-for="(template, i) in selectedPlatform?.templates || []" :key="i">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-content">{{ template.content }}</div>
              <div class="template-actions">
                <el-button size="small" type="text">编辑</el-button>
                <el-button size="small" type="text" class="delete-btn">删除</el-button>
              </div>
            </div>
            <el-button class="add-template-btn" type="dashed">添加模板</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="platformSettingsVisible = false">取消</el-button>
          <el-button type="primary" @click="savePlatformSettings">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 消息记录对话框 -->
    <el-dialog
      v-model="messagesDialogVisible"
      :title="`${selectedPlatform?.name || '平台'} 消息记录`"
      width="800px"
    >
      <div class="message-filter">
        <el-date-picker
          v-model="messageFilter.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 300px"
        />
        <el-input
          v-model="messageFilter.keyword"
          placeholder="搜索关键词"
          class="filter-input"
          clearable
        >
          <template #prefix>
            <el-icon><icon-search /></el-icon>
          </template>
        </el-input>
        <el-button @click="searchMessages">
          <el-icon><icon-search /></el-icon>
          搜索
        </el-button>
      </div>
      
      <el-table :data="platformMessages" style="width: 100%">
        <el-table-column prop="sender" label="发送者" width="150" />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="time" label="时间" width="180">
          <template #default="scope">
            {{ formatTime(scope.row.time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="text" size="small" @click="replyMessage(scope.row)">回复</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="message-pagination">
        <el-pagination
          v-model:current-page="messageFilter.page"
          v-model:page-size="messageFilter.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="messageTotal"
          @size-change="fetchMessages"
          @current-change="fetchMessages"
        />
      </div>
    </el-dialog>
    
    <!-- 回复消息对话框 -->
    <el-dialog
      v-model="replyDialogVisible"
      title="回复消息"
      width="550px"
    >
      <div class="reply-to-info" v-if="selectedMessage">
        <div class="reply-header">回复给:</div>
        <div class="reply-sender">{{ selectedMessage.sender }}</div>
        <div class="original-message">
          <div class="message-label">原始消息:</div>
          <div class="message-content">{{ selectedMessage.content }}</div>
        </div>
      </div>
      
      <el-form :model="replyForm" label-width="80px">
        <el-form-item label="回复内容">
          <el-input
            v-model="replyForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入回复内容"
          />
        </el-form-item>
        <el-form-item label="模板">
          <el-select v-model="replyForm.template" placeholder="选择回复模板" style="width: 100%">
            <el-option label="标准回复" value="standard" />
            <el-option label="感谢" value="thanks" />
            <el-option label="帮助" value="help" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="replyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="sendReply">发送</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'ContactsView',
  setup() {
    // 平台数据
    const platforms = ref([])
    const isRefreshing = ref(false)
    
    // 统计数据
    const stats = reactive({
      totalMessages: 0,
      totalContacts: 0,
      todayMessages: 0,
      connectedPlatforms: 0
    })
    
    // 最近消息
    const recentMessages = ref([])
    
    // 对话框状态
    const addPlatformDialogVisible = ref(false)
    const platformSettingsVisible = ref(false)
    const messagesDialogVisible = ref(false)
    const replyDialogVisible = ref(false)
    
    // 新平台表单
    const newPlatform = reactive({
      type: '',
      name: '',
      account: '',
      apiKey: '',
      token: '',
      autoReply: true,
      connectNow: true
    })
    
    // 选中的平台和消息
    const selectedPlatform = ref(null)
    const selectedMessage = ref(null)
    
    // 消息筛选
    const messageFilter = reactive({
      dateRange: null,
      keyword: '',
      page: 1,
      pageSize: 10
    })
    
    // 平台消息
    const platformMessages = ref([])
    const messageTotal = ref(0)
    
    // 回复表单
    const replyForm = reactive({
      content: '',
      template: ''
    })
    
    // 方法
    const refreshPlatforms = async () => {
      isRefreshing.value = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 更新连接状态
        platforms.value.forEach(platform => {
          platform.connected = Math.random() > 0.3 // 随机模拟连接状态
        })
        
        // 更新统计数据
        updateStats()
        
        ElMessage.success('平台状态已更新')
      } catch (error) {
        console.error('刷新平台失败:', error)
        ElMessage.error('刷新平台失败')
      } finally {
        isRefreshing.value = false
      }
    }
    
    const showAddPlatformDialog = () => {
      // 重置表单
      Object.keys(newPlatform).forEach(key => {
        if (key !== 'autoReply' && key !== 'connectNow') {
          newPlatform[key] = ''
        }
      })
      newPlatform.autoReply = true
      newPlatform.connectNow = true
      
      addPlatformDialogVisible.value = true
    }
    
    const addPlatform = () => {
      // 表单验证
      if (!newPlatform.type) {
        ElMessage.warning('请选择平台类型')
        return
      }
      if (!newPlatform.name) {
        ElMessage.warning('请输入平台名称')
        return
      }
      if (!newPlatform.account) {
        ElMessage.warning('请输入账号')
        return
      }
      
      // 根据平台类型验证
      if (newPlatform.type === 'wechat' && !newPlatform.apiKey) {
        ElMessage.warning('请输入微信API密钥')
        return
      }
      if (newPlatform.type === 'telegram' && !newPlatform.token) {
        ElMessage.warning('请输入Telegram Bot Token')
        return
      }
      
      // 创建平台对象
      const platform = {
        id: Date.now().toString(), // 模拟ID
        type: newPlatform.type,
        name: newPlatform.name,
        account: newPlatform.account,
        connected: newPlatform.connectNow,
        autoReply: newPlatform.autoReply,
        notifications: true,
        apiKey: newPlatform.apiKey || '',
        token: newPlatform.token || '',
        apiUrl: '',
        pollingInterval: 60,
        templates: [
          { name: '标准回复', content: '感谢您的消息，我们会尽快回复您。' },
          { name: '感谢', content: '感谢您的反馈！' }
        ]
      }
      
      // 添加到平台列表
      platforms.value.push(platform)
      
      // 更新统计数据
      updateStats()
      
      // 关闭对话框
      addPlatformDialogVisible.value = false
      
      ElMessage.success(`${platform.name} 平台已添加`)
    }
    
    const handlePlatformCommand = (command, platform) => {
      selectedPlatform.value = platform
      
      switch (command) {
        case 'settings':
          platformSettingsVisible.value = true
          break
        case 'connect':
          connectPlatform(platform)
          break
        case 'disconnect':
          disconnectPlatform(platform)
          break
        case 'messages':
          messagesDialogVisible.value = true
          fetchMessages()
          break
        case 'delete':
          confirmDeletePlatform(platform)
          break
      }
    }
    
    const connectPlatform = async (platform) => {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 更新状态
        const index = platforms.value.findIndex(p => p.id === platform.id)
        if (index !== -1) {
          platforms.value[index].connected = true
          updateStats()
        }
        
        ElMessage.success(`${platform.name} 已连接`)
      } catch (error) {
        console.error('连接平台失败:', error)
        ElMessage.error('连接平台失败')
      }
    }
    
    const disconnectPlatform = async (platform) => {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 更新状态
        const index = platforms.value.findIndex(p => p.id === platform.id)
        if (index !== -1) {
          platforms.value[index].connected = false
          updateStats()
        }
        
        ElMessage.success(`${platform.name} 已断开连接`)
      } catch (error) {
        console.error('断开平台连接失败:', error)
        ElMessage.error('断开平台连接失败')
      }
    }
    
    const confirmDeletePlatform = (platform) => {
      ElMessageBox.confirm(
        `确定要删除 ${platform.name} 平台吗？`, 
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 从列表中移除
        platforms.value = platforms.value.filter(p => p.id !== platform.id)
        updateStats()
        ElMessage.success('平台已删除')
      }).catch(() => {
        // 用户取消操作
      })
    }
    
    const savePlatformSettings = async () => {
      if (!selectedPlatform.value) return
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 更新平台信息
        const index = platforms.value.findIndex(p => p.id === selectedPlatform.value.id)
        if (index !== -1) {
          platforms.value[index] = { ...selectedPlatform.value }
        }
        
        // 关闭对话框
        platformSettingsVisible.value = false
        
        ElMessage.success('设置已保存')
      } catch (error) {
        console.error('保存设置失败:', error)
        ElMessage.error('保存设置失败')
      }
    }
    
    const fetchMessages = async () => {
      if (!selectedPlatform.value) return
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 生成模拟消息数据
        platformMessages.value = generateMockMessages(20)
        messageTotal.value = 128
      } catch (error) {
        console.error('获取消息失败:', error)
        ElMessage.error('获取消息失败')
      }
    }
    
    const searchMessages = () => {
      // 重置分页
      messageFilter.page = 1
      fetchMessages()
    }
    
    const viewAllMessages = () => {
      selectedPlatform.value = platforms.value[0]
      messagesDialogVisible.value = true
      fetchMessages()
    }
    
    const replyMessage = (message) => {
      selectedMessage.value = message
      replyForm.content = ''
      replyForm.template = ''
      replyDialogVisible.value = true
    }
    
    const sendReply = async () => {
      if (!replyForm.content) {
        ElMessage.warning('请输入回复内容')
        return
      }
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 关闭对话框
        replyDialogVisible.value = false
        
        ElMessage.success('回复已发送')
      } catch (error) {
        console.error('发送回复失败:', error)
        ElMessage.error('发送回复失败')
      }
    }
    
    const updateStats = () => {
      stats.connectedPlatforms = platforms.value.filter(p => p.connected).length
    }
    
    const getPlatformName = (type) => {
      const platformNames = {
        'wechat': '微信',
        'telegram': 'Telegram',
        'discord': 'Discord',
        'slack': 'Slack',
        'email': '邮件'
      }
      return platformNames[type] || type
    }
    
    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // 生成模拟数据
    const generateMockPlatforms = () => {
      return [
        {
          id: '1',
          type: 'wechat',
          name: '客服微信',
          account: 'wxid_abc123',
          connected: true,
          autoReply: true,
          notifications: true,
          apiKey: 'mock-api-key',
          apiUrl: 'https://api.weixin.qq.com/cgi-bin/',
          pollingInterval: 60,
          templates: [
            { name: '标准回复', content: '感谢您的消息，我们会尽快回复您。' },
            { name: '感谢', content: '感谢您的反馈！' }
          ]
        },
        {
          id: '2',
          type: 'telegram',
          name: 'Telegram Bot',
          account: 'mybot',
          connected: true,
          autoReply: true,
          notifications: true,
          token: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
          apiUrl: 'https://api.telegram.org/bot',
          pollingInterval: 30,
          templates: [
            { name: '标准回复', content: 'Thank you for your message. We will get back to you soon.' },
            { name: '帮助', content: 'Type /help to see available commands.' }
          ]
        },
        {
          id: '3',
          type: 'email',
          name: '客服邮箱',
          account: 'support@example.com',
          connected: false,
          autoReply: true,
          notifications: true,
          apiKey: '',
          apiUrl: '',
          pollingInterval: 300,
          templates: [
            { name: '自动回复', content: '我们已收到您的邮件，将在1-2个工作日内回复您。' }
          ]
        }
      ]
    }
    
    const generateMockMessages = (count) => {
      const messages = []
      const now = new Date()
      const senders = [
        '张三', '李四', '王五', 'Tom', 'Jerry', 'User123',
        '客户A', '客户B', '潜在客户', '老客户'
      ]
      const contents = [
        '你好，我对你们的产品很感兴趣',
        '请问你们的产品有什么优势？',
        '我想咨询一下价格',
        '请问有优惠活动吗？',
        '我遇到了一个问题，能帮我解决吗？',
        '谢谢你的回复',
        '我想了解更多信息',
        '请问支持哪些支付方式？',
        '我想退款，怎么操作？',
        '产品使用过程中出现了BUG'
      ]
      
      for (let i = 0; i < count; i++) {
        const time = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        messages.push({
          id: `msg-${i}`,
          platform: selectedPlatform.value?.type || 'wechat',
          sender: senders[Math.floor(Math.random() * senders.length)],
          content: contents[Math.floor(Math.random() * contents.length)],
          time: time.getTime()
        })
      }
      
      return messages.sort((a, b) => b.time - a.time)
    }
    
    // 初始化
    onMounted(() => {
      // 加载模拟数据
      platforms.value = generateMockPlatforms()
      
      // 更新统计数据
      updateStats()
      stats.totalMessages = 1286
      stats.totalContacts = 357
      stats.todayMessages = 42
      
      // 加载最近消息
      recentMessages.value = generateMockMessages(10)
    })
    
    return {
      platforms,
      isRefreshing,
      stats,
      recentMessages,
      addPlatformDialogVisible,
      platformSettingsVisible,
      messagesDialogVisible,
      replyDialogVisible,
      newPlatform,
      selectedPlatform,
      selectedMessage,
      messageFilter,
      platformMessages,
      messageTotal,
      replyForm,
      
      refreshPlatforms,
      showAddPlatformDialog,
      addPlatform,
      handlePlatformCommand,
      savePlatformSettings,
      fetchMessages,
      searchMessages,
      viewAllMessages,
      replyMessage,
      sendReply,
      getPlatformName,
      formatTime
    }
  }
}
</script>

<style scoped>
.contacts-page {
  padding: 20px;
  width: 100%;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  margin: 0;
  color: var(--apple-text-primary);
}

.controls {
  display: flex;
  gap: 12px;
}

/* 平台卡片样式 */
.platform-overview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.platform-card {
  background-color: var(--el-fill-color-blank);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  align-items: center;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.platform-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.platform-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: var(--el-color-primary-light-9);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: var(--el-color-primary);
}

.platform-icon.connected {
  background-color: var(--el-color-success-light-8);
  color: var(--el-color-success);
}

.platform-info {
  flex: 1;
}

.platform-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--el-text-color-primary);
}

.platform-status {
  font-size: 13px;
  margin-bottom: 4px;
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
}

.platform-status::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--el-color-danger);
  margin-right: 6px;
}

.platform-status.connected::before {
  background-color: var(--el-color-success);
}

.platform-account {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.platform-actions {
  position: absolute;
  top: 12px;
  right: 12px;
}

.more-btn {
  color: var(--el-text-color-secondary);
}

/* 空状态 */
.empty-state {
  background-color: var(--el-fill-color-blank);
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
  margin-bottom: 30px;
}

.empty-icon {
  font-size: 48px;
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
}

.empty-state h3 {
  margin-top: 0;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.empty-state p {
  color: var(--el-text-color-secondary);
  margin-bottom: 20px;
}

/* 统计数据卡片 */
.stats-section {
  margin-bottom: 30px;
}

.stats-title {
  margin-bottom: 16px;
}

.stats-title h2 {
  font-size: 18px;
  margin: 0;
  color: var(--el-text-color-primary);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  background-color: var(--el-fill-color-blank);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

/* 最近消息 */
.recent-messages {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 18px;
  margin: 0;
  color: var(--el-text-color-primary);
}

.platform-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 16px;
  font-size: 12px;
  background-color: var(--el-fill-color-light);
}

.platform-chip.wechat {
  background-color: rgba(9, 187, 7, 0.1);
  color: #09bb07;
}

.platform-chip.telegram {
  background-color: rgba(0, 136, 204, 0.1);
  color: #0088cc;
}

.platform-chip.discord {
  background-color: rgba(114, 137, 218, 0.1);
  color: #7289da;
}

.platform-chip.slack {
  background-color: rgba(74, 21, 75, 0.1);
  color: #4a154b;
}

.platform-chip.email {
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--el-color-primary);
}

/* 对话框样式 */
.message-filter {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.filter-input {
  width: 240px;
}

.message-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.reply-to-info {
  margin-bottom: 20px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 12px;
}

.reply-header {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.reply-sender {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.original-message {
  border-left: 3px solid var(--el-border-color);
  padding-left: 12px;
}

.message-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.message-content {
  color: var(--el-text-color-primary);
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.template-item {
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 12px;
  position: relative;
}

.template-name {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.template-content {
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.template-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.delete-btn {
  color: var(--el-color-danger);
}

.add-template-btn {
  width: 100%;
  border: 1px dashed var(--el-border-color);
  color: var(--el-text-color-secondary);
}

.input-hint {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
</style> 