<template>
  <div class="notification-page">
    <div class="header-section">
      <h1 class="page-title">通知管理</h1>
      <div class="controls">
        <el-button type="primary" @click="showAddTokenDialog">
          <el-icon><icon-plus /></el-icon>
          添加消息Token
        </el-button>
        <el-button :loading="isRefreshing" @click="refreshTokens">
          <el-icon><icon-refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- Token列表 -->
    <div class="token-list" v-if="tokens.length > 0">
      <el-table :data="tokens" style="width: 100%">
        <el-table-column prop="tokenName" label="Token名称" width="180" />
        <el-table-column prop="token" label="Token值" width="220">
          <template #default="scope">
            <div class="token-value">
              <el-tooltip content="点击复制" placement="top" :hide-after="1000">
                <span class="copy-text" @click="copyToken(scope.row.token)">{{ scope.row.token }}</span>
              </el-tooltip>
              <el-button size="small" circle @click="copyToken(scope.row.token)">
                <el-icon><icon-document-copy /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" show-overflow-tooltip />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" type="primary" plain @click="editToken(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" plain @click="confirmDeleteToken(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalTokens"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <el-icon><icon-message /></el-icon>
      </div>
      <h3>暂无消息Token</h3>
      <p>添加Token以便接收应用消息通知</p>
      <el-button type="primary" @click="showAddTokenDialog">添加消息Token</el-button>
    </div>
    
    <!-- 添加/编辑Token对话框 -->
    <el-dialog
      v-model="tokenDialogVisible"
      :title="isEditMode ? '编辑消息Token' : '添加消息Token'"
      width="550px"
    >
      <el-form :model="tokenForm" label-width="100px" :rules="tokenRules" ref="tokenFormRef">
        <el-form-item label="Token名称" prop="tokenName">
          <el-input v-model="tokenForm.tokenName" placeholder="请输入Token名称" />
        </el-form-item>
        <el-form-item label="Token" prop="token" v-if="!isEditMode">
          <el-input v-model="tokenForm.token" placeholder="请输入Token" />
          <div class="form-item-hint"></div>
          <div class="form-item-link">
            <a href="https://www.pushplus.plus/" target="_blank">获取Token</a>
          </div>
        </el-form-item>
        <el-form-item label="Token备注" prop="remarks">
          <el-input v-model="tokenForm.remarks" type="textarea" rows="3" placeholder="请输入Token的用途说明或备注" />
        </el-form-item>

        <div class="token-tips" v-if="isEditMode">
          <el-alert
            title="Token值无法修改，如需更换请删除后重新创建"
            type="info"
            :closable="false"
            show-icon
          />
          <div class="current-token">
            <span class="token-label">当前Token:</span>
            <el-tag size="large" class="token-tag">{{ tokenForm.token }}</el-tag>
            <el-button size="small" @click="copyToken(tokenForm.token)" type="primary" plain>
              <el-icon><icon-document-copy /></el-icon> 复制
            </el-button>
          </div>
        </div>
        
        <div class="integration-guide" v-if="isEditMode">
          <h4>集成指南</h4>
          <p>使用以下方式发送消息到PushPlus：</p>
          <div class="code-block">
            <pre>
curl -X POST "https://www.pushplus.plus/send" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "{{ tokenForm.token }}",
    "title": "消息标题",
    "content": "消息内容",
    "template": "html"
  }'
            </pre>
            <el-button size="small" @click="copyCode" class="copy-code-btn">
              <el-icon><icon-document-copy /></el-icon> 复制代码
            </el-button>
          </div>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="tokenDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveToken" :loading="isSubmitting">
            {{ isEditMode ? '保存修改' : '创建Token' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 测试发送对话框 -->
    <el-dialog
      v-model="testSendDialogVisible"
      title="测试发送消息"
      width="550px"
    >
      <el-form :model="testMessageForm" label-width="100px" ref="testFormRef">
        <el-form-item label="接收Token" prop="token">
          <el-select v-model="testMessageForm.token" style="width: 100%">
            <el-option 
              v-for="token in tokens" 
              :key="token.id" 
              :label="`${token.tokenName} (${token.token})`" 
              :value="token.token" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="消息标题" prop="title">
          <el-input v-model="testMessageForm.title" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-input 
            v-model="testMessageForm.content" 
            type="textarea" 
            rows="5" 
            placeholder="请输入消息内容，支持HTML格式"
          />
        </el-form-item>
        <el-form-item label="消息模板">
          <el-select v-model="testMessageForm.template" style="width: 100%">
            <el-option label="HTML" value="html" />
            <el-option label="纯文本" value="txt" />
            <el-option label="JSON" value="json" />
            <el-option label="Markdown" value="markdown" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="testSendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="sendTestMessage" :loading="isSending">
            发送测试消息
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'NotificationView',
  setup() {
    // 消息Token列表
    const tokens = ref([])
    const isRefreshing = ref(false)
    const isSubmitting = ref(false)
    const isSending = ref(false)
    
    // 分页相关
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalTokens = ref(0)
    
    // 表单引用
    const tokenFormRef = ref(null)
    const testFormRef = ref(null)
    
    // 对话框状态
    const tokenDialogVisible = ref(false)
    const testSendDialogVisible = ref(false)
    const isEditMode = ref(false)
    
    // 选中的Token
    const selectedToken = ref(null)
    
    // 表单校验规则
    const tokenRules = {
      tokenName: [
        { required: true, message: '请输入Token名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
      ]
    }
    
    // Token表单
    const tokenForm = reactive({
      id: '',
      tokenName: '',
      token: '',
      remarks: ''
    })
    
    // 测试消息表单
    const testMessageForm = reactive({
      token: '',
      title: '测试消息',
      content: '<h3>这是一条测试消息</h3><p>如果您收到这条消息，表示PushPlus通知功能工作正常。</p>',
      template: 'html'
    })
    
    // 方法
    const refreshTokens = async () => {
      isRefreshing.value = true
      try {
        // 实际应用中调用API获取数据
        // 参考pushplus API: 获取消息token列表
        // GET https://www.pushplus.plus/api/open/tokenList?page=1&pageSize=10
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 生成模拟数据
        tokens.value = generateMockTokens()
        totalTokens.value = tokens.value.length
        
        ElMessage.success('消息Token列表已更新')
      } catch (error) {
        console.error('刷新Token列表失败:', error)
        ElMessage.error('刷新Token列表失败')
      } finally {
        isRefreshing.value = false
      }
    }
    
    const showAddTokenDialog = () => {
      // 重置表单
      Object.keys(tokenForm).forEach(key => {
        tokenForm[key] = ''
      })
      
      isEditMode.value = false
      tokenDialogVisible.value = true
    }
    
    const editToken = (token) => {
      selectedToken.value = token
      
      // 填充表单
      Object.keys(tokenForm).forEach(key => {
        if (key in token) {
          tokenForm[key] = token[key]
        }
      })
      
      isEditMode.value = true
      tokenDialogVisible.value = true
    }
    
    const saveToken = () => {
      if (!tokenFormRef.value) return
      
      tokenFormRef.value.validate(async (valid) => {
        if (!valid) return
        
        isSubmitting.value = true
        
        try {
          if (isEditMode.value) {
            // 编辑Token
            // 参考pushplus API: 修改消息token
            // POST https://www.pushplus.plus/api/open/token/edit
            
            await new Promise(resolve => setTimeout(resolve, 800))
            
            // 更新本地数据
            const index = tokens.value.findIndex(t => t.id === tokenForm.id)
            if (index !== -1) {
              tokens.value[index] = {
                ...tokens.value[index],
                tokenName: tokenForm.tokenName,
                remarks: tokenForm.remarks
              }
            }
            
            ElMessage.success('Token修改成功')
          } else {
            // 添加Token
            // 参考pushplus API: 新增消息token
            // POST https://www.pushplus.plus/api/open/token/add
            
            await new Promise(resolve => setTimeout(resolve, 800))
            
            // 模拟生成新Token
            const newToken = {
              id: Date.now().toString(),
              tokenName: tokenForm.tokenName,
              token: tokenForm.token ? tokenForm.token.trim() : generateRandomToken(),
              remarks: tokenForm.remarks,
              createTime: new Date().getTime()
            }
            
            // 添加到列表
            tokens.value.unshift(newToken)
            totalTokens.value++
            
            ElMessage.success('Token创建成功')
          }
          
          // 关闭对话框
          tokenDialogVisible.value = false
        } catch (error) {
          console.error('保存Token失败:', error)
          ElMessage.error('保存Token失败')
        } finally {
          isSubmitting.value = false
        }
      })
    }
    
    const confirmDeleteToken = (token) => {
      ElMessageBox.confirm(
        `确定要删除消息Token "${token.tokenName}" 吗？删除后将无法恢复，已发送的历史消息不受影响。`, 
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          // 参考pushplus API: 删除消息token
          // DELETE https://www.pushplus.plus/api/open/token/delete?id=1
          
          await new Promise(resolve => setTimeout(resolve, 600))
          
          // 从列表中移除
          tokens.value = tokens.value.filter(t => t.id !== token.id)
          totalTokens.value--
          
          ElMessage.success('Token已删除')
        } catch (error) {
          console.error('删除Token失败:', error)
          ElMessage.error('删除Token失败')
        }
      }).catch(() => {
        // 用户取消操作
      })
    }
    
    const copyToken = (token) => {
      navigator.clipboard.writeText(token)
        .then(() => {
          ElMessage.success('Token已复制到剪贴板')
        })
        .catch(err => {
          console.error('复制失败:', err)
          ElMessage.error('复制失败')
        })
    }
    
    const copyCode = () => {
      const code = `curl -X POST "https://www.pushplus.plus/send" \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "${tokenForm.token}",
    "title": "消息标题",
    "content": "消息内容",
    "template": "html"
  }'`
      
      navigator.clipboard.writeText(code)
        .then(() => {
          ElMessage.success('代码已复制到剪贴板')
        })
        .catch(err => {
          console.error('复制失败:', err)
          ElMessage.error('复制失败')
        })
    }
    
    const sendTestMessage = async () => {
      if (!testMessageForm.token) {
        ElMessage.warning('请选择接收Token')
        return
      }
      
      isSending.value = true
      
      try {
        // 参考pushplus API: 发送消息
        // POST https://www.pushplus.plus/send
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        ElMessage.success('测试消息已发送')
        testSendDialogVisible.value = false
      } catch (error) {
        console.error('发送测试消息失败:', error)
        ElMessage.error('发送测试消息失败')
      } finally {
        isSending.value = false
      }
    }
    
    const handleSizeChange = (size) => {
      pageSize.value = size
      refreshTokens()
    }
    
    const handleCurrentChange = (page) => {
      currentPage.value = page
      refreshTokens()
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
    
    // 生成随机Token
    const generateRandomToken = () => {
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      const length = 32
      
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
      }
      
      return result
    }
    
    // 生成模拟数据
    const generateMockTokens = () => {
      return [
        {
          id: '1',
          tokenName: '系统告警通知',
          token: 'ab1cd2ef3gh4ij5kl6mn7op8qr9st0uv',
          remarks: '用于发送系统异常、服务宕机等紧急告警通知',
          createTime: new Date('2023-12-15').getTime()
        },
        {
          id: '2',
          tokenName: '用户注册通知',
          token: 'xy1z23ab4cd5ef6gh7ij8kl9mn0opqr',
          remarks: '新用户注册成功后发送通知',
          createTime: new Date('2024-01-20').getTime()
        },
        {
          id: '3',
          tokenName: '订单状态变更',
          token: 'st1uv2wx3yz4ab5cd6ef7gh8ij9klmn',
          remarks: '订单支付、发货、签收等状态变更时的通知',
          createTime: new Date('2024-02-05').getTime()
        }
      ]
    }
    
    // 初始化
    onMounted(() => {
      // 加载模拟数据
      refreshTokens()
    })
    
    return {
      tokens,
      isRefreshing,
      isSubmitting,
      isSending,
      currentPage,
      pageSize,
      totalTokens,
      tokenFormRef,
      testFormRef,
      tokenDialogVisible,
      testSendDialogVisible,
      isEditMode,
      selectedToken,
      tokenRules,
      tokenForm,
      testMessageForm,
      
      refreshTokens,
      showAddTokenDialog,
      editToken,
      saveToken,
      confirmDeleteToken,
      copyToken,
      copyCode,
      sendTestMessage,
      handleSizeChange,
      handleCurrentChange,
      formatTime
    }
  }
}
</script>

<style scoped>
.notification-page {
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
  color: var(--el-text-color-primary);
}

.controls {
  display: flex;
  gap: 12px;
}

.token-list {
  margin-bottom: 30px;
}

.token-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-text {
  font-family: monospace;
  background-color: var(--el-fill-color-light);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
  display: inline-block;
}

.copy-text:hover {
  background-color: var(--el-fill-color);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
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

.token-tips {
  margin: 20px 0;
}

.current-token {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.token-label {
  font-weight: 500;
  color: var(--el-text-color-regular);
}

.token-tag {
  font-family: monospace;
  flex-grow: 1;
  font-weight: normal;
}

.integration-guide {
  margin-top: 24px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 16px;
}

.integration-guide h4 {
  margin-top: 0;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.integration-guide p {
  color: var(--el-text-color-regular);
  margin-bottom: 12px;
}

.code-block {
  background-color: #f0f2f5;
  border-radius: 6px;
  padding: 12px;
  position: relative;
  margin-bottom: 8px;
}

.code-block pre {
  margin: 0;
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap;
  color: var(--el-text-color-primary);
}

.copy-code-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}

.form-item-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
  line-height: 1.4;
}

.form-item-link {
  margin-top: 4px;
  text-align: right;
}

.form-item-link a {
  color: var(--el-text-color-secondary);
  text-decoration: none;
}
</style>