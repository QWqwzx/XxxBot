<template>
  <div class="files-page">
    <div class="files-header">
      <h2>文件管理</h2>
      <div class="actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索文件..."
          prefix-icon="el-icon-search"
          clearable
          class="search-input"
        />
        <el-button type="primary" @click="openUploadDialog">
          <el-icon><i-ep-upload /></el-icon>
          上传文件
        </el-button>
      </div>
    </div>

    <el-card class="files-card">
      <!-- 文件列表 -->
      <el-table
        v-loading="loading"
        :data="filteredFiles"
        stripe
        style="width: 100%"
        @row-dblclick="previewFile"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="文件名" sortable>
          <template #default="scope">
            <div class="file-name">
              <el-icon class="file-icon"><i-ep-document /></el-icon>
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" sortable>
          <template #default="scope">
            {{ formatFileSize(scope.row.size) }}
          </template>
        </el-table-column>
        <el-table-column prop="modifiedTime" label="修改日期" sortable>
          <template #default="scope">
            {{ formatDate(scope.row.modifiedTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button-group>
              <el-button size="small" type="primary" @click="previewFile(scope.row)">
                <el-icon><i-ep-view /></el-icon>
              </el-button>
              <el-button size="small" type="success" @click="downloadFile(scope.row)">
                <el-icon><i-ep-download /></el-icon>
              </el-button>
              <el-button size="small" type="danger" @click="confirmDelete(scope.row)">
                <el-icon><i-ep-delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty v-if="filteredFiles.length === 0 && !loading" description="没有找到文件" />
    </el-card>

    <!-- 文件上传对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传文件"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-upload
        class="upload-area"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :limit="1"
        :file-list="fileList"
      >
        <el-icon class="el-icon--upload"><i-ep-upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请选择要上传的文件
          </div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpload" :disabled="!selectedFile">
            上传
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 文件预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      :title="currentFile.name"
      width="80%"
      :close-on-click-modal="false"
    >
      <div v-loading="previewLoading" class="preview-content">
        <pre v-if="fileContent">{{ fileContent }}</pre>
        <el-empty v-else description="无法预览此文件" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="downloadFile(currentFile)">
            <el-icon><i-ep-download /></el-icon>
            下载
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import filesApi from '@/api/files'

export default {
  name: 'FilesView',
  setup() {
    // 状态数据
    const files = ref([])
    const loading = ref(true)
    const searchQuery = ref('')
    const uploadDialogVisible = ref(false)
    const previewDialogVisible = ref(false)
    const previewLoading = ref(false)
    const fileContent = ref('')
    const currentFile = ref({})
    const fileList = ref([])
    const selectedFile = ref(null)

    // 获取文件列表
    const fetchFiles = async () => {
      loading.value = true
      try {
        files.value = await filesApi.getFilesList()
      } catch (error) {
        ElMessage.error('获取文件列表失败')
        console.error(error)
      } finally {
        loading.value = false
      }
    }

    // 过滤后的文件列表
    const filteredFiles = computed(() => {
      if (!searchQuery.value) return files.value
      const query = searchQuery.value.toLowerCase()
      return files.value.filter(file => 
        file.name.toLowerCase().includes(query)
      )
    })

    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString()
    }

    // 打开上传对话框
    const openUploadDialog = () => {
      uploadDialogVisible.value = true
      fileList.value = []
      selectedFile.value = null
    }

    // 处理文件变更
    const handleFileChange = (file) => {
      selectedFile.value = file.raw
      fileList.value = [file]
    }

    // 上传文件
    const handleUpload = async () => {
      if (!selectedFile.value) {
        ElMessage.warning('请选择文件')
        return
      }

      try {
        await filesApi.uploadFile(selectedFile.value)
        ElMessage.success('文件上传成功')
        uploadDialogVisible.value = false
        fetchFiles() // 刷新文件列表
      } catch (error) {
        ElMessage.error('文件上传失败')
        console.error(error)
      }
    }

    // 预览文件
    const previewFile = async (file) => {
      currentFile.value = file
      previewDialogVisible.value = true
      previewLoading.value = true
      fileContent.value = ''

      try {
        const result = await filesApi.getFileContent(file.name)
        fileContent.value = result.content
      } catch (error) {
        ElMessage.error('无法预览文件')
        console.error(error)
      } finally {
        previewLoading.value = false
      }
    }

    // 下载文件
    const downloadFile = (file) => {
      window.open(`${process.env.VUE_APP_API_URL || 'http://localhost:3000'}/api/files/content/${file.name}?download=true`, '_blank')
    }

    // 确认删除
    const confirmDelete = (file) => {
      ElMessageBox.confirm(
        `确定要删除文件 "${file.name}" 吗？此操作不可逆。`,
        '确认删除',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deleteFile(file)
      }).catch(() => {
        // 用户取消操作
      })
    }

    // 删除文件
    const deleteFile = async (file) => {
      try {
        await filesApi.deleteFile(file.name)
        ElMessage.success('文件已删除')
        fetchFiles() // 刷新文件列表
      } catch (error) {
        ElMessage.error('删除文件失败')
        console.error(error)
      }
    }

    // 生命周期钩子
    onMounted(() => {
      fetchFiles()
    })

    return {
      files,
      loading,
      searchQuery,
      filteredFiles,
      uploadDialogVisible,
      previewDialogVisible,
      previewLoading,
      fileContent,
      currentFile,
      fileList,
      selectedFile,
      fetchFiles,
      formatFileSize,
      formatDate,
      openUploadDialog,
      handleFileChange,
      handleUpload,
      previewFile,
      downloadFile,
      confirmDelete,
      deleteFile
    }
  }
}
</script>

<style scoped>
.files-page {
  padding: 20px;
}

.files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  color: var(--apple-text-primary);
}

.actions {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 240px;
}

.files-card {
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.file-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  color: var(--el-color-primary);
}

.preview-content {
  min-height: 200px;
  max-height: 60vh;
  overflow: auto;
  background: var(--el-fill-color-lighter);
  border-radius: 4px;
  padding: 16px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: monospace;
}

.upload-area {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
}

@media (max-width: 768px) {
  .files-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .actions {
    width: 100%;
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
  }
}
</style> 