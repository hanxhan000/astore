<template>
  <div class="page">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="username" name="username" label="用户名" placeholder="请输入用户名" type="text" required />
        <van-field v-model="password" name="password" label="密码" placeholder="请输入密码" type="password" required />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">登录</van-button>
        <van-button round block type="default" style="margin-top:8px" @click="goRegister">去注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signIn } from '../services/supabase'
import { showToast } from 'vant'

const router = useRouter()
const username = ref('')
const password = ref('')

async function onSubmit() {
  try {
    await signIn({ username: username.value, password: password.value })
    showToast('登录成功')
    router.replace('/onboarding')
  } catch (e) {
    showToast(e.message || '登录失败')
  }
}
function goRegister() { router.push('/register') }
</script>

<style scoped>
.page { padding: 12px; }
</style>