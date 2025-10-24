<template>
  <div class="page">
    <el-card class="card">
      <template #header>
        <div class="card-header">K线与技术指标</div>
      </template>
      <ChartKLine :symbol="symbol" />
    </el-card>
    <el-card class="card">
      <template #header>
        <div class="card-header">策略信号（示例）</div>
      </template>
      <van-space wrap>
        <van-tag type="success">均线金叉：观测中</van-tag>
        <van-tag type="warning">MACD底背离：可能形成</van-tag>
        <van-tag type="primary">半仓持股：执行中</van-tag>
      </van-space>
    </el-card>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import ChartKLine from '../components/ChartKLine.vue'

const route = useRoute()
const symbol = route.params.symbol
</script>

<style scoped>
.page { padding: 12px; }
.card { margin-bottom: 12px; }
.card-header { font-weight: 600; }
</style>