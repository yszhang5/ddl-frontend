import { createStore } from 'vuex'
import api from '../api'

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
            try {
                const response = await api.auth.login(credentials)

                if (response.data.code === 20000) {
                    const { token, user } = response.data.data
                    commit('SET_TOKEN', token)
                    commit('SET_USER', user)
                    return { success: true }
                } else {
                    return { success: false, error: response.data.msg || '登录失败' }
                }
            } catch (error) {
                return { success: false, error: '网络错误，请稍后重试' }
            }
        },

        async register({ commit }, userData) {
            try {
                const response = await api.auth.register(userData)

                if (response.data.code === 20000) {
                    return { success: true, message: '注册成功' }
                } else {
                    return { success: false, error: response.data.msg || '注册失败' }
                }
            } catch (error) {
                return { success: false, error: '网络错误，请稍后重试' }
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
            try {
                const response = await api.tasks.getAll()

                if (response.data.code === 20000) {
                    commit('SET_TASKS', response.data.data)
                }
            } catch (error) {
                console.error('获取任务列表失败:', error)
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