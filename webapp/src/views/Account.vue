<template>
  <div class="page">
    <van-cell-group inset>
      <van-cell title="账户金额" :value="amountDisplay" />
      <van-cell title="币种" :value="currency" />
      <van-cell title="风险偏好" :value="riskLabel" />
    </van-cell-group>
    <van-button block type="primary" style="margin-top:8px" @click="goOnboarding">修改设置</van-button>
    <van-button block type="danger" style="margin-top:8px" @click="logout">退出登录</van-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signOut, loadAccount } from '../services/supabase'

const router = useRouter()
const amountDisplay = ref('-')
const currency = ref('CNY')
const riskLabel = ref('-')

onMounted(async () => {
  try {
    const account = await loadAccount()
    if (account) {
      amountDisplay.value = String(account.amount ?? '-')
      currency.value = account.currency ?? 'CNY'
      const riskMap = { conservative: '保守', balanced: '稳健', aggressive: '积极' }
      riskLabel.value = riskMap[account.risk] || '-'
    }
  } catch (error) {
    console.error('Failed to load account:', error)
  }
})

function goOnboarding() { router.push('/onboarding') }
async function logout() { await signOut(); router.replace('/login') }
</script>

<style scoped>
.page { padding: 12px; }
</style>