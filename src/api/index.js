import axios from 'axios'
import { MOCK_MODE, MOCK_TASKS, MOCK_USERS_LIST, MOCK_STATISTICS, mockDelay } from '../utils/mockData'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
})

// 检查是否是mock模式
function isMockMode() {
    return MOCK_MODE && localStorage.getItem('token')?.startsWith('mock-token')
}

// 请求拦截器
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        // 如果是FormData，不设置Content-Type，让浏览器自动设置
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data'
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('userRole')
            window.location.href = '/login'
        }
        
        // Mock模式：如果请求失败，尝试返回mock数据
        if (isMockMode() && error.request) {
            const url = error.config?.url || ''
            const method = error.config?.method?.toLowerCase() || ''
            
            // 模拟网络延迟
            await mockDelay(200)
            
            // 根据URL返回对应的mock数据
            if (url.includes('/tasks') && method === 'get') {
                return {
                    data: {
                        code: 20000,
                        msg: 'success',
                        data: MOCK_TASKS
                    },
                    status: 200,
                    statusText: 'OK'
                }
            }
            
            if (url.includes('/admin/users') && method === 'get') {
                return {
                    data: {
                        code: 20000,
                        msg: 'success',
                        data: MOCK_USERS_LIST
                    },
                    status: 200,
                    statusText: 'OK'
                }
            }
            
            if (url.includes('/admin/session/statistics') && method === 'get') {
                return {
                    data: {
                        code: 20000,
                        msg: 'success',
                        data: {
                            onlineUsers: 2,
                            totalSessions: 5,
                            activeSessions: 3
                        }
                    },
                    status: 200,
                    statusText: 'OK'
                }
            }
            
            if (url.includes('/statistics/api/data') && method === 'get') {
                return {
                    data: {
                        code: 20000,
                        msg: 'success',
                        data: [
                            { apiName: '/api/tasks', callCount: 45, lastCallTime: Date.now() - 1000 },
                            { apiName: '/api/auth/login', callCount: 12, lastCallTime: Date.now() - 5000 },
                            { apiName: '/api/statistics', callCount: 8, lastCallTime: Date.now() - 10000 }
                        ]
                    },
                    status: 200,
                    statusText: 'OK'
                }
            }
        }
        
        return Promise.reject(error)
    }
)

export default {
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
}