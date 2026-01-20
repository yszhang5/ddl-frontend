<template>
  <div class="admin-users">
    <div class="container">
      <div class="nav-header">
        <div class="nav-links">
          <router-link to="/admin/dashboard">← 管理员仪表盘</router-link>
          <span class="divider">|</span>
          <span>用户管理</span>
          <span class="divider">|</span>
          <router-link to="/admin/statistics">系统统计</router-link>
          <span class="divider">|</span>
          <router-link to="/dashboard">返回主站</router-link>
        </div>
      </div>

      <div class="welcome">
        <h2>用户管理</h2>
        <p>管理系统用户账户和权限</p>
      </div>

      <div class="user-list">
        <table class="table">
          <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="users.length === 0">
            <td colspan="6" class="empty">暂无用户数据</td>
          </tr>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ getUserRoleLabel(user.roles) }}</td>
            <td>
                <span :class="`status-${user.enabled ? 'active' : 'inactive'}`">
                  {{ user.enabled ? '启用' : '禁用' }}
                </span>
            </td>
            <td>
              <button
                  @click="toggleUserStatus(user)"
                  class="btn btn-warning btn-sm"
              >
                {{ user.enabled ? '禁用' : '启用' }}
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue'
import api from '../../api'

export default {
  name: 'AdminUsers',
  setup() {
    const users = ref([])

    const getUserRoleLabel = (roles) => {
      if (roles.length === 0) return '普通用户'
      // 获取 name 字段
      return roles[0].name
    }

    const toggleUserStatus = async (user) => {
      if (!confirm(`确定要${user.enabled ? '禁用' : '启用'}用户 ${user.username} 吗？`)) {
        return
      }

      try {
        // 这里需要根据后端API调整
        const response = await api.admin.toggleUserStatus(user.id)
        if (response.data.code === 20000) {
          user.enabled = !user.enabled
        }
      } catch (error) {
        console.error('操作失败:', error)
      }
    }

    const loadUsers = async () => {
      try {
        const response = await api.admin.getUsers()
        if (response.data.code === 20000) {
          users.value = response.data.data.content
        }
      } catch (error) {
        console.error('加载用户列表失败:', error)
      }
    }

    onMounted(() => {
      loadUsers()
    })

    return {
      users,
      getUserRoleLabel,
      toggleUserStatus
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-users {
  padding: 20px 0;
}

.user-list {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid $border-color;
  }

  th {
    background: #f8f9fa;
    color: $text-color;
    font-weight: 600;
  }

  .empty {
    text-align: center;
    padding: 50px;
    color: $text-secondary;
  }
}

.status-active {
  color: $success-color;
  font-weight: bold;
}

.status-inactive {
  color: $error-color;
  font-weight: bold;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}
</style>