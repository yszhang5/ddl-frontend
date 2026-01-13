<template>
  <div class="register-container">
    <div class="register-box">
      <h1>用户注册</h1>

      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
              type="text"
              id="username"
              v-model="form.username"
              required
              placeholder="请输入用户名（3-50个字符）"
          />
        </div>

        <div class="form-group">
          <label for="email">邮箱</label>
          <input
              type="email"
              id="email"
              v-model="form.email"
              required
              placeholder="请输入邮箱"
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
              type="password"
              id="password"
              v-model="form.password"
              required
              placeholder="请输入密码（至少6个字符）"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
              type="password"
              id="confirmPassword"
              v-model="form.confirmPassword"
              required
              placeholder="请再次输入密码"
          />
        </div>

        <div class="form-group avatar-upload">
          <label>用户头像</label>
          <input
              type="file"
              id="avatarFile"
              accept="image/jpg,image/jpeg,image/png,image/gif"
              @change="handleAvatarSelect"
          />
          <input type="file" id="compressedAvatar" style="display: none" />
          <label class="avatar-preview-label">头像预览（自动压缩至500KB以内）</label>
          <img id="avatarPreview" class="avatar-preview" :src="defaultAvatar" />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <div class="login-link">
        已有账号？<router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import api from '../api'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const store = useStore()

    const form = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      avatar: null
    })

    const loading = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')
    const defaultAvatar = ref('/images/default-avatar.png')

    const handleAvatarSelect = (event) => {
      // 头像处理逻辑（压缩等）
      const file = event.target.files[0]
      if (file) {
        // 这里可以添加头像压缩逻辑
        form.avatar = file
        const reader = new FileReader()
        reader.onload = (e) => {
          document.getElementById('avatarPreview').src = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const handleRegister = async () => {
      loading.value = true
      errorMessage.value = ''

      // 表单验证
      if (form.password !== form.confirmPassword) {
        errorMessage.value = '两次输入的密码不一致'
        loading.value = false
        return
      }

      if (form.password.length < 6) {
        errorMessage.value = '密码长度至少6个字符'
        loading.value = false
        return
      }

      try {
        const result = await store.dispatch('register', form)

        if (result.success) {
          successMessage.value = result.message
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else {
          errorMessage.value = result.error
        }
      } catch (error) {
        errorMessage.value = '注册失败，请重试'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      errorMessage,
      successMessage,
      defaultAvatar,
      handleAvatarSelect,
      handleRegister
    }
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: $primary-gradient;
  padding: 20px;
}

.register-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.register-box h1 {
  text-align: center;
  color: $text-color;
  margin-bottom: 30px;
}

.avatar-upload {
  margin-bottom: 15px;
}

.avatar-upload input[type="file"] {
  padding: 10px 15px;
  border: 1px dashed #e2e8f0;
  background-color: #f7fafc;
  cursor: pointer;
  margin-bottom: 10px;
  width: 100%;
}

.avatar-upload input[type="file"]:hover {
  border-color: $primary-color;
  background-color: #f0f4ff;
}

.avatar-preview-label {
  display: block;
  margin-bottom: 8px;
  color: #4a5568;
  font-size: 14px;
  font-weight: 500;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto;
  display: block;
  object-fit: cover;
  border: 3px solid #f7fafc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: $text-secondary;

  a {
    color: $primary-color;
    text-decoration: none;
  }
}
</style>