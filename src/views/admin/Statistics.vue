<template>
  <div class="admin-statistics">
    <div class="container">
      <div class="nav-header">
        <div class="nav-links">
          <router-link to="/admin/dashboard">← 管理员仪表盘</router-link>
          <span class="divider">|</span>
          <router-link to="/admin/users">用户管理</router-link>
          <span class="divider">|</span>
          <span>系统统计</span>
          <span class="divider">|</span>
          <router-link to="/dashboard">返回主站</router-link>
        </div>
      </div>

      <h2>系统统计</h2>

      <div class="stats-section">
        <h3>接口调用统计</h3>
        <div id="apiStatistics">
          <p>统计功能开发中...</p>
        </div>
      </div>

      <div class="stats-section">
        <h3>Session监控</h3>
        <button @click="loadSessionStats" class="btn btn-info">刷新Session统计</button>
        <div id="sessionStats" class="session-stats">
          <p v-if="sessionStats">在线用户: {{ sessionStats.onlineUsers }}</p>
          <p v-if="sessionStats">总Session数: {{ sessionStats.totalSessions }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import api from '../../api'

export default {
  name: 'AdminStatistics',
  setup() {
    const sessionStats = ref(null)

    const loadSessionStats = async () => {
      try {
        const response = await api.admin.getSessionStats()
        if (response.data.code === 20000) {
          sessionStats.value = response.data.data
        }
      } catch (error) {
        console.error('加载Session统计失败:', error)
      }
    }

    return {
      sessionStats,
      loadSessionStats
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-statistics {
  padding: 20px 0;
}

.stats-section {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  h3 {
    color: $text-color;
    margin-bottom: 15px;
  }
}

.session-stats {
  margin-top: 15px;
  p {
    margin: 5px 0;
    color: $text-secondary;
  }
}
</style>