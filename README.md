## 接口
    // 认证相关
    auth: {
        login: (credentials) => api.post('/auth/login', credentials),
        register: (userData) => api.post('/auth/register', userData),
        logout: () => api.post('/auth/logout')
    },

    // 任务相关
    tasks: {
        getAll: (params) => api.get('/tasks', { params }),
        getById: (uuid) => api.get(`/tasks/${uuid}`),
        create: (taskData) => api.post('/tasks', taskData),
        update: (uuid, taskData) => api.put(`/tasks/${uuid}`, taskData),
        delete: (uuid) => api.delete(`/tasks/${uuid}`),
        updateProgress: (uuid, progressData) => api.patch(`/tasks/${uuid}/progress`, progressData)
    },

    // 统计相关
    statistics: {
        getApiStats: () => api.get('/statistics/api/data'),
        resetApiStats: () => api.post('/statistics/api/reset')
    },

    // 管理员相关
    admin: {
        getUsers: () => api.get('/admin/users'),
        toggleUserStatus: (userId) => api.patch(`/admin/users/${userId}/status`),
        getSessionStats: () => api.get('/admin/session/statistics')
    }

## 项目结构
    ddl-frontend/
    ├── src/
    │   ├── components/          # 可复用组件
    │   ├── views/              # 页面组件
    │   ├── router/             # 路由配置
    │   ├── store/              # 状态管理
    │   ├── api/                # API接口
    │   ├── utils/              # 工具函数
    │   ├── assets/             # 静态资源
    │   ├── App.vue             # 根组件
    │   └── main.js             # 入口文件
    ├── package.json
    ├── index.html
    └── vite.config.js

