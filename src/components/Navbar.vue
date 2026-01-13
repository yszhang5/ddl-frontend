<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <h1>DDL管理系统</h1>
    </div>
    <div class="navbar-menu">
      <router-link to="/dashboard" class="nav-link">主页</router-link>
      <router-link to="/tasks" class="nav-link">任务列表</router-link>
      <router-link to="/statistics" class="nav-link">统计</router-link>
    </div>
    <div class="navbar-user">
      <span class="username">{{ user.username }}</span>
      <button @click="logout" class="logout-btn">退出</button>
    </div>
  </nav>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed } from 'vue'


export default {
  name: 'Navbar',
  setup() {
    const store = useStore()
    const router = useRouter()

    const user = computed(() => store.state.user)

    const logout = async () => {
      await store.dispatch('logout')
      await router.push('/login')
    }

    return {
      user,
      logout
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  background: $primary-gradient;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.navbar-brand h1 {
  font-size: 20px;
}

.navbar-menu {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-link:hover, .nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  margin-right: 10px;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>