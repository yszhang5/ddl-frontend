<template>
  <div class="task-list">
    <div class="container">
      <!-- 导航栏 -->
      <div class="nav-header">
        <div class="nav-links">
          <router-link to="/dashboard">← 主页</router-link>
          <span class="divider">|</span>
          <span>任务列表</span>
        </div>
        <router-link to="/tasks/new" class="btn">+ 新建任务</router-link>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-card">
        <form @submit.prevent="applyFilter" class="filter-form">
          <label>状态筛选：</label>
          <select v-model="filterStatus">
            <option value="">全部</option>
            <option value="TODO">待办</option>
            <option value="IN_PROGRESS">进行中</option>
            <option value="COMPLETED">已完成</option>
            <option value="CANCELED">已取消</option>
          </select>
          <button type="submit" class="btn">筛选</button>
          <button type="button" @click="resetFilter" class="btn btn-secondary">重置</button>
        </form>
      </div>

      <!-- 消息提示 -->
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <!-- 任务表格 -->
      <div class="task-table-container">
        <table class="task-table">
          <thead>
          <tr>
            <th>标题</th>
            <th>分类</th>
            <th>截止时间</th>
            <th>状态</th>
            <th>优先级</th>
            <th>进度</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="filteredTasks.length === 0" class="empty">
            <td colspan="7">
              暂无任务，点击右上角"新建任务"创建第一个任务吧！
            </td>
          </tr>
          <tr v-for="task in filteredTasks" :key="task.uuid">
            <td>
              <router-link :to="`/tasks/${task.uuid}`" class="task-link">
                {{ task.title }}
              </router-link>
            </td>
            <td>{{ task.category || '-' }}</td>
            <td>{{ formatDateTime(task.deadline) }}</td>
            <td>
                <span :class="getStatusClass(task.status)">
                  {{ getStatusLabel(task.status) }}
                </span>
            </td>
            <td>
                <span :class="`priority-${task.priority.toLowerCase()}`">
                  {{ getPriorityLabel(task.priority) }}
                </span>
            </td>
            <td>
              <div class="progress-display">
                <div class="progress-bar">
                  <div
                      class="progress-fill"
                      :style="`width: ${task.progress}%`"
                  ></div>
                </div>
                <span>{{ task.progress }}%</span>
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <router-link :to="`/tasks/${task.uuid}`" class="action-link view">
                  查看
                </router-link>
                <router-link :to="`/tasks/${task.uuid}/edit`" class="action-link edit">
                  编辑
                </router-link>
                <button
                    @click="deleteTask(task.uuid)"
                    class="action-link delete"
                >
                  删除
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'TaskList',
  setup() {
    const store = useStore()
    const router = useRouter()

    const filterStatus = ref('')
    const successMessage = ref('')
    const errorMessage = ref('')

    const tasks = computed(() => store.state.tasks)

    const filteredTasks = computed(() => {
      if (!filterStatus.value) {
        return tasks.value
      }
      return tasks.value.filter(task => task.status === filterStatus.value)
    })

    const applyFilter = () => {
      // 筛选逻辑已在computed中处理
    }

    const resetFilter = () => {
      filterStatus.value = ''
    }

    const formatDateTime = (dateTime) => {
      return new Date(dateTime).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getStatusClass = (status) => {
      const statusMap = {
        'TODO': 'status-todo',
        'IN_PROGRESS': 'status-progress',
        'COMPLETED': 'status-completed',
        'CANCELED': 'status-canceled'
      }
      return `status ${statusMap[status] || ''}`
    }

    const getStatusLabel = (status) => {
      const labelMap = {
        'TODO': '待办',
        'IN_PROGRESS': '进行中',
        'COMPLETED': '已完成',
        'CANCELED': '已取消'
      }
      return labelMap[status] || status
    }

    const getPriorityLabel = (priority) => {
      const labelMap = {
        'LOW': '低',
        'MEDIUM': '中',
        'HIGH': '高',
        'URGENT': '紧急'
      }
      return labelMap[priority] || priority
    }

    const deleteTask = async (uuid) => {
      if (!confirm('确定要删除这个任务吗？')) {
        return
      }

      const result = await store.dispatch('deleteTask', uuid)

      if (result.success) {
        successMessage.value = result.message
      } else {
        errorMessage.value = result.error
      }

      // 3秒后清除消息
      setTimeout(() => {
        successMessage.value = ''
        errorMessage.value = ''
      }, 3000)
    }

    onMounted(() => {
      store.dispatch('fetchTasks')
    })

    return {
      filterStatus,
      successMessage,
      errorMessage,
      filteredTasks,
      applyFilter,
      resetFilter,
      formatDateTime,
      getStatusClass,
      getStatusLabel,
      getPriorityLabel,
      deleteTask
    }
  }
}
</script>

<style lang="scss" scoped>
.task-list {
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

.nav-links .divider {
  color: $border-color;
}

.nav-links a {
  color: $primary-color;
  text-decoration: none;
  font-weight: 500;
}

.nav-links span {
  color: $text-color;
  font-weight: 600;
}

.filter-card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filter-form {
  display: flex;
  gap: 10px;
  align-items: center;

  label {
    margin-bottom: 0;
  }

  select {
    width: auto;
    padding: 8px;
  }

  .btn {
    padding: 8px 16px;
    margin: 0;
  }
}

.task-table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.task-table {
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

.task-link {
  color: $primary-color;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.progress-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  width: 60px;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: $primary-gradient;
  transition: width 0.3s;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-link {
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;

  &.view {
    color: $primary-color;
  }

  &.edit {
    color: $warning-color;
  }

  &.delete {
    color: $error-color;
  }

  &:hover {
    text-decoration: underline;
  }
}
</style>