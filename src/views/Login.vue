<template>
  <div class="login-container">
    <div class="login-box">
      <h1>DDL管理系统</h1>

      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
              type="text"
              id="username"
              v-model="form.username"
              required
              placeholder="请输入用户名"
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
              type="password"
              id="password"
              v-model="form.password"
              required
              placeholder="请输入密码"
          />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="login-footer">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()

    const form = reactive({
      username: '',
      password: ''
    })

    const loading = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')

    onMounted(() => {
      // 检查URL参数，显示相应消息
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('error')) {
        errorMessage.value = '用户名或密码错误'
      }
      if (urlParams.get('logout')) {
        successMessage.value = '已成功登出'
      }
    })

    const handleLogin = async () => {
      loading.value = true
      errorMessage.value = ''

      try {
        const result = await store.dispatch('login', form)

        if (result.success) {
          router.push('/dashboard')
        } else {
          errorMessage.value = result.error
        }
      } catch (error) {
        errorMessage.value = '登录失败，请重试'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      errorMessage,
      successMessage,
      handleLogin
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: $primary-gradient;
  padding: 20px;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.login-box h1 {
  text-align: center;
  color: $text-color;
  margin-bottom: 30px;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  color: $text-secondary;

  a {
    color: $primary-color;
    text-decoration: none;
  }
}
</style>