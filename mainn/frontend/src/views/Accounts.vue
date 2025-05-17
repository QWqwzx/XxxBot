<template>
  <div class="accounts-page">
    <div class="header-section">
      <h1 class="page-title">微信机器人管理</h1>
      <div class="controls">
        <el-button type="primary" @click="showAddBotDialog">
          <el-icon><icon-plus /></el-icon>
          添加微信机器人
        </el-button>
        <el-button :loading="isRefreshing" @click="refreshBots">
          <el-icon><icon-refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 机器人列表 -->
    <div class="bot-list" v-if="bots.length > 0">
      <el-table :data="bots" style="width: 100%">
        <el-table-column prop="name" label="机器人名称" width="180">
          <template #default="scope">
            <div class="bot-info">
              <div class="bot-avatar">
                <el-avatar :size="40" :src="scope.row.avatar">
                  <el-icon><icon-user /></el-icon>
                </el-avatar>
              </div>
              <div class="bot-name">
                <div>{{ scope.row.name }}</div>
                <div class="bot-status" :class="{ 'active': scope.row.active }">
                  {{ scope.row.active ? '活跃' : '停用' }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="getBotTypeTag(scope.row.type)">{{ getBotTypeName(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button size="small" type="primary" plain @click="editBot(scope.row)">
              设置
            </el-button>
            <el-button 
              size="small" 
              :type="scope.row.active ? 'warning' : 'success'" 
              plain
              @click="toggleBotStatus(scope.row)"
            >
              {{ scope.row.active ? '停用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" plain @click="confirmDeleteBot(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <el-icon><icon-chat-dot-round /></el-icon>
      </div>
      <h3>暂无微信机器人</h3>
      <p>扫描微信二维码登录以添加机器人</p>
      <el-button type="primary" @click="showAddBotDialog">添加微信机器人</el-button>
    </div>
    
    <!-- 添加机器人对话框 -->
    <el-dialog
      v-model="addBotDialogVisible"
      title="添加微信机器人"
      width="550px"
    >
      <el-form :model="newBot" label-width="100px" :rules="botRules" ref="botFormRef">
        <el-form-item label="机器人名称" prop="name">
          <el-input v-model="newBot.name" placeholder="请输入机器人名称" />
        </el-form-item>
        <el-input type="hidden" v-model="newBot.type" />
        
        <!-- 微信登录相关内容 -->
        <div class="wechat-login-container">
          <div class="qrcode-box">
            <div class="qrcode-header">
              <h4>请使用微信扫码登录</h4>
              <p class="text-muted">扫描二维码，登录并授权机器人</p>
            </div>
            
            <div class="qrcode-img-container">
              <div v-if="qrcodeUrl && !isQrcodeLoading" class="qrcode-display">
                <!-- 显示实际二维码 -->
                <!-- <img :src="qrcodeUrl" alt="微信登录二维码" class="qrcode-img"> -->
                
                <!-- 测试环境：使用示例二维码图片 -->
                <el-image 
                  src="https://res.wx.qq.com/connect/zh_CN/htmledition/images/bg_qrcode@2x.png"
                  alt="微信登录二维码" 
                  class="qrcode-img"
                  fit="contain"
                />
                <div class="qrcode-overlay" v-if="wechatLoginStatus === 'scanned'">
                  <div class="overlay-content">
                    <el-icon><icon-check /></el-icon>
                    <div>已扫描</div>
                    <div class="small-text">请在微信上确认</div>
                  </div>
                </div>
              </div>
              <div class="qrcode-loading" v-if="isQrcodeLoading">
                <el-icon class="qrcode-loading-spinner"><icon-loading /></el-icon>
                <div>正在获取二维码...</div>
              </div>
            </div>
            
            <div class="qrcode-timer" v-if="qrcodeUrl && !isQrcodeLoading">
              <span>二维码有效期: <span>{{ qrcodeCountdown }}</span>秒</span>
              <div class="timer-progress">
                <div class="timer-bar" :style="{width: `${(qrcodeCountdown / 300) * 100}%`, background: getTimerBarColor()}"></div>
              </div>
            </div>
            
            <div class="qrcode-status">
              {{ qrcodeStatusText }}
            </div>
            
            <div class="qrcode-actions">
              <el-button type="primary" @click="refreshQrcode" :loading="isQrcodeLoading">
                <el-icon><icon-refresh /></el-icon>
                刷新二维码
              </el-button>
              <el-button @click="toggleManualInput">
                <el-icon><icon-edit /></el-icon>
                {{ showManualInput ? '隐藏输入' : '手动输入' }}
              </el-button>
            </div>
            
            <!-- 手动输入二维码 -->
            <div v-if="showManualInput" class="manual-input-container">
              <div class="manual-input-box">
                <div class="manual-input-header">
                  <h5>手动输入二维码URL</h5>
                </div>
                              <p class="manual-input-desc">如果二维码无法自动获取，可以从日志中复制URL或输入测试URL</p>
              <el-input 
                v-model="manualQrcodeUrl" 
                placeholder="输入微信二维码链接..." 
                class="manual-input"
              >
                <template #append>
                  <el-button @click="setManualQrcode">
                    <el-icon><icon-check /></el-icon>
                    确认
                  </el-button>
                </template>
              </el-input>
              <div class="manual-input-hint">
                测试可输入任意URL（实际使用时需微信二维码URL）
              </div>
              </div>
            </div>
          </div>
          
          <div class="qrcode-instructions">
            <h5><el-icon><icon-info-filled /></el-icon> 登录说明</h5>
            <ol>
              <li>打开手机微信，扫描上方二维码</li>
              <li>在手机上确认登录授权</li>
              <li>登录成功后，机器人将自动创建</li>
              <li>请勿将此二维码分享给他人，以免账号被盗用</li>
            </ol>
            <el-alert
              title="为保障账号安全，建议定期退出并重新登录，避免授权时间过长"
              type="warning"
              :closable="false"
              show-icon
            />
          </div>
        </div>
        <span class="dialog-footer">
          <el-button @click="addBotDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addBot" :loading="isSubmitting" :disabled="wechatLoginStatus !== 'success'">
            {{ wechatLoginStatus === 'success' ? '添加机器人' : '请先扫码登录' }}
          </el-button>
        </span>
      </el-form>
    </el-dialog>
    
    <!-- 机器人设置对话框 -->
    <el-dialog
      v-model="botSettingsVisible"
      :title="`${selectedBot?.name || ''} 设置`"
      width="700px"
    >
      <el-tabs v-if="selectedBot">
        <el-tab-pane label="基本设置">
          <el-form label-width="120px">
            <el-form-item label="机器人名称">
              <el-input v-model="selectedBot.name" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="selectedBot.description" type="textarea" rows="2" />
            </el-form-item>
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleEditAvatarChange"
              >
                <img v-if="selectedBot.avatar" :src="selectedBot.avatar" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><icon-plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="欢迎语">
              <el-input v-model="selectedBot.welcomeMessage" type="textarea" rows="2" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="高级设置">
          <el-form label-width="140px">
            <el-form-item label="AI模型">
              <el-select v-model="selectedBot.aiModel" style="width: 100%">
                <el-option label="GPT-3.5" value="gpt3.5" />
                <el-option label="GPT-4" value="gpt4" />
                <el-option label="Claude" value="claude" />
                <el-option label="自定义" value="custom" />
              </el-select>
            </el-form-item>
            <el-form-item label="知识库">
              <el-select v-model="selectedBot.knowledgeBase" style="width: 100%">
                <el-option label="默认知识库" value="default" />
                <el-option label="产品知识库" value="product" />
                <el-option label="客服知识库" value="customer_service" />
                <el-option label="无" value="none" />
              </el-select>
            </el-form-item>
            <el-form-item label="自动回复">
              <el-switch v-model="selectedBot.autoReply" />
            </el-form-item>
            <el-form-item label="上下文记忆">
              <el-input-number v-model="selectedBot.contextMemory" :min="1" :max="20" />
              <span class="input-hint">轮对话</span>
            </el-form-item>
            <el-form-item label="API密钥" v-if="selectedBot.aiModel === 'custom'">
              <el-input v-model="selectedBot.apiKey" show-password />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="触发规则">
          <div class="rules-list">
            <div class="rule-item" v-for="(rule, i) in selectedBot.rules || []" :key="i">
              <div class="rule-header">
                <div class="rule-name">{{ rule.name }}</div>
                <div class="rule-actions">
                  <el-button size="small" type="text">编辑</el-button>
                  <el-button size="small" type="text" class="delete-btn">删除</el-button>
                </div>
              </div>
              <div class="rule-content">
                <div class="rule-condition">
                  <span class="rule-label">触发条件:</span> {{ rule.condition }}
                </div>
                <div class="rule-action">
                  <span class="rule-label">执行动作:</span> {{ rule.action }}
                </div>
              </div>
            </div>
            <el-button class="add-rule-btn">添加规则</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="botSettingsVisible = false">取消</el-button>
          <el-button type="primary" @click="saveBotSettings">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AccountsView',
  setup() {
    // 机器人列表
    const bots = ref([])
    const isRefreshing = ref(false)
    const isSubmitting = ref(false)
    
    // 表单引用
    const botFormRef = ref(null)
    
    // 对话框状态
    const addBotDialogVisible = ref(false)
    const botSettingsVisible = ref(false)
    
    // 头像上传
    const avatarUrl = ref('')
    
    // 选中的机器人
    const selectedBot = ref(null)
    
    // 微信二维码相关
    const qrcodeUrl = ref('')
    const qrcodeUUID = ref('') // 存储二维码UUID，用于状态检查
    const isQrcodeLoading = ref(false)
    const qrcodeCountdown = ref(300)
    const qrcodeStatusText = ref('等待扫描二维码')
    const countdownTimer = ref(null)
    const statusCheckInterval = ref(null)
    const qrCheckTimer = ref(null) // 二维码状态检查定时器
    const showManualInput = ref(false)
    const manualQrcodeUrl = ref('')
    const wechatLoginStatus = ref('waiting') // waiting, scanned, success, error
    
    // 表单校验规则
    const botRules = {
      name: [
        { required: true, message: '请输入机器人名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择机器人类型', trigger: 'change' }
      ]
    }
    
    // 新机器人表单
    const newBot = reactive({
      name: '',
      type: '',
      description: '',
      active: true,
      avatar: '',
      welcomeMessage: '您好，我是您的智能助手，有什么可以帮您的？'
    })
    
    // 方法
    const refreshBots = async () => {
      isRefreshing.value = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 生成模拟数据（实际应用中应替换为API调用）
        bots.value = generateMockBots()
        
        ElMessage.success('机器人列表已更新')
      } catch (error) {
        console.error('刷新机器人列表失败:', error)
        ElMessage.error('刷新机器人列表失败')
      } finally {
        isRefreshing.value = false
      }
    }
    
    const showAddBotDialog = () => {
      // 重置表单
      Object.keys(newBot).forEach(key => {
        if (key !== 'active' && key !== 'welcomeMessage') {
          newBot[key] = ''
        }
      })
      newBot.active = true
      newBot.welcomeMessage = '您好，我是您的智能助手，有什么可以帮您的？'
      avatarUrl.value = ''
      
      // 默认设置为微信机器人
      newBot.type = 'wechat'
      newBot.name = '微信机器人'
      
      // 重置微信相关状态
      clearQrcodeState()
      
      // 显示对话框
      addBotDialogVisible.value = true
      
      // 立即加载微信二维码
      refreshQrcode()
      
      // 开始状态检查
      startStatusChecking()
    }
    
    // 微信二维码相关方法
    const handleBotTypeChange = (type) => {
      if (type === 'wechat') {
        // 加载二维码
        refreshQrcode()
        // 开始检查登录状态
        startStatusChecking()
      } else {
        // 清除二维码相关状态和定时器
        clearQrcodeState()
      }
    }
    
    const refreshQrcode = async () => {
      isQrcodeLoading.value = true
      qrcodeStatusText.value = '正在获取二维码...'
      
      try {
        // 参考swagger文档中的/GetQR接口
        const response = await fetch('/GetQR', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            deviceName: 'Web-Client',
            deviceID: `web_${Date.now()}`,
            osmodel: 'web'
          })
        })
        
        const data = await response.json()
        
        if (data && data.Status === 0 && data.QrUrl) {
          // 二维码URL从接口获取
          qrcodeUrl.value = data.QrUrl
          
          // UUID保存，用于后续检查二维码状态
          qrcodeUUID.value = data.Uuid || ''
          
          // 设置倒计时（默认5分钟或从接口获取）
          qrcodeCountdown.value = data.ExpiredTime || 300
          
          // 开始倒计时
          startCountdown()
          
          // 更新状态
          qrcodeStatusText.value = '等待扫描二维码'
          wechatLoginStatus.value = 'waiting'
          
          console.log('获取二维码成功')
          
          // 开始检查二维码状态
          startCheckQRStatus()
        } else {
          throw new Error(data.Message || '获取二维码失败')
        }
      } catch (error) {
        console.error('获取二维码失败:', error)
        qrcodeStatusText.value = '获取二维码失败，请重试'
        wechatLoginStatus.value = 'error'
      } finally {
        isQrcodeLoading.value = false
      }
    }
    
    const startCountdown = () => {
      // 清除现有倒计时
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
      }
      
      // 开始新的倒计时
      countdownTimer.value = setInterval(() => {
        qrcodeCountdown.value--
        
        if (qrcodeCountdown.value <= 0) {
          clearInterval(countdownTimer.value)
          qrcodeStatusText.value = '二维码已过期，请刷新'
          wechatLoginStatus.value = 'error'
        }
      }, 1000)
    }
    
    const getTimerBarColor = () => {
      if (qrcodeCountdown.value < 60) {
        return 'linear-gradient(90deg, #F56C6C, #E74C3C)'
      } else if (qrcodeCountdown.value < 120) {
        return 'linear-gradient(90deg, #E6A23C, #F39C12)'
      } else {
        return 'linear-gradient(90deg, #409EFF, #67C23A)'
      }
    }
    
    const toggleManualInput = () => {
      showManualInput.value = !showManualInput.value
    }
    
    const setManualQrcode = () => {
      const url = manualQrcodeUrl.value.trim()
      
      // 检查URL格式（简化了验证条件，只要不为空即可）
      if (url) {
        qrcodeUrl.value = url
        qrcodeCountdown.value = 300 // 默认5分钟
        startCountdown()
        qrcodeStatusText.value = '等待扫描二维码'
        wechatLoginStatus.value = 'waiting'
        showManualInput.value = false
        ElMessage.success('二维码已设置，请扫码登录')
      } else {
        ElMessage.warning('请输入有效的微信登录二维码URL')
      }
    }
    
    const startStatusChecking = () => {
      // 清除现有定时器
      if (statusCheckInterval.value) {
        clearInterval(statusCheckInterval.value)
      }
      
      // 立即检查一次
      checkLoginStatus()
      
      // 设置定时检查
      statusCheckInterval.value = setInterval(checkLoginStatus, 2000)
    }
    
    // 开始检查二维码状态定时器
    const startCheckQRStatus = () => {
      // 清除已有的定时器
      if (qrCheckTimer.value) {
        clearInterval(qrCheckTimer.value)
      }
      
      // 立即检查一次
      checkQRStatus()
      
      // 设置定时器，每3秒检查一次
      qrCheckTimer.value = setInterval(checkQRStatus, 3000)
    }
    
    // 检查二维码状态
    const checkQRStatus = async () => {
      if (!qrcodeUUID.value) return
      
      try {
        // 参考swagger文档中的/CheckQR接口
        const response = await fetch('/CheckQR', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uuid: qrcodeUUID.value
          })
        })
        
        const data = await response.json()
        
        if (data) {
          // 根据接口返回更新状态
          // 通常状态码: 0=等待扫描，1=已扫描等待确认，2=已确认，3=已过期，4=已取消
          switch(data.Status) {
            case 0: // 等待扫描
              wechatLoginStatus.value = 'waiting'
              qrcodeStatusText.value = '等待扫描二维码'
              break
              
            case 1: // 已扫描，等待确认
              wechatLoginStatus.value = 'scanned'
              qrcodeStatusText.value = '已扫描，请在手机上确认登录'
              console.log('状态更新: 已扫描，等待确认')
              break
              
            case 2: // 已确认
              wechatLoginStatus.value = 'success'
              qrcodeStatusText.value = '登录成功，正在创建机器人...'
              console.log('状态更新: 登录成功')
              
              // 清除二维码检查定时器
              clearInterval(qrCheckTimer.value)
              
              // 停止倒计时
              clearInterval(countdownTimer.value)
              
              // 确认登录（参考swagger中的ExtDeviceLoginConfirmOk接口）
              confirmLogin(data.Url)
              break
              
            case 3: // 已过期
              wechatLoginStatus.value = 'error'
              qrcodeStatusText.value = '二维码已过期，请刷新'
              clearInterval(qrCheckTimer.value)
              break
              
            case 4: // 已取消
              wechatLoginStatus.value = 'error'
              qrcodeStatusText.value = '登录已取消，请重试'
              clearInterval(qrCheckTimer.value)
              break
          }
        }
      } catch (error) {
        console.error('检查二维码状态失败:', error)
      }
    }
    
    // 确认登录
    const confirmLogin = async (url) => {
      if (!url) return
      
      try {
        // 参考swagger文档中的/ExtDeviceLoginConfirmOk接口
        const response = await fetch('/ExtDeviceLoginConfirmOk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url
          })
        })
        
        const data = await response.json()
        
        if (data && data.Status === 0) {
          // 登录成功，使用返回的用户信息创建机器人
          const userInfo = {
            wxid: data.Wxid || '',
            nickname: data.NickName || '微信用户',
            account: data.Wxid || data.UserName || '',
            avatar: data.HeadImgUrl || ''
          }
          
          // 创建微信机器人
          createWechatBot(userInfo)
        } else {
          wechatLoginStatus.value = 'error'
          qrcodeStatusText.value = '登录失败，请重试'
        }
      } catch (error) {
        console.error('确认登录失败:', error)
        wechatLoginStatus.value = 'error'
        qrcodeStatusText.value = '登录失败，请重试'
      }
    }
    
    // 检查登录状态（已登录后的状态检查）
    const checkLoginStatus = async () => {
      if (!newBot.wxid) return
      
      try {
        // 调用接口检查登录状态
        const response = await fetch('/Newinit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wxid: newBot.wxid
          })
        })
        
        const data = await response.json()
        
        if (data && data.Status === 0) {
          // 登录状态正常
          console.log('登录状态检查：在线')
        } else {
          // 登录状态异常
          console.error('登录状态异常:', data.Message)
        }
      } catch (error) {
        console.error('检查登录状态失败:', error)
      }
    }
    
    const createWechatBot = async (statusData) => {
      // 使用返回的微信数据创建机器人
      newBot.name = statusData.nickname || '微信机器人'
      newBot.description = `由微信账号 ${statusData.nickname || statusData.account || '未知'} 授权的机器人`
      newBot.avatar = statusData.avatar || ''
      
      // 调用添加机器人方法
      addBot()
    }
    
    const clearQrcodeState = () => {
      // 清除二维码URL
      qrcodeUrl.value = ''
      
      // 清除倒计时
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
        countdownTimer.value = null
      }
      
      // 清除状态检查
      if (statusCheckInterval.value) {
        clearInterval(statusCheckInterval.value)
        statusCheckInterval.value = null
      }
      
      // 重置状态
      qrcodeCountdown.value = 300
      qrcodeStatusText.value = '等待扫描二维码'
      isQrcodeLoading.value = false
      showManualInput.value = false
      manualQrcodeUrl.value = ''
      wechatLoginStatus.value = 'waiting'
    }
    
    const addBot = () => {
      if (!botFormRef.value) return
      
      botFormRef.value.validate(async (valid) => {
        if (!valid) return
        
        isSubmitting.value = true
        
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 创建机器人对象
          const bot = {
            id: Date.now().toString(), // 模拟ID
            name: newBot.name,
            type: newBot.type,
            description: newBot.description || '',
            active: newBot.active,
            avatar: avatarUrl.value,
            createTime: new Date().getTime(),
            welcomeMessage: newBot.welcomeMessage,
            aiModel: 'gpt3.5',
            knowledgeBase: 'default',
            autoReply: true,
            contextMemory: 5,
            apiKey: '',
            rules: [
              { 
                name: '欢迎新用户', 
                condition: '用户首次对话', 
                action: '发送欢迎语' 
              },
              { 
                name: '转人工服务', 
                condition: '关键词包含"人工、客服"', 
                action: '转接人工客服' 
              }
            ]
          }
          
          // 添加到机器人列表
          bots.value.unshift(bot)
          
          // 关闭对话框
          addBotDialogVisible.value = false
          
          ElMessage.success(`机器人 ${bot.name} 已添加`)
        } catch (error) {
          console.error('添加机器人失败:', error)
          ElMessage.error('添加机器人失败')
        } finally {
          isSubmitting.value = false
        }
      })
    }
    
    const editBot = (bot) => {
      selectedBot.value = JSON.parse(JSON.stringify(bot)) // 深拷贝
      botSettingsVisible.value = true
    }
    
    const saveBotSettings = async () => {
      if (!selectedBot.value) return
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 更新机器人信息
        const index = bots.value.findIndex(b => b.id === selectedBot.value.id)
        if (index !== -1) {
          bots.value[index] = { ...selectedBot.value }
        }
        
        // 关闭对话框
        botSettingsVisible.value = false
        
        ElMessage.success('设置已保存')
      } catch (error) {
        console.error('保存设置失败:', error)
        ElMessage.error('保存设置失败')
      }
    }
    
    const toggleBotStatus = async (bot) => {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 600))
        
        // 更新状态
        const index = bots.value.findIndex(b => b.id === bot.id)
        if (index !== -1) {
          bots.value[index].active = !bots.value[index].active
          
          const status = bots.value[index].active ? '启用' : '停用'
          ElMessage.success(`${bot.name} 已${status}`)
        }
      } catch (error) {
        console.error('更新机器人状态失败:', error)
        ElMessage.error('更新机器人状态失败')
      }
    }
    
    const confirmDeleteBot = (bot) => {
      ElMessageBox.confirm(
        `确定要删除机器人 ${bot.name} 吗？删除后将无法恢复。`, 
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 从列表中移除
        bots.value = bots.value.filter(b => b.id !== bot.id)
        ElMessage.success('机器人已删除')
      }).catch(() => {
        // 用户取消操作
      })
    }
    
    const handleAvatarChange = (file) => {
      // 处理头像上传
      // 实际应用中应上传到服务器并获取URL
      // 这里仅做模拟展示
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = () => {
        avatarUrl.value = reader.result
      }
    }
    
    const handleEditAvatarChange = (file) => {
      // 处理编辑状态下的头像上传
      if (!selectedBot.value) return
      
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = () => {
        selectedBot.value.avatar = reader.result
      }
    }
    
    const getBotTypeName = (type) => {
      const typeNames = {
        'customer_service': '客服机器人',
        'sales': '销售机器人',
        'qa': '问答机器人',
        'custom': '自定义机器人'
      }
      return typeNames[type] || type
    }
    
    const getBotTypeTag = (type) => {
      const typeTags = {
        'customer_service': 'success',
        'sales': 'warning',
        'qa': 'info',
        'custom': 'primary'
      }
      return typeTags[type] || ''
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
    const generateMockBots = () => {
      return [
        {
          id: '1',
          name: '智能客服小助手',
          type: 'customer_service',
          description: '处理基础的客服问题和产品咨询',
          active: true,
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          createTime: new Date('2023-05-15').getTime(),
          welcomeMessage: '您好，我是智能客服小助手，请问有什么可以帮您？',
          aiModel: 'gpt3.5',
          knowledgeBase: 'customer_service',
          autoReply: true,
          contextMemory: 5,
          apiKey: '',
          rules: [
            { name: '欢迎新用户', condition: '用户首次对话', action: '发送欢迎语' },
            { name: '转人工服务', condition: '关键词包含"人工、客服"', action: '转接人工客服' }
          ]
        },
        {
          id: '2',
          name: '销售顾问',
          type: 'sales',
          description: '引导用户了解产品，解答疑问，促进销售转化',
          active: true,
          avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          createTime: new Date('2023-07-20').getTime(),
          welcomeMessage: '您好，我是销售顾问，很高兴为您介绍我们的产品！',
          aiModel: 'gpt4',
          knowledgeBase: 'product',
          autoReply: true,
          contextMemory: 10,
          apiKey: '',
          rules: [
            { name: '产品介绍', condition: '关键词包含"功能、价格、优势"', action: '发送产品详情' },
            { name: '优惠活动', condition: '关键词包含"优惠、折扣、促销"', action: '发送当前活动' }
          ]
        },
        {
          id: '3',
          name: '技术支持机器人',
          type: 'qa',
          description: '解答技术问题，提供故障排查和解决方案',
          active: false,
          avatar: '',
          createTime: new Date('2023-08-10').getTime(),
          welcomeMessage: '您好，我是技术支持机器人，请描述您遇到的问题，我会尽力帮助您解决。',
          aiModel: 'claude',
          knowledgeBase: 'default',
          autoReply: true,
          contextMemory: 8,
          apiKey: '',
          rules: [
            { name: '故障处理', condition: '关键词包含"错误、失败、故障"', action: '引导用户排查' },
            { name: '上报问题', condition: '机器人无法解决', action: '创建工单上报' }
          ]
        }
      ]
    }
    
    // 初始化
    onMounted(() => {
      // 加载模拟数据
      refreshBots()
    })
    
    return {
      bots,
      isRefreshing,
      isSubmitting,
      botFormRef,
      addBotDialogVisible,
      botSettingsVisible,
      avatarUrl,
      selectedBot,
      botRules,
      newBot,
      
      // 微信二维码相关
      qrcodeUrl,
      isQrcodeLoading,
      qrcodeCountdown,
      qrcodeStatusText,
      showManualInput,
      manualQrcodeUrl,
      wechatLoginStatus,
      
      refreshBots,
      showAddBotDialog,
      addBot,
      editBot,
      saveBotSettings,
      toggleBotStatus,
      confirmDeleteBot,
      handleAvatarChange,
      handleEditAvatarChange,
      getBotTypeName,
      getBotTypeTag,
      formatTime,
      
      // 微信二维码相关方法
      handleBotTypeChange,
      refreshQrcode,
      getTimerBarColor,
      toggleManualInput,
      setManualQrcode
    }
  }
}
</script> 

<style scoped>
.accounts-page {
  padding: 20px;
  width: 100%;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* 微信二维码相关样式 */
.wechat-login-container {
  margin-bottom: 24px;
}

.qrcode-box {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.qrcode-box::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-success));
}

.qrcode-header {
  text-align: center;
  margin-bottom: 20px;
}

.qrcode-header h4 {
  font-size: 18px;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.qrcode-header p {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.qrcode-img-container {
  width: 220px;
  height: 220px;
  margin: 0 auto;
  padding: 10px;
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  position: relative;
}

.qrcode-display {
  position: relative;
  width: 100%;
  height: 100%;
}

.qrcode-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qrcode-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.overlay-content {
  text-align: center;
  color: var(--el-color-success);
}

.overlay-content .el-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.small-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.qrcode-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
}

.qrcode-loading-spinner {
  font-size: 36px;
  color: var(--el-color-primary);
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.qrcode-timer {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.timer-progress {
  height: 6px;
  margin-top: 8px;
  border-radius: 3px;
  overflow: hidden;
  background-color: var(--el-fill-color-lighter);
}

.timer-bar {
  height: 100%;
  width: 100%;
  border-radius: 3px;
  transition: width 1s linear;
}

.qrcode-status {
  text-align: center;
  margin-top: 16px;
  padding: 8px;
  border-radius: 8px;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
}

.qrcode-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.manual-input-container {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed var(--el-border-color);
}

.manual-input-box {
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 16px;
}

.manual-input-header h5 {
  font-size: 16px;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.manual-input-desc {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  margin-bottom: 12px;
}

.manual-input {
  margin-bottom: 8px;
}

.manual-input-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.qrcode-instructions {
  background-color: var(--el-fill-color-light);
  border-radius: 12px;
  padding: 20px;
}

.qrcode-instructions h5 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
}

.qrcode-instructions h5 .el-icon {
  color: var(--el-color-primary);
}

.qrcode-instructions ol {
  padding-left: 20px;
  margin-bottom: 16px;
}

.qrcode-instructions li {
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.page-title {
  font-size: 24px;
  margin: 0;
  color: var(--el-text-color-primary);
}

.controls {
  display: flex;
  gap: 12px;
}

.bot-list {
  margin-bottom: 30px;
}

.bot-info {
  display: flex;
  align-items: center;
}

.bot-avatar {
  margin-right: 12px;
}

.bot-name {
  font-weight: 600;
}

.bot-status {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.bot-status::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--el-color-danger);
  margin-right: 5px;
}

.bot-status.active::before {
  background-color: var(--el-color-success);
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

/* 头像上传 */
.avatar-uploader {
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: var(--el-text-color-secondary);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px dashed var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-hint {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

/* 规则列表 */
.rules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 12px;
}

.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.rule-name {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.rule-actions {
  display: flex;
  gap: 8px;
}

.delete-btn {
  color: var(--el-color-danger);
}

.rule-content {
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.rule-condition, .rule-action {
  margin-bottom: 4px;
}

.rule-label {
  color: var(--el-text-color-secondary);
}

.add-rule-btn {
  margin-top: 8px;
  width: 100%;
  border: 1px dashed var(--el-border-color);
  color: var(--el-text-color-secondary);
}
</style>