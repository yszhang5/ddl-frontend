// Mock数据配置
export const MOCK_MODE = false // 设置为true启用mock模式

// Mock测试账号
export const MOCK_USERS = {
  testuser: {
    username: 'testuser',
    password: '123456',
    email: 'test@example.com',
    role: 'USER',
    id: 'mock-user-1'
  },
  admin: {
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    role: 'ADMIN',
    id: 'mock-admin-1'
  }
}

// Mock任务数据
export const MOCK_TASKS = [
  {
    uuid: 'task-1',
    title: '完成项目文档',
    description: '编写项目需求文档和技术文档',
    status: 'TODO',
    priority: 'HIGH',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    uuid: 'task-2',
    title: '代码审查',
    description: '审查团队成员提交的代码',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    uuid: 'task-3',
    title: '修复登录bug',
    description: '修复用户登录时的验证问题',
    status: 'COMPLETED',
    priority: 'URGENT',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    uuid: 'task-4',
    title: '优化数据库查询',
    description: '优化慢查询，提升系统性能',
    status: 'TODO',
    priority: 'MEDIUM',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    uuid: 'task-5',
    title: '准备技术分享',
    description: '准备下周的技术分享PPT',
    status: 'IN_PROGRESS',
    priority: 'LOW',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Mock统计数据
export const MOCK_STATISTICS = {
  totalTasks: 5,
  completedTasks: 1,
  inProgressTasks: 2,
  pendingTasks: 2,
  overdueTasks: 0
}

// Mock用户列表（管理员用）
export const MOCK_USERS_LIST = [
  {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-2',
    username: 'admin',
    email: 'admin@example.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-3',
    username: 'demo',
    email: 'demo@example.com',
    role: 'USER',
    status: 'INACTIVE',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// 生成mock token
export function generateMockToken(username) {
  return `mock-token-${username}-${Date.now()}`
}

// 模拟API延迟
export function mockDelay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
