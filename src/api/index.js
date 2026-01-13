import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
})

// 请求拦截器
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
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
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('userRole')
            window.location.href = '/login'
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