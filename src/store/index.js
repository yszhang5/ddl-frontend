import {createStore} from 'vuex'
import api from '../api'
import {generateMockToken, MOCK_MODE, MOCK_TASKS, MOCK_USERS, mockDelay} from '../utils/mockData'

export default createStore({
    state: {
        user: null,
        token: localStorage.getItem('token') || null,
        tasks: [],
        isLoading: false
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user
            if (user) {
                localStorage.setItem('userRole', user.role || 'USER')
            }
        },
        SET_TOKEN(state, token) {
            state.token = token
            if (token) {
                localStorage.setItem('token', token)
            } else {
                localStorage.removeItem('token')
                localStorage.removeItem('userRole')
            }
        },
        SET_TASKS(state, tasks) {
            state.tasks = tasks
        },
        SET_LOADING(state, isLoading) {
            state.isLoading = isLoading
        }
    },
    actions: {
        async login({ commit }, credentials) {
            // Mock模式：检查是否是测试账号
            if (MOCK_MODE) {
                const mockUser = MOCK_USERS[credentials.username]
                if (mockUser && mockUser.password === credentials.password) {
                    await mockDelay(300) // 模拟网络延迟
                    const token = generateMockToken(credentials.username)
                    const user = {
                        id: mockUser.id,
                        username: mockUser.username,
                        email: mockUser.email,
                        role: mockUser.role
                    }
                    commit('SET_TOKEN', token)
                    commit('SET_USER', user)
                    // 初始化mock任务数据
                    commit('SET_TASKS', MOCK_TASKS)
                    console.log('✅ Mock模式：使用测试账号登录成功', user)
                    return { success: true }
                } else if (mockUser) {
                    return { success: false, error: '密码错误' }
                }
                // 如果不是mock账号，继续尝试真实API
            }

            try {
                const response = await api.auth.login(credentials)

                if (response.data.code === 200) {
                    const { token, user } = response.data.data
                    commit('SET_TOKEN', token)
                    commit('SET_USER', user)
                    return { success: true }
                } else {
                    return { success: false, error: response.data.msg || '登录失败' }
                }
            } catch (error) {
                console.error('登录错误:', error)
                if (error.response) {
                    // 服务器返回了错误响应
                    const status = error.response.status
                    const message = error.response.data?.msg || error.response.data?.message
                    if (status === 401) {
                        return { success: false, error: '用户名或密码错误' }
                    } else if (status === 400) {
                        return { success: false, error: message || '请求参数错误' }
                    } else if (status >= 500) {
                        return { success: false, error: '服务器错误，请稍后重试' }
                    } else {
                        return { success: false, error: message || '登录失败' }
                    }
                } else if (error.request) {
                    // 请求已发出但没有收到响应 - 在mock模式下提供友好提示
                    if (MOCK_MODE) {
                        return { 
                            success: false, 
                            error: '无法连接到服务器。提示：可以使用测试账号 testuser/123456 或 admin/admin123 登录（Mock模式）' 
                        }
                    }
                    return { success: false, error: '无法连接到服务器，请检查网络连接或确认后端服务是否运行' }
                } else {
                    // 其他错误
                    return { success: false, error: error.message || '网络错误，请稍后重试' }
                }
            }
        },

        async register({ commit }, userData) {
            try {
                const formData = new FormData()
                formData.append('username', userData.username)
                formData.append('email', userData.email)
                formData.append('password', userData.password)
                if (userData.avatar) {
                    formData.append('avatar', userData.avatar)

                }
                const response = await api.auth.register(formData)

                if (response.data.code === 200) {
                    return { success: true, message: '注册成功' }
                } else {
                    return { success: false, error: response.data.msg || '注册失败' }
                }
            } catch (error) {
                console.error('注册错误:', error)
                if (error.response) {
                    // 服务器返回了错误响应
                    const status = error.response.status
                    const message = error.response.data?.msg || error.response.data?.message
                    if (status === 400) {
                        return { success: false, error: message || '请求参数错误，请检查输入信息' }
                    } else if (status === 409) {
                        return { success: false, error: message || '用户名或邮箱已存在' }
                    } else if (status >= 500) {
                        return { success: false, error: '服务器错误，请稍后重试' }
                    } else {
                        return { success: false, error: message || '注册失败' }
                    }
                } else if (error.request) {
                    // 请求已发出但没有收到响应
                    return { success: false, error: '无法连接到服务器，请检查网络连接或确认后端服务是否运行' }
                } else {
                    // 其他错误
                    return { success: false, error: error.message || '网络错误，请稍后重试' }
                }
            }
        },

        async logout({ commit }) {
            try {
                await api.auth.logout()
            } catch (error) {
                console.error('登出失败:', error)
            } finally {
                commit('SET_TOKEN', null)
                commit('SET_USER', null)
            }
        },

        async fetchTasks({ commit, state }) {
            commit('SET_LOADING', true)
            
            // Mock模式：返回mock数据
            if (MOCK_MODE && state.token && state.token.startsWith('mock-token')) {
                await mockDelay(300)
                commit('SET_TASKS', MOCK_TASKS)
                commit('SET_LOADING', false)
                return
            }

            try {
                const response = await api.tasks.getAll()

                if (response.data.code === 20000) {
                    commit('SET_TASKS', response.data.data)
                }
            } catch (error) {
                console.error('获取任务列表失败:', error)
                // 如果失败且是mock模式，使用mock数据
                if (MOCK_MODE && state.token && state.token.startsWith('mock-token')) {
                    commit('SET_TASKS', MOCK_TASKS)
                }
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async createTask({ dispatch }, taskData) {
            try {
                const response = await api.tasks.create(taskData)

                if (response.data.code === 20000) {
                    await dispatch('fetchTasks')
                    return { success: true, message: '任务创建成功' }
                } else {
                    return { success: false, error: response.data.msg || '创建失败' }
                }
            } catch (error) {
                return { success: false, error: '网络错误，请稍后重试' }
            }
        },

        async updateTask({ dispatch }, { uuid, taskData }) {
            try {
                const response = await api.tasks.update(uuid, taskData)

                if (response.data.code === 20000) {
                    await dispatch('fetchTasks')
                    return { success: true, message: '任务更新成功' }
                } else {
                    return { success: false, error: response.data.msg || '更新失败' }
                }
            } catch (error) {
                return { success: false, error: '网络错误，请稍后重试' }
            }
        },

        async deleteTask({ dispatch }, uuid) {
            try {
                const response = await api.tasks.delete(uuid)

                if (response.data.code === 20000) {
                    await dispatch('fetchTasks')
                    return { success: true, message: '任务删除成功' }
                } else {
                    return { success: false, error: response.data.msg || '删除失败' }
                }
            } catch (error) {
                return { success: false, error: '网络错误，请稍后重试' }
            }
        },

        async updateTaskProgress({ dispatch }, { uuid, progressData }) {
            try {
                const response = await api.tasks.updateProgress(uuid, progressData)

                if (response.data.code === 20000) {
                    await dispatch('fetchTasks')
                    return { success: true, message: '进度更新成功' }
                } else {
                    return { success: false, error: response.data.msg || '更新失败' }
                }
            } catch (error) {
                return { success: false, error: '网络错误，请稍后重试' }
            }
        }
    },
    getters: {
        isAuthenticated: state => !!state.token,
        userRole: state => state.user?.role || localStorage.getItem('userRole'),
        pendingTasks: state => state.tasks.filter(task => task.status === 'TODO'),
        inProgressTasks: state => state.tasks.filter(task => task.status === 'IN_PROGRESS'),
        dueSoonTasks: state => state.tasks.filter(task => {
            const deadline = new Date(task.deadline)
            const now = new Date()
            const diffTime = deadline - now
            const diffDays = diffTime / (1000 * 60 * 60 * 24)
            return diffDays <= 3 && diffDays >= 0
        }),
        completedTasks: state => state.tasks.filter(task => task.status === 'COMPLETED')
    }
})