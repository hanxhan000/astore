<template>
  <div class="page">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="username" name="username" label="用户名" placeholder="请输入用户名" type="text" required />
        <van-field v-model="password" name="password" label="密码" placeholder="请输入密码" type="password" required />
        <van-field v-model="confirm" name="confirm" label="确认密码" placeholder="再次输入密码" type="password" required />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">注册</van-button>
        <van-button round block type="default" style="margin-top:8px" @click="goLogin">去登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signUp } from '../services/supabase'
import { showToast } from 'vant'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirm = ref('')

async function onSubmit() {
  if (!username.value.trim()) { showToast('请输入用户名'); return }
  if (password.value.length < 6) { showToast('密码至少6位'); return }
  if (password.value !== confirm.value) { showToast('两次密码不一致'); return }
  try {
    await signUp({ username: username.value.trim(), password: password.value })
    showToast('注册成功')
    router.replace('/onboarding')
  } catch (e) {
    showToast(e.message || '注册失败')
  }
}
function goLogin() { router.push('/login') }
</script>

<style scoped>
.page { padding: 12px; }
</style>