<template>
  <div class="under-development">
    <el-card class="message-card" shadow="hover">
      <div class="development-icon">
        <el-icon class="icon"><icon-setting /></el-icon>
      </div>
      <h2>{{ title }}</h2>
      <p>此页面正在开发中，敬请期待...</p>
      <el-button type="primary" @click="goBack">返回控制台</el-button>
    </el-card>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'UnderDevelopmentView',
  props: {
    title: {
      type: String,
      default: '开发中'
    }
  },
  setup() {
    const router = useRouter()
    
    const goBack = () => {
      router.push('/dashboard')
    }
    
    return {
      goBack
    }
  }
}
</script>

<style scoped>
.under-development {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
}

.message-card {
  max-width: 400px;
  width: 100%;
  text-align: center;
  padding: 20px;
  border-radius: var(--apple-radius);
  transition: transform 0.3s ease;
}

.message-card:hover {
  transform: translateY(-4px);
}

.development-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.icon {
  font-size: 64px;
  color: var(--apple-accent);
  animation: spin 10s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

h2 {
  font-size: 24px;
  margin-bottom: 16px;
  color: var(--apple-text-primary);
}

p {
  color: var(--apple-text-secondary);
  margin-bottom: 24px;
}
</style> 