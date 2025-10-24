<template>
  <div class="app">
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="goBack" />
    <router-view />
    <van-tabbar v-if="showTabbar" route>
      <van-tabbar-item to="/" icon="home-o">看板</van-tabbar-item>
      <van-tabbar-item to="/watchlist" icon="orders-o">自选</van-tabbar-item>
      <van-tabbar-item to="/account" icon="friends-o">账户</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const title = computed(() => {
  const map = {
    '/': 'A股动态看板',
    '/watchlist': '自选股管理',
    '/account': '账户设置',
  }
  return map[route.path] || 'A股分析系统'
})

const showTabbar = computed(() => !route.meta?.hideTabbar)
function goBack() { router.back() }
</script>

<style>
html, body, #app { height: 100%; }
body { margin: 0; }
.app { padding-bottom: 50px; }
</style>
