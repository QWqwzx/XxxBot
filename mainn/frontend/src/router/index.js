import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: '控制台' }
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('../views/System.vue'),
    meta: { title: '系统管理' },
    children: [
      {
        path: '',
        redirect: { name: 'SystemStatus' }
      },
      {
        path: 'status',
        name: 'SystemStatus',
        component: () => import('../views/system/Status.vue'),
        meta: { title: '系统状态' }
      },
      {
        path: 'info',
        name: 'SystemInfo',
        component: () => import('../views/system/Info.vue'),
        meta: { title: '系统信息' }
      },
      {
        path: 'bot',
        name: 'BotStatus',
        component: () => import('../views/system/Bot.vue'),
        meta: { title: '机器人状态' }
      },
      {
        path: 'version',
        name: 'Version',
        component: () => import('../views/system/Version.vue'),
        meta: { title: '版本管理' }
      },
      {
        path: 'logs',
        name: 'SystemLogs',
        component: () => import('../views/system/Logs.vue'),
        meta: { title: '系统日志' }
      }
    ]
  },
  {
    path: '/plugins',
    name: 'Plugins',
    component: () => import('../views/Plugins.vue'),
    meta: { title: '插件管理' }
  },
  {
    path: '/files',
    name: 'Files',
    component: () => import('../views/Files.vue'),
    meta: { title: '文件管理' }
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: () => import('../views/Contacts.vue'),
    meta: { title: '消息平台' }
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: () => import('../views/Accounts.vue'),
    meta: { title: '账户管理' }
  },
  {
    path: '/notification',
    name: 'Notification',
    component: () => import('../views/Notification.vue'),
    meta: { title: '通知管理' }
  },
  {
    path: '/reminders',
    name: 'Reminders',
    component: () => import('../views/Reminders.vue'),
    meta: { title: '提醒管理' }
  },
  {
    path: '/terminal',
    name: 'Terminal',
    component: () => import('../views/Terminal.vue'),
    meta: { title: '终端' }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/Chat.vue'),
    meta: { title: '聊天' }
  },
  {
    path: '/database',
    name: 'Database',
    component: () => import('../views/Database.vue'),
    meta: { title: '数据库' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { title: '设置' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { title: '关于' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 