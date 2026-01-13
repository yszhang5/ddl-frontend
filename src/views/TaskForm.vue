<template>
  <div class="task-form">
    <div class="container">
      <!-- 导航栏 -->
      <div class="nav-header">
        <div class="nav-links">
          <router-link to="/dashboard">← 主页</router-link>
          <span class="divider">|</span>
          <router-link to="/tasks">任务列表</router-link>
          <span class="divider">|</span>
          <span>{{ isEdit ? '编辑任务' : '新建任务' }}</span>
        </div>
      </div>

      <div class="form-card">
        <h2>{{ isEdit ? '编辑任务' : '新建任务' }}</h2>

        <!-- 消息提示 -->
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">任务标题 *</label>
            <input
                type="text"
                id="title"
                v-model="form.title"
                required
                placeholder="请输入任务标题"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category">分类</label>
              <select id="category" v-model="form.category">
                <option value="">请选择分类</option>
                <option value="学习">学习</option>
                <option value="生活">生活</option>
                <option value="工作">工作</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div class="form-group">
              <label for="priority">优先级</label>
              <select id="priority" v-model="form.priority">
                <option value="LOW">低</option>
                <option value="MEDIUM" selected>中</option>
                <option value="HIGH">高</option>
                <option value="URGENT">紧急</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="status">状态</label>
            <select id="status" v-model="form.status">
              <option value="TODO" selected>待办</option>
              <option value="IN_PROGRESS">进行中</option>
              <option value="COMPLETED">已完成</option>
              <option value="CANCELED">已取消</option>
            </select>
          </div>

          <div class="form-group">
            <label for="deadline">截止时间 *</label>
            <!-- 隐藏的原始输入 -->
            <input
                type="datetime-local"
                id="deadline"
                v-model="form.deadline"
                class="hidden-input"
                required
            />

            <!-- 自定义日期时间选择器 -->
            <div class="datetime-input-container">
              <div class="datetime-display" id="datetimeDisplay" @click="toggleDateTimePicker">
                <div class="datetime-parts">
                  <div class="datetime-part" data-type="year">
                    <span class="datetime-value" id="yearValue">{{ currentDateTime.year }}</span>
                    <div class="datetime-arrows">
                      <div class="datetime-arrow up" data-type="year" @click.stop="adjustDateTime('year', true)"></div>
                      <div class="datetime-arrow down" data-type="year" @click.stop="adjustDateTime('year', false)"></div>
                    </div>
                  </div>
                  <span class="datetime-separator">年</span>
                  <div class="datetime-part" data-type="month">
                    <span class="datetime-value" id="monthValue">{{ currentDateTime.month }}</span>
                    <div class="datetime-arrows">
                      <div class="datetime-arrow up" data-type="month" @click.stop="adjustDateTime('month', true)"></div>
                      <div class="datetime-arrow down" data-type="month" @click.stop="adjustDateTime('month', false)"></div>
                    </div>
                  </div>
                  <span class="datetime-separator">月</span>
                  <div class="datetime-part" data-type="day">
                    <span class="datetime-value" id="dayValue">{{ currentDateTime.day }}</span>
                    <div class="datetime-arrows">
                      <div class="datetime-arrow up" data-type="day" @click.stop="adjustDateTime('day', true)"></div>
                      <div class="datetime-arrow down" data-type="day" @click.stop="adjustDateTime('day', false)"></div>
                    </div>
                  </div>
                  <span class="datetime-separator">日</span>
                  <div class="datetime-part" data-type="hour">
                    <span class="datetime-value" id="hourValue">{{ currentDateTime.hour.toString().padStart(2, '0') }}</span>
                    <div class="datetime-arrows">
                      <div class="datetime-arrow up" data-type="hour" @click.stop="adjustDateTime('hour', true)"></div>
                      <div class="datetime-arrow down" data-type="hour" @click.stop="adjustDateTime('hour', false)"></div>
                    </div>
                  </div>
                  <span class="datetime-separator">:</span>
                  <div class="datetime-part" data-type="minute">
                    <span class="datetime-value" id="minuteValue">{{ currentDateTime.minute.toString().padStart(2, '0') }}</span>
                    <div class="datetime-arrows">
                      <div class="datetime-arrow up" data-type="minute" @click.stop="adjustDateTime('minute', true)"></div>
                      <div class="datetime-arrow down" data-type="minute" @click.stop="adjustDateTime('minute', false)"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 滑动选择器 -->
              <div class="slider-picker" :class="{ active: showDateTimePicker }">
                <div class="slider-container">
                  <div class="slider-values">
                    <div class="slider-scroll" :style="{ transform: `translateY(${sliderPosition}px)` }">
                      <div
                          v-for="(value, index) in sliderValues"
                          :key="index"
                          class="slider-value"
                          :class="{ active: index === currentSliderIndex }"
                          @click="selectSliderValue(index)"
                      >
                        {{ value }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="slider-actions">
                  <button type="button" class="slider-btn slider-cancel" @click="cancelDateTimePicker">取消</button>
                  <button type="button" class="slider-btn slider-confirm" @click="confirmDateTimePicker">确定</button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="description">任务描述</label>
            <textarea
                id="description"
                v-model="form.description"
                placeholder="请输入任务描述（可选）"
            ></textarea>
          </div>

          <div class="btn-group">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? (isEdit ? '更新中...' : '创建中...') : (isEdit ? '更新任务' : '创建任务') }}
            </button>
            <router-link to="/tasks" class="btn btn-secondary">取消</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import api from '../api'

export default {
  name: 'TaskForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const isEdit = computed(() => route.name === 'TaskEdit')
    const taskUuid = computed(() => route.params.uuid)

    const form = reactive({
      title: '',
      category: '',
      priority: 'MEDIUM',
      status: 'TODO',
      deadline: '',
      description: ''
    })

    const currentDateTime = reactive({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes()
    })

    const showDateTimePicker = ref(false)
    const currentDateTimePart = ref('')
    const sliderValues = ref([])
    const currentSliderIndex = ref(0)
    const sliderPosition = ref(0)

    const loading = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    // 计算当前选中的日期时间部分的值
    const currentDateTimeValue = computed(() => {
      return currentDateTime[currentDateTimePart.value]
    })

    // 生成滑动选择器的值
    const generateSliderValues = (part) => {
      sliderValues.value = []

      switch(part) {
        case 'year':
          // 生成前后10年的选项
          for (let i = currentDateTime.year - 10; i <= currentDateTime.year + 10; i++) {
            sliderValues.value.push(i)
          }
          break
        case 'month':
          // 生成1-12月
          for (let i = 1; i <= 12; i++) {
            sliderValues.value.push(i)
          }
          break
        case 'day':
          // 生成1-31日（根据月份和年份调整）
          const daysInMonth = new Date(currentDateTime.year, currentDateTime.month, 0).getDate()
          for (let i = 1; i <= daysInMonth; i++) {
            sliderValues.value.push(i)
          }
          break
        case 'hour':
          // 生成0-23时
          for (let i = 0; i < 24; i++) {
            sliderValues.value.push(i.toString().padStart(2, '0'))
          }
          break
        case 'minute':
          // 生成0-59分
          for (let i = 0; i < 60; i++) {
            sliderValues.value.push(i.toString().padStart(2, '0'))
          }
          break
      }

      // 设置当前索引
      currentSliderIndex.value = sliderValues.value.indexOf(currentDateTimeValue.value)
      if (currentSliderIndex.value === -1) {
        currentSliderIndex.value = 0
      }

      updateSliderPosition()
    }

    // 更新滑动选择器位置
    const updateSliderPosition = () => {
      const valueHeight = 30
      const centerOffset = 75 // 150px高度的一半减去15px
      sliderPosition.value = centerOffset - (currentSliderIndex.value * valueHeight)
    }

    // 调整日期时间值
    const adjustDateTime = (part, isIncrease) => {
      let value = currentDateTime[part]

      switch(part) {
        case 'year':
          value += isIncrease ? 1 : -1
          break
        case 'month':
          value += isIncrease ? 1 : -1
          if (value < 1) value = 12
          if (value > 12) value = 1
          break
        case 'day':
          const daysInMonth = new Date(currentDateTime.year, currentDateTime.month, 0).getDate()
          value += isIncrease ? 1 : -1
          if (value < 1) value = daysInMonth
          if (value > daysInMonth) value = 1
          break
        case 'hour':
          value += isIncrease ? 1 : -1
          if (value < 0) value = 23
          if (value > 23) value = 0
          break
        case 'minute':
          value += isIncrease ? 1 : -1
          if (value < 0) value = 59
          if (value > 59) value = 0
          break
      }

      currentDateTime[part] = value
      updateHiddenInput()
    }

    // 切换日期时间选择器显示
    const toggleDateTimePicker = (part) => {
      if (part && typeof part === 'string') {
        currentDateTimePart.value = part
        generateSliderValues(part)
        showDateTimePicker.value = true
      } else if (showDateTimePicker.value) {
        showDateTimePicker.value = false
      }
    }

    // 选择滑动选择器的值
    const selectSliderValue = (index) => {
      currentSliderIndex.value = index
      const value = sliderValues.value[index]
      currentDateTime[currentDateTimePart.value] = typeof value === 'string' ? parseInt(value) : value
      updateHiddenInput()
      showDateTimePicker.value = false
    }

    // 确认日期时间选择
    const confirmDateTimePicker = () => {
      const value = sliderValues.value[currentSliderIndex.value]
      currentDateTime[currentDateTimePart.value] = typeof value === 'string' ? parseInt(value) : value
      updateHiddenInput()
      showDateTimePicker.value = false
    }

    // 取消日期时间选择
    const cancelDateTimePicker = () => {
      showDateTimePicker.value = false
    }

    // 更新隐藏的输入框
    const updateHiddenInput = () => {
      const year = currentDateTime.year
      const month = currentDateTime.month.toString().padStart(2, '0')
      const day = currentDateTime.day.toString().padStart(2, '0')
      const hour = currentDateTime.hour.toString().padStart(2, '0')
      const minute = currentDateTime.minute.toString().padStart(2, '0')

      form.deadline = `${year}-${month}-${day}T${hour}:${minute}`
    }

    // 处理表单提交
    const handleSubmit = async () => {
      loading.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        let result
        if (isEdit.value) {
          result = await store.dispatch('updateTask', {
            uuid: taskUuid.value,
            taskData: form
          })
        } else {
          result = await store.dispatch('createTask', form)
        }

        if (result.success) {
          successMessage.value = result.message
          setTimeout(() => {
            router.push('/tasks')
          }, 1000)
        } else {
          errorMessage.value = result.error
        }
      } catch (error) {
        errorMessage.value = isEdit.value ? '更新任务失败' : '创建任务失败'
      } finally {
        loading.value = false
      }
    }

    // 加载任务数据（编辑模式）
    const loadTask = async () => {
      if (!isEdit.value) return

      try {
        const response = await api.tasks.getById(taskUuid.value)
        if (response.data.code === 20000) {
          const task = response.data.data

          // 填充表单数据
          Object.keys(form).forEach(key => {
            if (task[key] !== undefined) {
              form[key] = task[key]
            }
          })

          // 解析截止时间
          if (task.deadline) {
            const date = new Date(task.deadline)
            currentDateTime.year = date.getFullYear()
            currentDateTime.month = date.getMonth() + 1
            currentDateTime.day = date.getDate()
            currentDateTime.hour = date.getHours()
            currentDateTime.minute = date.getMinutes()
            updateHiddenInput()
          }
        }
      } catch (error) {
        console.error('加载任务详情失败:', error)
        errorMessage.value = '加载任务详情失败'
      }
    }

    // 初始化日期时间
    const initDateTime = () => {
      if (!form.deadline) {
        const now = new Date()
        currentDateTime.year = now.getFullYear()
        currentDateTime.month = now.getMonth() + 1
        currentDateTime.day = now.getDate()
        currentDateTime.hour = now.getHours()
        currentDateTime.minute = now.getMinutes()
        updateHiddenInput()
      }
    }

    onMounted(() => {
      initDateTime()
      loadTask()

      // 点击外部关闭日期时间选择器
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.datetime-input-container')) {
          showDateTimePicker.value = false
        }
      })
    })

    // 监听日期时间变化，更新隐藏输入框
    watch(currentDateTime, () => {
      updateHiddenInput()
    }, { deep: true })

    return {
      isEdit,
      form,
      currentDateTime,
      showDateTimePicker,
      sliderValues,
      currentSliderIndex,
      sliderPosition,
      loading,
      successMessage,
      errorMessage,
      adjustDateTime,
      toggleDateTimePicker,
      selectSliderValue,
      confirmDateTimePicker,
      cancelDateTimePicker,
      handleSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.task-form {
  padding: 20px 0;
}

.form-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

/* 自定义日期时间选择器样式 */
.datetime-input-container {
  position: relative;
}

.datetime-display {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid $border-color;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.datetime-display:hover {
  border-color: $primary-color;
}

.datetime-display:focus-within {
  border-color: $primary-color;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.datetime-display.active {
  border-color: $primary-color;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.datetime-parts {
  display: flex;
  align-items: center;
  flex: 1;
}

.datetime-part {
  display: flex;
  align-items: center;
  margin: 0 5px;
  position: relative;
}

.datetime-value {
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.datetime-value:hover {
  background-color: #f0f0f0;
}

.datetime-value.active {
  background-color: #e6eeff;
  color: $primary-color;
}

.datetime-separator {
  margin: 0 2px;
  color: #666;
}

.datetime-arrows {
  display: none;
  flex-direction: column;
  margin-left: 5px;
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.datetime-part:hover .datetime-arrows {
  display: flex;
}

.datetime-arrow {
  width: 20px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  font-size: 10px;
  transition: all 0.2s;
}

.datetime-arrow:hover {
  color: $primary-color;
  background-color: #f5f5f5;
}

.datetime-arrow.up::after {
  content: "▲";
}

.datetime-arrow.down::after {
  content: "▼";
}

.datetime-icon {
  margin-left: 10px;
  color: $primary-color;
}

/* 滑动选择器样式 */
.slider-picker {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid $border-color;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: none;
  padding: 15px;
  margin-top: 5px;
}

.slider-picker.active {
  display: block;
}

.slider-container {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.slider-values {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.slider-scroll {
  transition: transform 0.2s ease-out;
}

.slider-value {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 3px;
}

.slider-value:hover {
  background-color: #f5f5f5;
}

.slider-value.active {
  color: $primary-color;
  font-weight: bold;
  background-color: #e6eeff;
}

.slider-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.slider-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
}

.slider-confirm {
  background: $primary-color;
  color: white;
}

.slider-cancel {
  background: #f0f0f0;
  color: #666;
}

/* 隐藏原始输入框 */
.hidden-input {
  display: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .datetime-parts {
    flex-wrap: wrap;
    justify-content: center;
  }

  .datetime-part {
    margin: 5px;
  }
}
</style>