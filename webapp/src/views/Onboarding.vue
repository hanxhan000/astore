<template>
  <div class="page">
    <van-steps :active="step" finish-icon="success"> 
      <van-step>账户金额</van-step>
      <van-step>风险偏好</van-step>
      <van-step>自选股</van-step>
    </van-steps>

    <div v-if="step===0" class="card">
      <van-field v-model.number="amount" label="资金金额" type="number" placeholder="请输入账户总金额" />
      <van-field v-model="currency" label="币种" placeholder="如 CNY" />
      <van-button block type="primary" @click="next">下一步</van-button>
    </div>

    <div v-else-if="step===1" class="card">
      <van-radio-group v-model="risk">
        <van-cell-group>
          <van-cell title="保守" clickable @click="risk='conservative'">
            <template #right-icon><van-radio name="conservative" /></template>
          </van-cell>
          <van-cell title="稳健" clickable @click="risk='balanced'">
            <template #right-icon><van-radio name="balanced" /></template>
          </van-cell>
          <van-cell title="积极" clickable @click="risk='aggressive'">
            <template #right-icon><van-radio name="aggressive" /></template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-button block type="primary" @click="next">下一步</van-button>
    </div>

    <div v-else class="card">
      <van-field v-model="symbol" label="添加股票" placeholder="输入代码如 000001" />
      <van-button type="primary" block @click="add">添加到自选</van-button>
      <van-cell-group>
        <van-cell v-for="s in watchlist" :key="s" :title="s" />
      </van-cell-group>
      <van-button type="success" block style="margin-top:8px" @click="finish">完成并保存</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { saveAccount, saveWatchlist, markOnboarded } from '../services/supabase'
import { showToast } from 'vant'

const router = useRouter()
const step = ref(0)
const amount = ref()
const currency = ref('CNY')
const risk = ref('balanced')
const symbol = ref('')
const watchlist = ref(['000001'])

function next() { step.value++ }
function add() { if (symbol.value) { watchlist.value.push(symbol.value); symbol.value='' } }

async function finish() {
  try {
    await saveAccount({ amount: amount.value, currency: currency.value, risk: risk.value })
    await saveWatchlist(watchlist.value)
    await markOnboarded(true)
    showToast('保存成功')
    router.replace('/')
  } catch (e) {
    showToast(e.message || '保存失败')
  }
}
</script>

<style scoped>
.page { padding: 12px; }
.card { margin-top: 12px; }
</style>