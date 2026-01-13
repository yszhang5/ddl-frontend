<template>
  <div class="dashboard">
    <div class="container">
      <!-- 导航栏 -->
      <div class="nav-header">
        <div class="nav-links">
          <span>主页</span>
          <span class="divider">|</span>
          <router-link to="/tasks">任务列表</router-link>
        </div>
      </div>

      <div class="welcome">
        <h2>欢迎回来！</h2>
        <p>{{ welcomeMessage }}</p>
      </div>

      <div class="cards">
        <div class="card">
          <h3>待办任务</h3>
          <div class="number">{{ pendingCount }}</div>
          <p>需要处理的任务</p>
        </div>
        <div class="card">
          <h3>进行中</h3>
          <div class="number">{{ inProgressCount }}</div>
          <p>正在进行的任务</p>
        </div>
        <div class="card">
          <h3>即将截止</h3>
          <div class="number">{{ dueSoonCount }}</div>
          <p>3天内截止的任务</p>
        </div>
        <div class="card">
          <h3>已完成</h3>
          <div class="number">{{ completedCount }}</div>
          <p>本月完成的任务</p>
        </div>
      </div>

      <div class="quick-actions">
        <h3>快捷操作</h3>
        <router-link to="/tasks/new" class="btn">新建任务</router-link>
        <router-link to="/tasks" class="btn">查看所有任务</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore()

    const welcomeMessage = ref('欢迎使用DDL管理系统')

    // 从store中获取任务统计
    const pendingCount = computed(() => store.getters.pendingTasks.length)
    const inProgressCount = computed(() => store.getters.inProgressTasks.length)
    const dueSoonCount = computed(() => store.getters.dueSoonTasks.length)
    const completedCount = computed(() => store.getters.completedTasks.length)

    onMounted(() => {
      // 加载任务数据
      store.dispatch('fetchTasks')
    })

    return {
      welcomeMessage,
      pendingCount,
      inProgressCount,
      dueSoonCount,
      completedCount
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px 0;
}

.nav-header {
  background: white;
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 15px;
  align-items: center;
}

.nav-links span {
  color: $text-color;
  font-weight: 600;
}

.nav-links .divider {
  color: $border-color;
}

.nav-links a {
  color: $primary-color;
  text-decoration: none;
  font-weight: 500;
}

.welcome {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.welcome h2 {
  color: $text-color;
  margin-bottom: 10px;
}

.welcome p {
  color: $text-secondary;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.card h3 {
  color: $text-color;
  margin-bottom: 15px;
}

.card .number {
  font-size: 36px;
  font-weight: bold;
  color: $primary-color;
}

.card p {
  color: $text-secondary;
  margin-top: 10px;
}

.quick-actions {
  margin-top: 30px;
}

.quick-actions h3 {
  margin-bottom: 15px;
  color: $text-color;
}
</style>