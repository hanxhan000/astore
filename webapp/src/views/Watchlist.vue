<template>
  <div class="page">
    <van-field v-model="symbol" label="添加股票" placeholder="输入代码如 000001" />
    <van-button type="primary" block @click="add">添加</van-button>
    <van-cell-group inset>
      <van-cell v-for="s in watchlist" :key="s" :title="s">
        <template #right-icon>
          <van-button size="small" type="danger" @click="remove(s)">删除</van-button>
        </template>
      </van-cell>
    </van-cell-group>
    <van-button block type="success" style="margin-top:8px" @click="save">保存到云端</van-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { saveWatchlist, loadWatchlist } from '../services/supabase'
import { showToast } from 'vant'

const symbol = ref('')
const watchlist = ref([])

onMounted(async () => {
  try {
    watchlist.value = await loadWatchlist()
  } catch (error) {
    console.error('Failed to load watchlist:', error)
    watchlist.value = ['000001'] // 默认值
  }
})

function add() {
  if (symbol.value && !watchlist.value.includes(symbol.value)) {
    watchlist.value.push(symbol.value)
    symbol.value = ''
  }
}

function remove(s) {
  const idx = watchlist.value.indexOf(s)
  if (idx > -1) watchlist.value.splice(idx, 1)
}

async function save() {
  try {
    await saveWatchlist(watchlist.value)
    showToast('保存成功')
  } catch (e) {
    showToast(e.message || '保存失败')
  }
}
</script>

<style scoped>
.page { padding: 12px; }
</style>