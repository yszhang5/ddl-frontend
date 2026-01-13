import { createRouter, createWebHistory } from 'vue-router'

// 页面组件导入
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const TaskList = () => import('../views/TaskList.vue')
const TaskForm = () => import('../views/TaskForm.vue')
const TaskDetail = () => import('../views/TaskDetail.vue')
const TaskProgress = () => import('../views/TaskProgress.vue')
const Statistics = () => import('../views/Statistics.vue')
const AdminDashboard = () => import('../views/admin/Dashboard.vue')
const AdminUsers = () => import('../views/admin/Users.vue')
const AdminStatistics = () => import('../views/admin/Statistics.vue')
const Error403 = () => import('../views/errors/403.vue')
const Error500 = () => import('../views/errors/500.vue')

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guestOnly: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { guestOnly: true }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/tasks',
        name: 'TaskList',
        component: TaskList,
        meta: { requiresAuth: true }
    },
    {
        path: '/tasks/new',
        name: 'TaskForm',
        component: TaskForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/tasks/:uuid',
        name: 'TaskDetail',
        component: TaskDetail,
        meta: { requiresAuth: true }
    },
    {
        path: '/tasks/:uuid/edit',
        name: 'TaskEdit',
        component: TaskForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/tasks/:uuid/progress',
        name: 'TaskProgress',
        component: TaskProgress,
        meta: { requiresAuth: true }
    },
    {
        path: '/statistics',
        name: 'Statistics',
        component: Statistics,
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        redirect: '/admin/dashboard'
    },
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/users',
        name: 'AdminUsers',
        component: AdminUsers,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/statistics',
        name: 'AdminStatistics',
        component: AdminStatistics,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/403',
        name: 'Forbidden',
        component: Error403
    },
    {
        path: '/500',
        name: 'ServerError',
        component: Error500
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else if (to.meta.requiresAdmin && userRole !== 'ADMIN') {
        next('/403')
    } else if (to.meta.guestOnly && token) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router