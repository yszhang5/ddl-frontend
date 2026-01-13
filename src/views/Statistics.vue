<template>
  <div class="statistics">
    <div class="container">
      <div class="nav-header">
        <div class="nav-links">
          <router-link to="/dashboard">← 主页</router-link>
          <span class="divider">|</span>
          <router-link to="/tasks">任务列表</router-link>
          <span class="divider">|</span>
          <span>API统计</span>
        </div>
      </div>

      <h2>API调用统计分析</h2>

      <div class="action-buttons">
        <button @click="loadStatisticsData" class="btn">刷新数据</button>
        <button @click="resetStatisticsData" class="btn btn-danger">重置统计数据</button>
      </div>

      <div class="chart-row">
        <div class="card">
          <h3>调用次数分布</h3>
          <canvas id="callDistributionChart"></canvas>
        </div>
        <div class="card">
          <h3>最近调用时间</h3>
          <canvas id="lastCallChart"></canvas>
        </div>
      </div>

      <div class="card">
        <h3>详细统计数据</h3>
        <div class="table-responsive">
          <table class="table">
            <thead>
            <tr>
              <th>API名称</th>
              <th>接口路径</th>
              <th>调用次数</th>
              <th>首次调用时间</th>
              <th>最近调用时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="statistics.length === 0">
              <td colspan="5" class="text-center">暂无API调用统计数据</td>
            </tr>
            <tr v-for="stat in statistics" :key="stat.apiPath">
              <td>{{ stat.apiName || '未知API' }}</td>
              <td>{{ stat.apiPath || '未知路径' }}</td>
              <td>{{ stat.callCount || 0 }}</td>
              <td>{{ formatTime(stat.firstCallTime) }}</td>
              <td>{{ formatTime(stat.lastCallTime) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'
import api from '../api'

export default {
  name: 'Statistics',
  setup() {
    const statistics = ref([])
    let callDistributionChart = null
    let lastCallChart = null

    const formatTime = (timestamp) => {
      if (!timestamp || timestamp === 0) return "暂无时间"
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-')
    }

    const renderCharts = (statisticsData) => {
      if (!statisticsData || statisticsData.length === 0) return

      // 销毁原有图表
      if (callDistributionChart) {
        callDistributionChart.destroy()
      }
      if (lastCallChart) {
        lastCallChart.destroy()
      }

      // 调用次数分布图表
      const ctx1 = document.getElementById('callDistributionChart').getContext('2d')
      callDistributionChart = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: statisticsData.map(stat => stat.apiName || '未知API'),
          datasets: [{
            label: '调用次数',
            data: statisticsData.map(stat => stat.callCount || 0),
            backgroundColor: 'rgba(102, 126, 234, 0.5)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } }
          }
        }
      })

      // 最近调用时间图表
      const ctx2 = document.getElementById('lastCallChart').getContext('2d')
      lastCallChart = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: statisticsData.map(stat => stat.apiName || '未知API'),
          datasets: [{
            label: '最近调用时间',
            data: statisticsData.map(stat => stat.lastCallTime || 0),
            fill: false,
            borderColor: 'rgba(118, 75, 162, 1)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                callback: function(value) {
                  return formatTime(value)
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const timestamp = context.raw
                  return `最近调用时间：${formatTime(timestamp)}`
                }
              }
            }
          }
        }
      })
    }

    const loadStatisticsData = async () => {
      try {
        const response = await api.statistics.getApiStats()
        if (response.data.code === 20000) {
          statistics.value = response.data.data
          renderCharts(statistics.value)
        }
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    }

    const resetStatisticsData = async () => {
      if (!confirm('确定要重置所有API统计数据吗？此操作不可恢复！')) {
        return
      }

      try {
        const response = await api.statistics.resetApiStats()
        if (response.data.code === 20000) {
          loadStatisticsData() // 重新加载数据
        }
      } catch (error) {
        console.error('重置统计数据失败:', error)
      }
    }

    onMounted(() => {
      loadStatisticsData()
    })

    return {
      statistics,
      formatTime,
      loadStatisticsData,
      resetStatisticsData
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics {
  padding: 20px 0;
}

.action-buttons {
  margin-bottom: 20px;

  .btn {
    margin-right: 10px;
  }
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

canvas {
  width: 100% !important;
  height: 300px !important;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #f8f9fa;
    color: $text-color;
    font-weight: 600;
  }

  tr:hover {
    background-color: #f8f9fa;
  }
}

.text-center {
  text-align: center;
  color: $text-secondary;
}
</style>