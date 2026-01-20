<template>
  <nav class="admin-navbar">
    <div class="navbar-brand">
      <h1>DDL管理系统 - 管理员</h1>
    </div>
    <div class="navbar-menu">
      <router-link to="/admin/dashboard" class="nav-link">仪表盘</router-link>
      <router-link to="/admin/users" class="nav-link">用户管理</router-link>
      <router-link to="/admin/statistics" class="nav-link">系统统计</router-link>
      <router-link to="/dashboard" class="nav-link">返回主站</router-link>
    </div>
    <div class="navbar-user">
      <span class="username">{{ username }}</span>
      <img
          v-if="avatar"
          :src="avatar"
          alt="用户头像"
          style="width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-top: 10px;
            object-fit: cover;"
      >
      <button @click="logout" class="logout-btn">退出</button>
    </div>
  </nav>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'AdminNavbar',
  setup() {
    const store = useStore()
    const router = useRouter()

    const user = computed(() => store.state.user)
    const username = localStorage.getItem('username')
    const avatar = localStorage.getItem('avatar')

    const logout = async () => {
      await store.dispatch('logout')
      await router.push('/login')
    }

    return {
      user,
      username,
      avatar,
      logout
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-navbar {
  background: #343a40;
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