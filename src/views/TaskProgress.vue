<template>
  <div class="task-progress">
    <div class="container">
      <div class="nav-header">
        <div class="nav-links">
          <router-link to="/dashboard">← 主页</router-link>
          <span class="divider">|</span>
          <router-link to="/tasks">任务列表</router-link>
          <span class="divider">|</span>
          <router-link :to="`/tasks/${task.uuid}`">任务详情</router-link>
          <span class="divider">|</span>
          <span>记录进度</span>
        </div>
      </div>

      <div class="form-card">
        <h2>记录任务进度</h2>

        <div class="task-info">
          <h3>{{ task.title }}</h3>
          <p><strong>截止时间：</strong>{{ formatDateTime(task.deadline) }}</p>
          <p><strong>当前进度：</strong>{{ task.progress }}%</p>
          <p><strong>当前状态：</strong>{{ getStatusLabel(task.status) }}</p>
        </div>

        <div v-if="errorMessage" class="message message-error">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="saveProgress">
          <div class="form-group">
            <label for="progress">进度百分比 *</label>
            <div class="progress-input-group">
              <input
                  type="number"
                  id="progress"
                  v-model="form.progress"
                  min="0"
                  max="100"
                  required
                  placeholder="0-100"
                  @input="updateProgressPreview"
              />
              <span class="progress-display">{{ form.progress }}%</span>
            </div>
            <div class="progress-bar-preview">
              <div
                  class="progress-fill-preview"
                  :style="`width: ${form.progress}%`"
              ></div>
            </div>
            <div v-if="progressError" class="error-text">{{ progressError }}</div>
          </div>

          <div class="form-group">
            <label for="progressLog">进度备注</label>
            <textarea
                id="progressLog"
                v-model="form.progressLog"
                placeholder="记录本次进度的详细说明（可选）"
            ></textarea>
            <p class="hint-text">
              提示：进度达到100%时，任务将自动标记为已完成
            </p>
          </div>

          <div class="btn-group">
            <button type="submit" class="btn btn-primary">保存进度</button>
            <router-link :to="`/tasks/${task.uuid}`" class="btn btn-secondary">
              返回
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import api from '../api'

export default {
  name: 'TaskProgress',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const task = ref({
      uuid: '',
      title: '',
      deadline: '',
      progress: 0,
      status: 'TODO'
    })

    const form = reactive({
      progress: 0,
      progressLog: ''
    })

    const errorMessage = ref('')
    const progressError = ref('')

    const getStatusLabel = (status) => {
      const labelMap = {
        'TODO': '待办',
        'IN_PROGRESS': '进行中',
        'COMPLETED': '已完成',
        'CANCELED': '已取消'
      }
      return labelMap[status] || status
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

    const updateProgressPreview = () => {
      // 验证进度值
      if (form.progress < 0) form.progress = 0
      if (form.progress > 100) form.progress = 100

      if (form.progress === 100) {
        progressError.value = '进度达到100%时，任务将自动标记为已完成'
      } else {
        progressError.value = ''
      }
    }

    const saveProgress = async () => {
      errorMessage.value = ''

      try {
        const result = await store.dispatch('updateTaskProgress', {
          uuid: task.value.uuid,
          progressData: form
        })

        if (result.success) {
          router.push(`/tasks/${task.value.uuid}`)
        } else {
          errorMessage.value = result.error
        }
      } catch (error) {
        errorMessage.value = '保存进度失败，请重试'
      }
    }

    const loadTask = async () => {
      try {
        const response = await api.tasks.getById(route.params.uuid)
        if (response.data.code === 20000) {
          task.value = response.data.data
          form.progress = task.value.progress
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
      form,
      errorMessage,
      progressError,
      getStatusLabel,
      formatDateTime,
      updateProgressPreview,
      saveProgress
    }
  }
}
</script>

<style lang="scss" scoped>
.task-progress {
  padding: 20px 0;
}

.form-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.task-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 25px;

  h3 {
    color: $text-color;
    margin-bottom: 10px;
    font-size: 18px;
  }

  p {
    color: #666;
    margin: 5px 0;
  }
}

.progress-input-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-display {
  font-size: 18px;
  font-weight: 600;
  color: $primary-color;
  min-width: 60px;
  text-align: center;
}

.progress-bar-preview {
  width: 100%;
  height: 20px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-fill-preview {
  height: 100%;
  background: $primary-gradient;
  transition: width 0.3s;
}

.hint-text {
  color: #666;
  font-size: 12px;
  margin-top: 5px;
}

.error-text {
  color: $error-color;
  font-size: 12px;
  margin-top: 5px;
}

.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>