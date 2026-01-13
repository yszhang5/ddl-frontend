<template>
  <div class="task-detail">
    <div class="container">
      <div class="nav-header">
        <div class="nav-links">
          <router-link to="/dashboard">← 主页</router-link>
          <span class="divider">|</span>
          <router-link to="/tasks">任务列表</router-link>
          <span class="divider">|</span>
          <span>任务详情</span>
        </div>
      </div>

      <div class="detail-card">
        <div class="detail-header">
          <h2>{{ task.title }}</h2>
          <div class="detail-actions">
            <router-link :to="`/tasks/${task.uuid}/progress`" class="btn btn-primary">
              记录进度
            </router-link>
            <router-link :to="`/tasks/${task.uuid}/edit`" class="btn btn-warning">
              编辑
            </router-link>
            <button @click="deleteTask" class="btn btn-danger">删除</button>
          </div>
        </div>

        <div v-if="successMessage" class="message message-success">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="message message-error">
          {{ errorMessage }}
        </div>

        <div class="detail-info">
          <div class="info-item">
            <div class="info-label">任务状态</div>
            <div class="info-value">
              <span :class="getStatusClass(task.status)">
                {{ getStatusLabel(task.status) }}
              </span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">优先级</div>
            <div class="info-value">
              <span :class="`priority-${task.priority.toLowerCase()}`">
                {{ getPriorityLabel(task.priority) }}
              </span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">分类</div>
            <div class="info-value">{{ task.category || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">截止时间</div>
            <div class="info-value">{{ formatDateTime(task.deadline) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">创建时间</div>
            <div class="info-value">{{ formatDateTime(task.createTime) }}</div>
          </div>
          <div class="info-item" v-if="task.completedTime">
            <div class="info-label">完成时间</div>
            <div class="info-value">{{ formatDateTime(task.completedTime) }}</div>
          </div>
        </div>

        <div class="info-item">
          <div class="info-label">任务进度</div>
          <div class="info-value">
            <div class="progress-bar">
              <div class="progress-fill" :style="`width: ${task.progress}%`"></div>
            </div>
            <div class="progress-text">{{ task.progress }}%</div>
            <div class="progress-action">
              <router-link :to="`/tasks/${task.uuid}/progress`" class="btn btn-primary">
                更新进度
              </router-link>
            </div>
          </div>
        </div>

        <div v-if="task.description" class="description">
          <div class="info-label">任务描述</div>
          <div class="description-content">{{ task.description }}</div>
        </div>

        <div v-if="task.progressLog" class="progress-log">
          <div class="info-label">进度备注</div>
          <div class="progress-log-content">{{ task.progressLog }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import api from '../api'

export default {
  name: 'TaskDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const task = ref({
      uuid: '',
      title: '',
      category: '',
      priority: 'MEDIUM',
      status: 'TODO',
      progress: 0,
      deadline: '',
      createTime: '',
      completedTime: null,
      description: '',
      progressLog: ''
    })

    const successMessage = ref('')
    const errorMessage = ref('')

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

    const formatDateTime = (dateTime) => {
      if (!dateTime) return '-'
      return new Date(dateTime).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const deleteTask = async () => {
      if (!confirm('确定要删除这个任务吗？')) {
        return
      }

      try {
        const result = await store.dispatch('deleteTask', task.value.uuid)
        if (result.success) {
          successMessage.value = result.message
          setTimeout(() => {
            router.push('/tasks')
          }, 1000)
        } else {
          errorMessage.value = result.error
        }
      } catch (error) {
        errorMessage.value = '删除失败，请重试'
      }
    }

    const loadTask = async () => {
      try {
        const response = await api.tasks.getById(route.params.uuid)
        if (response.data.code === 20000) {
          task.value = response.data.data
        }
      } catch (error) {
        console.error('加载任务详情失败:', error)
        errorMessage.value = '加载任务详情失败'
      }
    }

    onMounted(() => {
      loadTask()
    })

    return {
      task,
      successMessage,
      errorMessage,
      getStatusClass,
      getStatusLabel,
      getPriorityLabel,
      formatDateTime,
      deleteTask
    }
  }
}
</script>

<style lang="scss" scoped>
.task-detail {
  padding: 20px 0;
}

.detail-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;

  h2 {
    color: $text-color;
  }
}

.detail-actions {
  display: flex;
  gap: 10px;
}

.detail-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  .info-label {
    color: $text-secondary;
    font-size: 14px;
    margin-bottom: 5px;
  }

  .info-value {
    color: $text-color;
    font-size: 16px;
    font-weight: 500;
  }
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-fill {
  height: 100%;
  background: $primary-gradient;
  transition: width 0.3s;
}

.progress-text {
  text-align: center;
  margin-top: 5px;
  font-weight: 600;
}

.progress-action {
  text-align: center;
  margin-top: 10px;
}

.description, .progress-log {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}

.description-content, .progress-log-content {
  margin-top: 10px;
  color: #333;
}

.message {
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;

  &-success {
    background: #d4edda;
    color: #155724;
  }

  &-error {
    background: #f8d7da;
    color: #721c24;
  }
}
</style>