<template>
  <div class="plugins-page">
    <!-- 页面标题和搜索 -->
    <div class="header-section">
      <div class="title-tabs">
        <h1 class="page-title">
          <span 
            :class="{ 'active-tab': !showMarketplace }" 
            @click="showMarketplace = false"
          >
            插件管理
          </span>
          <span class="tab-divider">|</span>
          <span 
            :class="{ 'active-tab': showMarketplace }" 
            @click="showMarketplace = true"
          >
            <el-icon class="tab-icon"><icon-shopping-cart /></el-icon>
            插件市场
          </span>
        </h1>
        <div v-if="showMarketplace" class="marketplace-info">
          <el-tooltip content="插件市场从GitHub仓库获取插件" placement="top">
            <el-icon class="help-icon"><icon-info-filled /></el-icon>
          </el-tooltip>
        </div>
      </div>
      
      <div class="controls" v-if="!showMarketplace">
        <div class="search-container">
          <el-input
            v-model="searchQuery"
            placeholder="搜索插件..."
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><icon-search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <!-- 苹果风格分段控制器 -->
        <div class="segment-control">
          <button 
            class="segment-button" 
            :class="{ 'active': filterStatus === 'all' }"
            @click="filterStatus = 'all'"
          >
            全部
          </button>
          <button 
            class="segment-button" 
            :class="{ 'active': filterStatus === 'enabled' }"
            @click="filterStatus = 'enabled'"
          >
            已启用
          </button>
          <button 
            class="segment-button" 
            :class="{ 'active': filterStatus === 'disabled' }"
            @click="filterStatus = 'disabled'"
          >
            已禁用
          </button>
        </div>
      </div>
      
      <div class="controls" v-else>
        <div class="search-container">
          <el-input
            v-model="marketplaceSearchQuery"
            placeholder="搜索插件市场..."
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><icon-search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="actions-bar">
      <el-button v-if="!showMarketplace" class="refresh-button" :loading="isLoading" @click="refreshPlugins">
        <el-icon class="refresh-icon"><icon-refresh /></el-icon>
        刷新
      </el-button>
      <el-button v-else class="refresh-button" :loading="isLoadingMarketplace" @click="refreshMarketplace">
        <el-icon class="refresh-icon"><icon-refresh /></el-icon>
        刷新市场
      </el-button>
    </div>

    <!-- 插件市场 -->
    <div v-if="showMarketplace" class="marketplace-container">
      <div class="marketplace-header">
        <div class="marketplace-title">
          <span class="marketplace-icon">✨</span>
          插件市场
          <el-tag size="small" class="version-tag">{{ marketplaceVersion }}</el-tag>
        </div>
        <div class="marketplace-description">
          暂无插件都是作者自己提供的的开源成果，如果您喜欢某个插件，请 Star！
        </div>
      </div>

      <!-- 添加错误提示 -->
      <el-alert
        v-if="marketplaceError"
        type="error"
        :closable="true"
        show-icon
        class="mb-3"
      >
        <template #title>连接插件市场失败</template>
        <p>{{ marketplaceError }}</p>
        <p>尝试刷新或稍后再试</p>
      </el-alert>

      <!-- 推荐插件 -->
      <div class="marketplace-section">
        <h3 class="section-title">
          <span class="section-icon">😊</span>
          推荐
        </h3>
        <div class="recommended-plugins">
          <div v-for="plugin in featuredMarketplacePlugins" :key="plugin.id" class="marketplace-plugin-card">
            <div class="plugin-card-header">
              <div class="plugin-author-info">
                <span>{{ plugin.author }}</span>
                <span class="separator">/</span>
                <span class="plugin-name">{{ plugin.name }}</span>
              </div>
              <div class="plugin-version">
                <el-tag size="small" type="info">v{{ plugin.version }}</el-tag>
                <el-tag 
                  v-if="checkPluginStatus(plugin).installed" 
                  size="small" 
                  :type="checkPluginStatus(plugin).hasUpdate ? 'warning' : 'success'"
                  class="ml-1"
                >
                  <el-tooltip 
                    v-if="checkPluginStatus(plugin).hasUpdate" 
                    :content="'可从 v' + checkPluginStatus(plugin).currentVersion + ' 更新到 v' + checkPluginStatus(plugin).newVersion"
                    placement="top"
                  >
                    <span>可更新</span>
                  </el-tooltip>
                  <span v-else>已安装</span>
                </el-tag>
              </div>
            </div>
            <div class="plugin-description">{{ plugin.description }}</div>
            <div class="plugin-meta">
              <span class="version">
                <i class="el-icon-info"></i> v{{ plugin.version }}
              </span>
              <span v-if="plugin.updated" class="update-date">
                更新于: {{ formatDate(plugin.updated) }}
              </span>
            </div>
            <div class="plugin-tags" v-if="plugin.tags && plugin.tags.length > 0">
              <el-tag v-for="tag in plugin.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
            </div>
            <div class="plugin-actions">
              <el-button size="small" @click="viewPluginDocs(plugin)" plain>查看文档</el-button>
              <el-button 
                size="small" 
                @click="installPlugin(plugin)" 
                :type="checkPluginStatus(plugin).hasUpdate ? 'warning' : 'primary'"
                :disabled="checkPluginStatus(plugin).installed && !checkPluginStatus(plugin).hasUpdate"
              >
                {{ checkPluginStatus(plugin).hasUpdate ? '更新' : (checkPluginStatus(plugin).installed ? '已安装' : '安装') }}
              </el-button>
            </div>
          </div>
          <div v-if="featuredMarketplacePlugins.length === 0" class="empty-plugins-message">
            暂无推荐插件
          </div>
        </div>
      </div>

      <!-- 全部插件列表 -->
      <div class="marketplace-section">
        <h3 class="section-title">
          <span class="section-icon">📦</span>
          全部插件
        </h3>
        
        <!-- Loading state for marketplace table -->
        <div v-if="isLoadingMarketplace" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        
        <!-- Empty state for marketplace table -->
        <div v-else-if="filteredMarketplacePlugins.length === 0" class="empty-state">
          <div class="empty-icon">
            <el-icon><icon-collection /></el-icon>
          </div>
          <h3 class="empty-title">没有找到插件</h3>
          <p class="empty-description">插件市场暂无插件或网络连接失败，请稍后再试</p>
        </div>
        
        <!-- Marketplace table -->
        <el-table
          v-else
          :data="filteredMarketplacePlugins"
          style="width: 100%"
          :header-cell-style="{ backgroundColor: '#f5f7fa', color: '#606266' }"
        >
          <el-table-column prop="name" label="名称" min-width="150">
            <template #default="scope">
              <div class="plugin-table-name">
                {{ scope.row.name }}
                <el-tag 
                  v-if="checkPluginStatus(scope.row).installed" 
                  size="small" 
                  :type="checkPluginStatus(scope.row).hasUpdate ? 'warning' : 'success'" 
                  class="ml-1"
                >
                  <el-tooltip 
                    v-if="checkPluginStatus(scope.row).hasUpdate" 
                    :content="'可从 v' + checkPluginStatus(scope.row).currentVersion + ' 更新到 v' + checkPluginStatus(scope.row).newVersion"
                    placement="top"
                  >
                    <span>可更新</span>
                  </el-tooltip>
                  <span v-else>已安装</span>
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" min-width="300" />
          <el-table-column prop="author" label="作者" min-width="100" />
          <el-table-column prop="version" label="版本" width="100">
            <template #default="scope">
              <span>v{{ scope.row.version }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updated" label="最近更新" width="160">
            <template #default="scope">
              <span>{{ formatDate(scope.row.updated) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="tags" label="标签" width="140">
            <template #default="scope">
              <div class="tag-container">
                <el-tag v-for="tag in scope.row.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                <span v-if="!scope.row.tags || scope.row.tags.length === 0">无</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="scope">
              <div class="table-actions">
                <el-button 
                  size="small" 
                  @click="installPlugin(scope.row)" 
                  :type="checkPluginStatus(scope.row).hasUpdate ? 'warning' : 'primary'"
                  :disabled="checkPluginStatus(scope.row).installed && !checkPluginStatus(scope.row).hasUpdate"
                >
                  {{ checkPluginStatus(scope.row).hasUpdate ? '更新' : (checkPluginStatus(scope.row).installed ? '已安装' : '安装') }}
                </el-button>
                <el-button size="small" @click="viewPluginDocs(scope.row)" plain>文档</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div v-for="i in 6" :key="i" class="plugin-card-skeleton">
        <div class="skeleton-header"></div>
        <div class="skeleton-content"></div>
        <div class="skeleton-footer"></div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="filteredPlugins.length === 0" class="empty-state">
      <div class="empty-icon">
        <el-icon><icon-collection /></el-icon>
      </div>
      <h3 class="empty-title">没有找到插件</h3>
      <p class="empty-description">尝试修改搜索条件或刷新插件列表</p>
    </div>
    
    <!-- 插件列表 -->
    <div v-else class="plugins-grid">
      <div 
        v-for="plugin in filteredPlugins" 
        :key="plugin.name" 
        class="plugin-card"
        :class="{ 'enabled': plugin.enabled, 'disabled': !plugin.enabled }"
      >
        <div class="plugin-card-content">
          <div class="plugin-header">
                          <div class="plugin-name-container">
                <h3 class="plugin-name">{{ plugin.name }}</h3>
                <div class="plugin-badges">
                  <span v-if="plugin.isCore" class="badge core-badge">核心</span>
                  <span v-if="plugin.enabled" class="badge status-badge enabled">已启用</span>
                  <span v-else class="badge status-badge disabled">已禁用</span>
                </div>
              </div>
            <div class="plugin-switch" :data-status="plugin.enabled ? '已启用' : '已禁用'">
              <el-switch
                v-model="plugin.enabled"
                @change="togglePlugin(plugin)"
                class="apple-switch"
              />
            </div>
          </div>
          
          <p class="plugin-description">{{ plugin.description || '暂无描述信息' }}</p>
          
          <div class="plugin-meta">
            <div class="meta-item">
              <span class="meta-label">版本</span>
              <span class="meta-value">{{ plugin.version || 'v1.0.0' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">作者</span>
              <span class="meta-value">{{ plugin.author || '未知' }}</span>
            </div>
          </div>
          
          <div class="plugin-actions">
            <el-button class="action-button" @click="configurePlugin(plugin)" type="primary" plain>
              配置
            </el-button>
            <el-button class="action-button" @click="viewDocs(plugin)" plain>
              文档
            </el-button>
            <el-button 
              class="action-button" 
              @click="deletePlugin(plugin)" 
              :disabled="plugin.isCore" 
              type="danger" 
              plain
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页控件 -->
    <div v-if="filteredPlugins.length > 0" class="pagination-container">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="filteredPlugins.length"
        :page-size="pageSize"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 插件配置模态框 -->
    <el-dialog
      v-model="showConfigModal"
      title="插件配置"
      width="600px"
      :close-on-click-modal="false"
      :before-close="() => showConfigModal = false"
    >
      <div v-if="isLoadingConfig" class="loading-container">
        <el-skeleton :rows="6" animated />
      </div>
      <div v-else>
        <h3 v-if="currentPlugin">{{ currentPlugin.name }} 配置</h3>
        
        <div v-if="!pluginConfig || Object.keys(pluginConfig).length === 0" class="empty-config">
          <el-alert
            type="info"
            :closable="false"
            show-icon
          >
            <template #title>
              找不到配置项
            </template>
            <p>该插件没有配置项或配置文件不存在。可能的原因：</p>
            <ul>
              <li>该插件不需要额外配置</li>
              <li>config.toml 或 config.json 文件不存在</li>
              <li>配置文件格式错误或为空</li>
            </ul>
          </el-alert>
        </div>
        
        <div v-else class="config-editor-container">
          <el-alert
            v-if="configParseError"
            type="error"
            :closable="false"
            show-icon
            style="margin-bottom: 15px;"
          >
            <template #title>配置格式错误</template>
            <p>{{ configParseError }}</p>
          </el-alert>

          <el-alert
            type="warning"
            :closable="false"
            show-icon
            style="margin-bottom: 15px;"
          >
            <template #title>编辑配置说明</template>
            <p>请确保编辑后的配置格式正确，保存前会进行格式验证。</p>
          </el-alert>
          
          <el-form label-position="top">
            <!-- 使用textarea来展示和编辑整个配置JSON -->
            <el-form-item label="配置内容（JSON格式）">
              <el-input
                v-model="configEditJson"
                type="textarea"
                :rows="15"
                class="config-textarea"
                resize="vertical"
                @input="validateConfigJson"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showConfigModal = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveConfig" 
            :loading="isLoadingConfig" 
            :disabled="!pluginConfig || Object.keys(pluginConfig).length === 0"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 插件文档模态框 -->
    <el-dialog
      v-model="showDocsModal"
      title="插件文档"
      width="800px"
      :close-on-click-modal="false"
      :before-close="() => showDocsModal = false"
    >
      <div v-if="isLoadingDocs" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>
      <div v-else>
        <div v-if="docsError" class="docs-error-container">
          <el-alert
            type="error"
            :closable="false"
            show-icon
          >
            <template #title>
              加载文档失败
            </template>
            <p>{{ docsError }}</p>
          </el-alert>
        </div>
        <div v-html="pluginDocs" class="markdown-content"></div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDocsModal = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { Search, Refresh, InfoFilled, ShoppingCart, Collection } from '@element-plus/icons-vue';
import { getPlugins, togglePlugin, getPluginDocs, getPluginConfig, savePluginConfig, getMarketplacePlugins } from '../api/plugins';
import { marked } from 'marked';
import request from '../utils/request';  // 添加request导入

export default {
  name: 'PluginsView',
  components: {
    IconSearch: Search,
    IconRefresh: Refresh,
    IconInfoFilled: InfoFilled,
    IconShoppingCart: ShoppingCart,
    IconCollection: Collection
  },
  setup() {
    // 插件数据
    const plugins = ref([]);
    const isLoading = ref(true);
    const searchQuery = ref('');
    const filterStatus = ref('all');
    const showMarketplace = ref(false);

    // 市场数据
    const marketplacePlugins = ref([]);
    const isLoadingMarketplace = ref(false);
    const marketplaceSearchQuery = ref('');
    const marketplaceVersion = ref('1.0.0');
    const marketplaceError = ref(null);

    // 配置和文档模态框
    const showConfigModal = ref(false);
    const showDocsModal = ref(false);
    const currentPlugin = ref(null);
    const pluginConfig = ref({});
    const pluginDocs = ref('');
    const isLoadingConfig = ref(false);
    const isLoadingDocs = ref(false);
    const configEditJson = ref('');
    const configParseError = ref('');
    const docsError = ref('');

    // 过滤后的插件列表
    const filteredPlugins = computed(() => {
      let result = plugins.value;
      
      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(plugin => 
          plugin.name.toLowerCase().includes(query) || 
          plugin.description.toLowerCase().includes(query) ||
          plugin.author.toLowerCase().includes(query)
        );
      }
      
      // 状态过滤
      if (filterStatus.value !== 'all') {
        const enabled = filterStatus.value === 'enabled';
        result = result.filter(plugin => plugin.enabled === enabled);
      }
      
      return result;
    });

    // 通过推荐的市场插件
    const featuredMarketplacePlugins = computed(() => {
      // 如果没有数据，返回空数组
      if (!marketplacePlugins.value || !marketplacePlugins.value.length) {
        return [];
      }
      
      // 筛选包含"工具"或"实用"标签的插件
      const featuredPlugins = marketplacePlugins.value.filter(plugin => {
        return plugin.tags && Array.isArray(plugin.tags) && 
          plugin.tags.some(tag => ['工具', '实用', '热门', '推荐'].includes(tag));
      });
      
      // 如果没有符合条件的插件，取前4个
      if (featuredPlugins.length === 0) {
        return marketplacePlugins.value.slice(0, Math.min(4, marketplacePlugins.value.length));
      }
      
      // 返回符合条件的前4个
      return featuredPlugins.slice(0, Math.min(4, featuredPlugins.length));
    });

    // 过滤后的市场插件
    const filteredMarketplacePlugins = computed(() => {
      if (!marketplaceSearchQuery.value) {
        return marketplacePlugins.value;
      }
      
      const query = marketplaceSearchQuery.value.toLowerCase();
      return marketplacePlugins.value.filter(plugin => 
        plugin.name.toLowerCase().includes(query) || 
        plugin.description.toLowerCase().includes(query) ||
        plugin.author.toLowerCase().includes(query) ||
        (plugin.tags && plugin.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    });

    // 加载插件列表
    const loadPlugins = async () => {
      isLoading.value = true;
      try {
        const data = await getPlugins();
        plugins.value = data;
      } catch (error) {
        ElMessage.error('加载插件列表失败，请检查网络连接');
      } finally {
        isLoading.value = false;
      }
    };

    // 刷新插件列表
    const refreshPlugins = () => {
      loadPlugins();
    };

    // 启用/禁用插件
    const handleTogglePlugin = async (plugin) => {
      try {
        // 直接发送新状态
        await togglePlugin(plugin.name, plugin.enabled);
        ElMessage.success(plugin.enabled ? `插件 ${plugin.name} 已启用` : `插件 ${plugin.name} 已禁用`);
      } catch (error) {
        // 操作失败，恢复原状态
        plugin.enabled = !plugin.enabled;
        ElMessage.error(`${plugin.enabled ? '禁用' : '启用'}插件失败`);
      }
    };

    // 查看插件文档
    const viewDocs = async (plugin) => {
      currentPlugin.value = plugin;
      isLoadingDocs.value = true;
      showDocsModal.value = true;
      docsError.value = '';
      
      try {
        const data = await getPluginDocs(plugin.name);
        if (data && data.docs) {
          // 是否为成功的响应
          if (data.success === false) {
            docsError.value = data.error || '加载文档失败，无法获取README.md';
            pluginDocs.value = marked(data.docs);
          } else {
            pluginDocs.value = marked(data.docs);
          }
        } else {
          docsError.value = `${plugin.name} 文档格式错误或为空`;
          pluginDocs.value = marked(`# ${plugin.name}\n\n文档格式错误或为空，请检查插件目录中的README.md文件。`);
        }
      } catch (error) {
        console.error(`加载 ${plugin.name} 文档失败:`, error);
        docsError.value = error.message || '未知错误';
        pluginDocs.value = marked(`# ${plugin.name}\n\n加载文档失败，可能原因：\n\n* README.md文件不存在或无法读取\n* 服务器错误\n* 网络连接问题`);
      } finally {
        isLoadingDocs.value = false;
      }
    };

    // 打开配置模态框
    const configurePlugin = async (plugin) => {
      currentPlugin.value = plugin;
      isLoadingConfig.value = true;
      showConfigModal.value = true;
      
      try {
        const data = await getPluginConfig(plugin.name);
        if (data && data.config && Object.keys(data.config).length > 0) {
          pluginConfig.value = data.config;
          configEditJson.value = JSON.stringify(data.config, null, 2);
        } else {
          pluginConfig.value = {};
          configEditJson.value = '';
          console.log(`${plugin.name} 无配置项或配置文件为空`);
        }
      } catch (error) {
        console.error(`加载 ${plugin.name} 配置失败:`, error);
        ElMessage.error(`加载 ${plugin.name} 配置失败: ${error.message || '未知错误'}`);
        pluginConfig.value = {};
        configEditJson.value = '';
      } finally {
        isLoadingConfig.value = false;
      }
    };

    // 保存插件配置
    const saveConfig = async () => {
      if (!currentPlugin.value) return;
      
      try {
        const parsedConfig = JSON.parse(configEditJson.value);
        await savePluginConfig(currentPlugin.value.name, parsedConfig);
        ElMessage.success(`${currentPlugin.value.name} 配置已保存`);
        showConfigModal.value = false;
      } catch (error) {
        ElMessage.error(`保存 ${currentPlugin.value.name} 配置失败`);
      }
    };

    // 刷新市场数据
    const refreshMarketplace = async () => {
      isLoadingMarketplace.value = true;
      marketplaceError.value = null;
      
      const loadingInstance = ElLoading.service({
        text: '正在从插件市场获取数据...',
        background: 'rgba(255, 255, 255, 0.7)'
      });
      
      try {
        // 从API获取真实的插件市场数据，强制刷新（不使用缓存）
        const plugins = await getMarketplacePlugins(true);
        marketplacePlugins.value = plugins;
        
        // 如果获取到了插件，提取市场版本信息
        if (plugins.length > 0 && plugins[0].marketVersion) {
          marketplaceVersion.value = plugins[0].marketVersion;
        }
        
        ElMessage.success('插件市场数据已更新');
      } catch (error) {
        console.error('获取插件市场数据失败:', error);
        marketplaceError.value = error.message || '获取插件市场数据失败，请检查网络连接';
        ElMessage.error(marketplaceError.value);
      } finally {
        isLoadingMarketplace.value = false;
        loadingInstance.close();
      }
    };

    // 查看市场插件文档
    const viewPluginDocs = (plugin) => {
      // 如果有GitHub地址，直接跳转
      if (plugin.github_url) {
        window.open(plugin.github_url, '_blank');
      } else {
        ElMessage.info('该插件暂无文档链接');
      }
    };

    // 直接从GitHub下载并安装插件
    const directInstallPlugin = (plugin) => {
      // 处理插件的GitHub URL
      let githubUrl = plugin.github_url || '';
      if (githubUrl.endsWith('.git')) {
        githubUrl = githubUrl.slice(0, -4);
      }
      
      return new Promise((resolve, reject) => {
        console.log(`开始通过后端API从GitHub下载插件: ${plugin.name}, URL: ${githubUrl}`);
      
        // 使用后端API下载和安装插件
        fetch('/api/system/plugins/download-and-install', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            githubUrl,
            pluginName: plugin.name
          })
        })
        .then(response => response.json())
        .then(result => {
          if (!result.success) {
            throw new Error(result.message || result.error || '安装插件失败');
          }
          
          console.log('插件下载安装成功:', result);
          resolve(result);
        })
        .catch(error => {
          console.error('插件下载安装失败:', error);
          reject(error);
        });
      });
    };

    // 确保在installPlugin函数中调用directInstallPlugin
    const installPlugin = (plugin) => {
      // 检查插件状态
      const status = checkPluginStatus(plugin);
      
      // 构建确认消息
      let confirmTitle = '安装插件';
      let confirmMessage = `确定要安装 ${plugin.name} 插件吗？安装后需要重启机器人生效。`;
      
      if (status.installed) {
        if (status.hasUpdate) {
          confirmTitle = '更新插件';
          confirmMessage = `确定要将 ${plugin.name} 从 v${status.currentVersion} 更新到 v${status.newVersion} 吗？更新后需要重启机器人生效。`;
        } else {
          ElMessage.info(`插件 ${plugin.name} 已安装最新版本`);
          return;
        }
      }
      
      ElMessageBox.confirm(
        confirmMessage,
        confirmTitle,
        {
          confirmButtonText: status.hasUpdate ? '更新' : '安装',
          cancelButtonText: '取消',
          type: status.hasUpdate ? 'warning' : 'info'
        }
      ).then(async () => {
        try {
          // 显示正在安装的消息
          ElMessage({
            message: `正在从GitHub下载并安装插件: ${plugin.name}`,
            type: 'info',
            duration: 5000
          });
          
          // 显示加载状态
          const loading = ElLoading.service({
            lock: true,
            text: '正在下载并安装插件，请稍候...',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          
          // 使用直接下载方式安装插件
          const result = await directInstallPlugin(plugin);
          
          // 关闭加载状态
          loading.close();
          
          // 显示安装成功消息
          ElMessage.success(`插件 ${plugin.name} 安装成功！${result.message || ''}`);
          
          // 刷新插件列表
          refreshPlugins();
        } catch (error) {
          console.error('安装插件失败:', error);
          ElMessage.error(`${status.hasUpdate ? '更新' : '安装'}失败: ${error.message || '未知错误'}`);
        }
      }).catch(() => {
        // 用户取消安装
      });
    };

    // 页面加载时获取数据
    onMounted(() => {
      loadPlugins();
      refreshMarketplace();
    });

    // 监听插件开关变化
    watch(() => plugins.value.map(p => p.enabled), 
      (newVal, oldVal) => {
        // 找出发生变化的插件
        if (newVal.length === oldVal.length) {
          for (let i = 0; i < newVal.length; i++) {
            if (newVal[i] !== oldVal[i]) {
              handleTogglePlugin(plugins.value[i]);
              break;
            }
          }
        }
      },
      { deep: true }
    );

    // 验证配置JSON
    const validateConfigJson = () => {
      try {
        const parsedConfig = JSON.parse(configEditJson.value);
        configParseError.value = '';
        pluginConfig.value = parsedConfig;
      } catch (error) {
        configParseError.value = error.message;
      }
    };

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '未知';
      
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      } catch (error) {
        return dateString;
      }
    };

    // 比较版本号
    const compareVersions = (version1, version2) => {
      // 分割版本号为数组
      const v1 = version1.split('.').map(Number);
      const v2 = version2.split('.').map(Number);
      
      // 比较每个部分
      const maxLength = Math.max(v1.length, v2.length);
      for (let i = 0; i < maxLength; i++) {
        // 默认不存在的部分为0
        const part1 = v1[i] || 0;
        const part2 = v2[i] || 0;
        
        if (part1 > part2) return 1;  // 版本1更高
        if (part1 < part2) return -1; // 版本2更高
      }
      
      return 0; // 版本相同
    };

    // 检查插件是否已安装及状态
    const checkPluginStatus = (marketplacePlugin) => {
      if (!plugins.value || !marketplacePlugin) return { installed: false };
      
      // 查找已安装的插件
      const installedPlugin = plugins.value.find(p => p.name === marketplacePlugin.name);
      if (!installedPlugin) return { installed: false };
      
      // 插件已安装，比较版本
      const installedVersion = installedPlugin.version || '1.0.0';
      const marketVersion = marketplacePlugin.version || '1.0.0';
      
      const versionComparison = compareVersions(marketVersion, installedVersion);
      
      return {
        installed: true,
        currentVersion: installedVersion,
        newVersion: marketVersion,
        hasUpdate: versionComparison > 0, // 市场版本更高
        enabled: installedPlugin.enabled
      };
    };

    // 删除插件
    const deletePlugin = (plugin) => {
      if (!plugin || !plugin.name) {
        ElMessage.error('无效的插件');
        return;
      }
      
      // 如果是核心插件，不允许删除
      if (plugin.isCore) {
        ElMessage.warning('核心插件不能删除');
        return;
      }
      
      ElMessageBox.confirm(
        `确定要删除插件 ${plugin.name} 吗？此操作不可逆。`,
        '删除插件',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'danger'
        }
      ).then(async () => {
        try {
          // 显示加载状态
          const loading = ElLoading.service({
            lock: true,
            text: '正在删除插件...',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          
          // 删除插件目录
          const response = await request({
            url: '/api/system/plugins/delete',
            method: 'post',
            data: {
              pluginName: plugin.name
            }
          });
          
          // 关闭加载状态
          loading.close();
          
          if (!response.success) {
            throw new Error(response.message || '删除插件失败');
          }
          
          ElMessage.success(`插件 ${plugin.name} 已成功删除`);
          
          // 刷新插件列表
          refreshPlugins();
        } catch (error) {
          console.error('删除插件失败:', error);
          ElMessage.error(`删除插件失败: ${error.message || '未知错误'}`);
        }
      }).catch(() => {
        // 用户取消删除
      });
    };

    // Return all required properties and methods
    return {
      // Data
      plugins,
      filteredPlugins,
      isLoading,
      searchQuery,
      filterStatus,
      showMarketplace,
      marketplacePlugins,
      marketplaceSearchQuery,
      isLoadingMarketplace,
      featuredMarketplacePlugins,
      filteredMarketplacePlugins,
      marketplaceVersion,
      currentPlugin,
      pluginConfig,
      pluginDocs,
      showConfigModal,
      showDocsModal,
      isLoadingConfig,
      isLoadingDocs,
      configEditJson,
      configParseError,
      docsError,
      marketplaceError,
      
      // Methods
      refreshPlugins,
      configurePlugin,
      viewDocs,
      saveConfig,
      refreshMarketplace,
      viewPluginDocs,
      installPlugin,
      togglePlugin: handleTogglePlugin,
      validateConfigJson,
      formatDate,
      compareVersions,
      checkPluginStatus,
      directInstallPlugin,
      deletePlugin  // 添加删除插件方法
    };
  }
};
</script>

<style scoped>
/* 全局设置 */
.plugins-page {
  width: 100%;
  margin: 0 auto;
  padding: 32px clamp(24px, 4vw, 48px);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
  color: #1d1d1f;
  background-color: #f5f5f7;
}

/* 页面标题和控件 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.5px;
  margin: 0;
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-container {
  width: 230px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.04);
  box-shadow: none;
  border: none;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) inset;
}

.search-input :deep(.el-input__inner) {
  color: #1d1d1f;
}

.search-input :deep(.el-input__prefix) {
  color: #86868b;
}

/* 苹果风格分段控制器 */
.segment-control {
  display: flex;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  padding: 2px;
  height: 36px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.1);
}

.segment-button {
  border: none;
  background: none;
  padding: 0 20px;
  font-size: 13px;
  font-weight: 500;
  color: #86868b;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  height: 32px;
  line-height: 32px;
  margin: 0;
  white-space: nowrap;
  flex: 1;
  text-align: center;
  z-index: 1;
}

.segment-button.active {
  color: #1d1d1f;
  font-weight: 600;
}

.segment-button.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.07);
  z-index: -1;
  animation: segmentActivate 0.3s ease;
}

@keyframes segmentActivate {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 概览卡片 */
.actions-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

/* 插件市场样式 */
.title-tabs {
  display: flex;
  align-items: center;
}

.page-title span {
  cursor: pointer;
  color: #86868b;
  transition: color 0.3s ease;
  position: relative;
}

.page-title .active-tab {
  color: #1d1d1f;
  font-weight: 600;
}

.page-title .active-tab::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #007aff;
  border-radius: 1px;
}

.tab-divider {
  margin: 0 12px;
  color: #d1d1d1;
}

.tab-icon {
  margin-right: 4px;
  font-size: 18px;
  vertical-align: middle;
}

.marketplace-info {
  margin-left: 12px;
}

.help-icon {
  color: #007aff;
  cursor: pointer;
  font-size: 16px;
}

.marketplace-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.marketplace-header {
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 16px;
}

.marketplace-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.marketplace-icon {
  font-size: 22px;
  margin-right: 8px;
}

.version-tag {
  margin-left: 12px;
  font-weight: normal;
}

.marketplace-description {
  color: #86868b;
  font-size: 14px;
}

.marketplace-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.section-icon {
  margin-right: 8px;
  font-size: 20px;
}

.recommended-plugins {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.marketplace-plugin-card {
  background-color: #f9f9fb;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.marketplace-plugin-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.plugin-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.plugin-author-info {
  font-size: 14px;
  color: #86868b;
}

.plugin-name {
  font-weight: 600;
  color: #1d1d1f;
}

.separator {
  margin: 0 6px;
  color: #d1d1d1;
}

.plugin-description {
  color: #424245;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.4;
}

.plugin-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #86868b;
  margin: 10px 0;
}

.version {
  display: flex;
  align-items: center;
  gap: 4px;
}

.update-date {
  margin-left: 6px;
  font-weight: 600;
}

.plugin-tags {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.empty-plugins-message {
  width: 100%;
  text-align: center;
  padding: 30px;
  color: #86868b;
  background-color: #f9f9fb;
  border-radius: 8px;
}

.plugin-actions {
  display: flex;
  gap: 10px;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.plugin-table-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #1d1d1f;
}

.refresh-button {
  height: 36px;
  padding: 0 18px;
  border-radius: 18px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  background-color: #007aff;
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.refresh-button:hover {
  background-color: #0066d6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
}

.refresh-button:active {
  background-color: #0055b3;
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 122, 255, 0.3);
}

.refresh-icon {
  transition: transform 0.5s ease;
}

.refresh-button:hover .refresh-icon {
  transform: rotate(180deg);
}

/* 插件卡片 */
.plugins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.plugin-card {
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.2s ease;
  position: relative;
}

.plugin-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.plugin-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  opacity: 0.8;
  transition: background-color 0.3s ease;
}

.plugin-card.enabled {
  border-left: 4px solid #34c759;
  background-color: #f9fff9;
}

.plugin-card.enabled::before {
  background-color: #34c759;
  width: 0;
}

.plugin-card.disabled {
  border-left: 4px solid #ff453a;
  background-color: #fff9f9;
}

.plugin-card.disabled::before {
  background-color: #ff453a;
  width: 0;
}

.plugin-card-content {
  padding: 20px;
}

.plugin-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.plugin-name-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.plugin-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.plugin-badges {
  display: flex;
  gap: 4px;
}

.badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.core-badge {
  background-color: rgba(255, 149, 0, 0.1);
  color: #ff9500;
}

.status-badge {
  margin-left: 6px;
  font-weight: 600;
}

.status-badge.enabled {
  background-color: rgba(52, 199, 89, 0.1);
  color: #34c759;
  border: 1px solid rgba(52, 199, 89, 0.2);
}

.status-badge.disabled {
  background-color: rgba(255, 69, 58, 0.1);
  color: #ff453a;
  border: 1px solid rgba(255, 69, 58, 0.2);
}

.plugin-description {
  font-size: 14px;
  color: #424245;
  margin: 0 0 16px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.plugin-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.plugin-card.enabled .plugin-meta {
  border-bottom-color: rgba(52, 199, 89, 0.1);
}

.plugin-card.disabled .plugin-meta {
  border-bottom-color: rgba(255, 69, 58, 0.1);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 11px;
  color: #86868b;
  font-weight: 500;
}

.meta-value {
  font-size: 13px;
  color: #1d1d1f;
  font-weight: 500;
}

.plugin-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  flex: 1;
  font-size: 13px;
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
}

/* Apple风格开关 */
.apple-switch :deep(.el-switch__core) {
  background-color: rgba(255, 69, 58, 0.15) !important;
  border: none !important;
  height: 28px;
  width: 48px !important;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: inset 0 0 0 1px rgba(255, 69, 58, 0.2);
}

.apple-switch :deep(.el-switch__core:after) {
  width: 22px;
  height: 22px;
  top: 3px;
  left: 3px;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.apple-switch :deep(.el-switch.is-checked .el-switch__core) {
  background-color: #34c759 !important;
  background-image: linear-gradient(to right, #32d74b, #30c759) !important;
  box-shadow: 0 0 0 1px rgba(52, 199, 89, 0.2), 
              inset 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
}

.apple-switch :deep(.el-switch.is-checked .el-switch__core:after) {
  left: calc(100% - 25px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

/* 添加启用/禁用状态标记 */
.plugin-switch {
  position: relative;
}

.plugin-switch::after {
  content: attr(data-status);
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 600;
  margin-top: 4px;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.plugin-switch[data-status="已启用"]::after {
  color: #34c759;
}

.plugin-switch[data-status="已禁用"]::after {
  color: #ff453a;
}

/* 配置开关状态显示 */
.switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
}

.apple-form .switch-container {
  height: 32px;
}

.switch-status {
  font-size: 13px;
  font-weight: 500;
  transition: color 0.3s ease;
  display: inline-block;
  min-width: 48px;
}

.switch-status.enabled {
  color: #34c759;
}

.switch-status.disabled {
  color: #ff453a;
}

.plugin-card:hover .plugin-switch::after {
  opacity: 1;
}

/* 加载状态 */
.loading-state {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.plugin-card-skeleton {
  height: 200px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.skeleton-header {
  width: 70%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: 16px;
}

.skeleton-content {
  flex: 1;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  margin-bottom: 16px;
}

.skeleton-footer {
  width: 100%;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: rgba(0, 0, 0, 0.05);
  color: #86868b;
  font-size: 24px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1d1d1f;
}

.empty-description {
  font-size: 15px;
  color: #86868b;
  margin: 0;
  max-width: 300px;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.pagination-container :deep(.el-pagination.is-background .el-pager li) {
  background-color: #ffffff;
  border-radius: 50%;
  margin: 0 4px;
  font-weight: 500;
}

.pagination-container :deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #007aff;
}

.pagination-container :deep(.btn-prev),
.pagination-container :deep(.btn-next) {
  background-color: #ffffff;
  border-radius: 50%;
}

/* 对话框样式 */
.apple-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.apple-dialog :deep(.el-dialog__header) {
  margin: 0;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.apple-dialog :deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
}

.apple-dialog :deep(.el-dialog__headerbtn) {
  top: 16px;
  right: 16px;
}

.apple-dialog :deep(.el-dialog__body) {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.apple-dialog :deep(.el-dialog__footer) {
  padding: 16px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* 对话框加载和空状态 */
.dialog-loading, 
.dialog-empty {
  padding: 32px 0;
}

.dialog-loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 16px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.skeleton-line:nth-child(odd) {
  width: 90%;
}

.skeleton-line:nth-child(even) {
  width: 70%;
}

.skeleton-form-group {
  margin-bottom: 20px;
}

.skeleton-label {
  width: 30%;
  height: 16px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-input {
  width: 100%;
  height: 36px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}

/* 文档样式 */
.docs-container {
  width: 100%;
}

.docs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.docs-plugin-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.docs-plugin-version {
  background-color: #f2f7fd;
  color: #0071e3;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.docs-plugin-author {
  color: #6b7280;
  font-size: 13px;
}

.docs-content {
  max-height: 70vh;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 8px;
  line-height: 1.6;
}

.docs-content::-webkit-scrollbar {
  width: 8px;
}

.docs-content::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.docs-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.docs-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

/* 高级Markdown渲染样式 */
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #24292e;
  padding: 16px 24px;
}

.markdown-body h1 {
  font-size: 26px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaecef;
  color: #111827;
}

.markdown-body h2 {
  font-size: 22px;
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 16px;
  padding-bottom: 6px;
  border-bottom: 1px solid #eaecef;
  color: #111827;
}

.markdown-body h3 {
  font-size: 18px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
  color: #111827;
}

.markdown-body h4 {
  font-size: 16px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 12px;
  color: #111827;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 15px;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 24px;
  margin-bottom: 16px;
}

.markdown-body li {
  margin-bottom: 8px;
  font-size: 15px;
}

.markdown-body li + li {
  margin-top: 4px;
}

.markdown-body code {
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 5px;
  border-radius: 4px;
  color: #0550ae;
}

.markdown-body pre {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.markdown-body pre code {
  background-color: transparent;
  padding: 0;
  font-size: 14px;
  white-space: pre;
  color: #24292e;
  display: block;
  line-height: 1.5;
}

.markdown-body blockquote {
  margin: 0 0 16px 0;
  padding: 0 16px;
  color: #6a737d;
  border-left: 4px solid #dfe2e5;
}

.markdown-body img {
  max-width: 100%;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 8px 0;
}

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  display: block;
  overflow-x: auto;
}

.markdown-body table th,
.markdown-body table td {
  padding: 8px 12px;
  border: 1px solid #dfe2e5;
  text-align: left;
}

.markdown-body table th {
  background-color: #f6f8fa;
  font-weight: 600;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f8f8f8;
}

.markdown-body hr {
  height: 1px;
  background-color: #dfe2e5;
  border: none;
  margin: 24px 0;
}

.markdown-body a {
  color: #0366d6;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

@media (max-width: 1200px) {
  .plugins-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 992px) {
  .overview-cards {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .overview-card {
    min-width: 140px;
    flex: 1;
  }
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .controls {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .search-container {
    width: 100%;
  }
  
  .segment-control {
    width: 100%;
    justify-content: space-between;
  }
  
  .overview-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .overview-cards {
    gap: 12px;
  }
  
  .refresh-button {
    align-self: stretch;
    justify-content: center;
  }
  
  .plugins-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .plugin-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .plugins-page {
    padding: 24px 16px;
  }
  
  .overview-cards {
    flex-direction: column;
    width: 100%;
  }
  
  .overview-card {
    width: 100%;
  }
}

/* 配置表单样式 */
.config-content {
  max-height: 500px;
  overflow-y: auto;
}

/* 加载骨架屏 */
.loading-skeleton {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.skeleton-header {
  height: 28px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: 16px;
  width: 60%;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-paragraph {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.skeleton-line {
  height: 14px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  width: 100%;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-code-block {
  height: 120px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  margin-top: 16px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0.6;
  }
}

.docs-dialog :deep(.el-dialog__body) {
  padding: 20px 24px;
}

.docs-dialog :deep(.el-dialog__header) {
  padding: 16px 24px;
  background-color: #f9f9fb;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
}

.docs-dialog :deep(.el-dialog__title) {
  font-weight: 600;
  font-size: 18px;
  color: #111827;
}

/* 空文档状态美化 */
.dialog-empty {
  padding: 40px 0;
  text-align: center;
}

.dialog-empty .empty-icon {
  width: 72px;
  height: 72px;
  background-color: #f2f7fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #0071e3;
  font-size: 32px;
}

.dialog-empty .empty-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.dialog-empty .empty-description {
  color: #6b7280;
  max-width: 300px;
  margin: 0 auto;
}

/* 适应深色模式 */
@media (prefers-color-scheme: dark) {
  .markdown-body {
    color: #e1e1e1;
    background-color: transparent;
  }
  
  .markdown-body h1,
  .markdown-body h2,
  .markdown-body h3,
  .markdown-body h4 {
    color: #e1e1e1;
    border-color: #3e4c5a;
  }
  
  .markdown-body code {
    background-color: rgba(240, 246, 252, 0.1);
    color: #79b8ff;
  }
  
  .markdown-body pre {
    background-color: #161b22;
  }
  
  .markdown-body pre code {
    color: #c9d1d9;
  }
  
  .markdown-body table th {
    background-color: #161b22;
  }
  
  .markdown-body table tr:nth-child(2n) {
    background-color: #0d1117;
  }
  
  .markdown-body table th,
  .markdown-body table td {
    border-color: #30363d;
  }
  
  .markdown-body blockquote {
    color: #8b949e;
    border-left-color: #3e4c5a;
  }
  
  .markdown-body hr {
    background-color: #30363d;
  }
  
  .markdown-body a {
    color: #58a6ff;
  }
}

/* 模态框样式 */
.loading-container {
  padding: 20px 0;
}

.empty-config {
  padding: 20px;
  text-align: center;
}

.markdown-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px;
}

.markdown-content :deep(h1) {
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eaeaea;
}

.markdown-content :deep(h2) {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-content :deep(h3) {
  font-size: 1.3rem;
  margin-top: 1.2rem;
  margin-bottom: 0.8rem;
}

.markdown-content :deep(p) {
  margin: 0.8rem 0;
  line-height: 1.6;
}

.markdown-content :deep(pre) {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 1rem 0;
}

.markdown-content :deep(code) {
  font-family: monospace;
  background-color: #f5f7fa;
  padding: 2px 5px;
  border-radius: 3px;
}

.markdown-content :deep(ul), 
.markdown-content :deep(ol) {
  padding-left: 2rem;
  margin: 1rem 0;
}

.markdown-content :deep(li) {
  margin: 0.5rem 0;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #eaeaea;
  padding: 8px 12px;
  text-align: left;
}

.markdown-content :deep(th) {
  background-color: #f5f7fa;
}

/* 配置编辑器样式 */
.config-editor-container {
  margin-top: 15px;
}

.config-textarea {
  font-family: 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.config-textarea :deep(.el-textarea__inner) {
  font-family: inherit;
  padding: 12px;
  border-radius: 6px;
  resize: vertical;
  min-height: 300px;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
}

/* 适配宽度和超出内容处理 */
.el-dialog__body {
  max-height: 70vh;
  overflow-y: auto;
}

.empty-config {
  padding: 20px;
  text-align: center;
}

/* 文档错误样式 */
.docs-error-container {
  margin-bottom: 20px;
}

.docs-error-container .el-alert {
  margin-bottom: 15px;
}

/* 添加错误样式 */
.mb-3 {
  margin-bottom: 1rem;
}

/* 市场加载和错误状态 */
.marketplace-error {
  padding: 30px;
  text-align: center;
  background-color: #fff4f3;
  border-radius: 8px;
  margin-bottom: 24px;
}

.marketplace-error-icon {
  font-size: 32px;
  color: #ff453a;
  margin-bottom: 16px;
}

.marketplace-error-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #ff453a;
}

.marketplace-error-message {
  font-size: 14px;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
}

.marketplace-error-actions {
  margin-top: 16px;
}

/* Add these CSS classes */
.ml-1 {
  margin-left: 4px;
}

.plugin-version {
  display: flex;
  align-items: center;
}
</style> 