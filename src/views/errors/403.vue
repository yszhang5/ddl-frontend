<template>
  <div class="error-container">
    <div class="error-box">
      <h1>403</h1>
      <h2>访问被拒绝</h2>
      <p>您没有权限访问此页面</p>
      <router-link to="/" class="btn btn-primary">返回首页</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error403'
}
</script>

<style lang="scss" scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: $bg-color;
  padding: 20px;
}

.error-box {
  text-align: center;
  background: white;
  padding: 60px 40px;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 80px;
    color: $error-color;
    margin-bottom: 10px;
  }

  h2 {
    color: $text-color;
    margin-bottom: 20px;
  }

  p {
    color: $text-secondary;
    margin-bottom: 30px;
  }
}
</style>