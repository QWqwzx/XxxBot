<template>
  <div class="config-editor">
    <div class="editor-header">
      <h1 class="page-title">系统配置编辑器</h1>
      <div class="action-buttons">
        <el-button type="primary" @click="saveConfig" :loading="isSaving">
          <el-icon><icon-document-checked /></el-icon>
          保存配置
        </el-button>
        <el-button type="default" @click="cancelEdit">
          <el-icon><icon-close /></el-icon>
          取消
        </el-button>
      </div>
    </div>

    <el-alert
      v-if="showAlert"
      :type="alertType"
      :title="alertTitle"
      :description="alertMessage"
      show-icon
      :closable="true"
      @close="closeAlert"
      class="config-alert"
    />

    <div class="editor-container">
      <el-input
        v-model="configContent"
        type="textarea"
        :autosize="{ minRows: 20, maxRows: 30 }"
        placeholder="编辑配置文件内容..."
        class="config-textarea"
        @input="validateContent"
      />
    </div>
    
    <div class="editor-footer">
      <p class="help-text">注意：修改配置文件可能会影响系统运行，请谨慎操作。配置保存后会自动创建备份文件。</p>
      <div class="validation-status" :class="{'is-valid': isConfigValid, 'is-invalid': !isConfigValid && configContent.length > 0}">
        <el-icon v-if="isConfigValid"><icon-check /></el-icon>
        <el-icon v-else-if="configContent.length > 0"><icon-warning /></el-icon>
        <span>{{ validationMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { systemApi } from '../api/system';
import * as TOML from '@iarna/toml';

export default {
  name: 'ConfigEditor',
  
  setup() {
    const router = useRouter();
    const configContent = ref('');
    const originalContent = ref('');
    const isSaving = ref(false);
    const isConfigValid = ref(true);
    const validationMessage = ref('配置格式有效');
    
    const showAlert = ref(false);
    const alertType = ref('info');
    const alertTitle = ref('');
    const alertMessage = ref('');
    
    // 加载配置文件内容
    const loadConfig = async () => {
      try {
        const response = await systemApi.getRawConfig();
        if (response.data.success) {
          configContent.value = response.data.data.content;
          originalContent.value = response.data.data.content;
          validateContent();
        } else {
          showAlertMessage('error', '加载失败', '无法加载配置文件');
        }
      } catch (error) {
        console.error('加载配置文件失败:', error);
        showAlertMessage('error', '加载失败', '无法加载配置文件：' + (error.message || '未知错误'));
      }
    };
    
    // 保存配置文件内容
    const saveConfig = async () => {
      if (!isConfigValid.value) {
        showAlertMessage('error', '无效配置', '无法保存无效的TOML格式');
        return;
      }
      
      isSaving.value = true;
      
      try {
        const response = await systemApi.saveRawConfig(configContent.value);
        if (response.data.success) {
          showAlertMessage('success', '保存成功', '配置文件已成功保存并备份');
          originalContent.value = configContent.value;
        } else {
          showAlertMessage('error', '保存失败', response.data.message || '无法保存配置文件');
        }
      } catch (error) {
        console.error('保存配置文件失败:', error);
        showAlertMessage('error', '保存失败', '无法保存配置文件：' + (error.message || '未知错误'));
      } finally {
        isSaving.value = false;
      }
    };
    
    // 验证TOML格式
    const validateContent = () => {
      if (!configContent.value.trim()) {
        isConfigValid.value = false;
        validationMessage.value = '配置内容不能为空';
        return;
      }
      
      try {
        TOML.parse(configContent.value);
        isConfigValid.value = true;
        validationMessage.value = '配置格式有效';
      } catch (error) {
        isConfigValid.value = false;
        validationMessage.value = '配置格式无效: ' + error.message;
      }
    };
    
    // 取消编辑
    const cancelEdit = () => {
      if (configContent.value !== originalContent.value) {
        if (confirm('您有未保存的更改，确定要放弃更改吗？')) {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    };
    
    // 显示提示消息
    const showAlertMessage = (type, title, message) => {
      alertType.value = type;
      alertTitle.value = title;
      alertMessage.value = message;
      showAlert.value = true;
      
      // 自动关闭成功消息
      if (type === 'success') {
        setTimeout(() => {
          showAlert.value = false;
        }, 3000);
      }
    };
    
    // 关闭提示
    const closeAlert = () => {
      showAlert.value = false;
    };
    
    onMounted(() => {
      loadConfig();
    });
    
    return {
      configContent,
      isSaving,
      isConfigValid,
      validationMessage,
      saveConfig,
      cancelEdit,
      validateContent,
      showAlert,
      alertType,
      alertTitle,
      alertMessage,
      closeAlert
    };
  }
}
</script>

<style scoped>
.config-editor {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  animation: fade-in 0.6s ease-out;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  background: linear-gradient(90deg, var(--apple-accent), #5ac8fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.config-alert {
  margin-bottom: 20px;
}

.editor-container {
  border: 1px solid var(--apple-border);
  border-radius: var(--apple-radius);
  overflow: hidden;
  margin-bottom: 20px;
}

.config-textarea {
  font-family: 'SF Mono', SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--apple-text-secondary);
  font-size: 14px;
}

.help-text {
  margin: 0;
  max-width: 60%;
}

.validation-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.is-valid {
  color: var(--apple-success);
}

.is-invalid {
  color: var(--apple-error);
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 