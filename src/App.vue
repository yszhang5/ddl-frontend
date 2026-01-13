<template>
  <div id="app">
    <Navbar v-if="isAuthenticated && !isAdminRoute" />
    <AdminNavbar v-if="isAuthenticated && isAdminRoute" />
    <main :class="{'admin-layout': isAdminRoute}">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Navbar from './components/Navbar.vue'
import AdminNavbar from './components/admin/AdminNavbar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    AdminNavbar
  },
  setup() {
    const route = useRoute()
    const store = useStore()

    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const isAdminRoute = computed(() => route.path.startsWith('/admin'))

    return {
      isAuthenticated,
      isAdminRoute
    }
  }
}
</script>

<style lang="scss">
#app {
  min-height: 100vh;
}

main {
  padding-top: 0;
}

.admin-layout {
  padding-top: 0;
}
</style>