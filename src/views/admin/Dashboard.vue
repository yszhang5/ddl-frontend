<template>
  <div class="admin-dashboard">
    <div class="container">
      <div class="nav-header">
        <div class="nav-links">
          <span>管理员仪表盘</span>
          <span class="divider">|</span>
          <router-link to="/admin/users">用户管理</router-link>
          <span class="divider">|</span>
          <router-link to="/admin/statistics">系统统计</router-link>
          <span class="divider">|</span>
          <router-link to="/dashboard">返回主站</router-link>
        </div>
      </div>

      <div class="welcome">
        <h2>管理员仪表盘</h2>
        <p>欢迎使用DDL管理系统管理员面板</p>
      </div>

      <div class="stats-cards">
        <div class="card">
          <h3>总用户数</h3>
          <div class="number">{{ userStats.totalUsers }}</div>
        </div>
        <div class="card">
          <h3>今日登录</h3>
          <div class="number">{{ userStats.todayLogin }}</div>
        </div>
        <div class="card">
          <h3>在线用户</h3>
          <div class="number">{{ userStats.onlineUsers }}</div>
        </div>
      </div>

      <div class="quick-actions">
        <h3>快捷操作</h3>
        <router-link to="/admin/users" class="btn">用户管理</router-link>
        <router-link to="/admin/statistics" class="btn btn-secondary">查看统计</router-link>
        <button @click="loadSessionStats" class="btn btn-info">Session监控</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '../../api'

export default {
  name: 'AdminDashboard',
  setup() {
    const userStats = ref({
      totalUsers: 0,
      todayLogin: 0,
      onlineUsers: 0
    })

    const loadSessionStats = async () => {
      try {
        const response = await api.admin.getSessionStats()
        if (response.data.code === 20000) {
          userStats.value = response.data.data
        }
      } catch (error) {
        console.error('加载Session统计失败:', error)
      }
    }

    const loadUserStats = async () => {
      try {
        const response = await api.admin.getUsers()
        if (response.data.code === 20000) {
          const users = response.data.data
          userStats.value.totalUsers = users.length
          userStats.value.todayLogin = users.filter(user =>
              new Date(user.lastLogin).toDateString() === new Date().toDateString()
          ).length
        }
      } catch (error) {
        console.error('加载用户统计失败:', error)
      }
    }

    onMounted(() => {
      loadUserStats()
      loadSessionStats()
    })

    return {
      userStats,
      loadSessionStats
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-dashboard {
  padding: 20px 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.btn-info {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
}
</style>