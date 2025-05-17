// Import polyfills first
import './polyfills';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 导入Vue Router
import ElementPlus from 'element-plus' // 导入Element Plus
import 'element-plus/dist/index.css' // 导入Element Plus样式
// import store from './store'   // 如果您设置了 Vuex，请取消注释

// 导入Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);

app.use(router); // 使用Vue Router
app.use(ElementPlus); // 使用Element Plus
// app.use(store);   // 如果您设置了 Vuex，请取消注释

// 注册所有图标为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app'); 