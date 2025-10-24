<template>
  <div class="page">
    <el-page-header content="A股动态分析看板" />
    <div class="grid">
      <el-card class="card">
        <template #header>
          <div class="card-header">大盘指数快照</div>
        </template>
        <div id="chart-index" class="chart"></div>
      </el-card>
      <el-card class="card">
        <template #header>
          <div class="card-header">自选股列表</div>
        </template>
        <el-table :data="watchlist" size="small" style="width: 100%">
          <el-table-column prop="symbol" label="代码" width="100"/>
          <el-table-column prop="name" label="名称"/>
          <el-table-column prop="price" label="现价" width="100"/>
          <el-table-column prop="change" label="涨跌幅" width="100"/>
          <el-table-column label="操作" width="120">
            <template #default="{row}">
              <el-button size="small" type="primary" @click="goto(row.symbol)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const watchlist = ref([
  { symbol: '000001', name: '平安银行', price: 10.5, change: '+0.80%' },
  { symbol: '600519', name: '贵州茅台', price: 1650, change: '-0.20%' }
])

onMounted(() => {
  const chart = echarts.init(document.getElementById('chart-index'))
  chart.setOption({
    tooltip: {},
    xAxis: { type: 'category', data: ['上证','深证','创业板'] },
    yAxis: { type: 'value' },
    grid: { left: 30, right: 10, top: 20, bottom: 20 },
    series: [{ type: 'bar', data: [3021, 9470, 1998] }]
  })
})

function goto(symbol) {
  router.push(`/stock/${symbol}`)
}
</script>

<style scoped>
.page { padding: 12px; }
.grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 768px) {
  .grid { grid-template-columns: 1fr 1fr; }
}
.card { min-height: 320px; }
.card-header { font-weight: 600; }
.chart { height: 240px; width: 100%; }
</style>