import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

let client = null
let mode = 'cloud'

if (!url || !key) {
  console.warn('Supabase credentials not found, falling back to local mode')
  mode = 'local'
} else {
  client = createClient(url, key)
  console.log('Supabase client initialized in cloud mode')
}

export function getMode() { return mode }
export function getClient() { return client }

// Local fallback helpers (for development only)
function lsGet(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
function lsSet(k, v) { localStorage.setItem(k, JSON.stringify(v)) }

export async function signUp({ username, password }) {
  if (mode === 'local') {
    const users = lsGet('users', {})
    if (users[username]) throw new Error('该用户名已注册(本地模式)')
    users[username] = { username, password }
    lsSet('users', users)
    lsSet('session', { username })
    return { user: { username } }
  }
  
  // Cloud mode: 使用 Supabase Auth 注册
  const { data, error } = await client.auth.signUp({
    email: `${username}@temp.local`, // 临时邮箱格式，实际使用用户名
    password,
    options: {
      data: {
        username: username
      }
    }
  })
  if (error) throw error
  return data
}

export async function signIn({ username, password }) {
  if (mode === 'local') {
    const users = lsGet('users', {})
    if (!users[username] || users[username].password !== password) {
      throw new Error('用户名或密码错误(本地模式)')
    }
    lsSet('session', { username })
    return { user: { username } }
  }
  
  // Cloud mode: 使用临时邮箱格式登录
  const { data, error } = await client.auth.signInWithPassword({
    email: `${username}@temp.local`,
    password
  })
  if (error) throw error
  return data
}

export async function signOut() {
  if (mode === 'local') { 
    localStorage.removeItem('session')
    return 
  }
  await client.auth.signOut()
}

export async function currentUser() {
  if (mode === 'local') { 
    return lsGet('session', null) 
  }
  const { data } = await client.auth.getUser()
  return data?.user
}

export async function saveAccount({ amount, currency, risk }) {
  if (mode === 'local') {
    const s = lsGet('session', null)
    if (!s) throw new Error('未登录')
    lsSet(`account:${s.username}`, { amount, currency, risk })
    return
  }
  
  // Cloud mode: 保存到 accounts 表
  const user = await currentUser()
  if (!user) throw new Error('未登录')
  
  const { error } = await client
    .from('accounts')
    .upsert({
      user_id: user.id,
      amount: parseFloat(amount),
      currency: currency || 'CNY',
      risk_preference: risk || 'balanced'
    })
  
  if (error) throw error
}

export async function saveWatchlist(symbols) {
  if (mode === 'local') {
    const s = lsGet('session', null)
    if (!s) throw new Error('未登录')
    lsSet(`watchlist:${s.username}`, symbols)
    return
  }
  
  // Cloud mode: 保存到 watchlists 表
  const user = await currentUser()
  if (!user) throw new Error('未登录')
  
  // 先删除现有的自选股
  await client
    .from('watchlists')
    .delete()
    .eq('user_id', user.id)
  
  // 插入新的自选股列表
  if (symbols && symbols.length > 0) {
    const watchlistData = symbols.map(symbol => ({
      user_id: user.id,
      symbol: symbol,
      name: null // 可以后续通过 API 获取股票名称
    }))
    
    const { error } = await client
      .from('watchlists')
      .insert(watchlistData)
    
    if (error) throw error
  }
}

export async function loadWatchlist() {
  if (mode === 'local') {
    const s = lsGet('session', null)
    if (!s) return []
    return lsGet(`watchlist:${s.username}`, ['000001'])
  }
  
  // Cloud mode: 从 watchlists 表加载
  const user = await currentUser()
  if (!user) return []
  
  const { data, error } = await client
    .from('watchlists')
    .select('symbol')
    .eq('user_id', user.id)
    .order('added_at', { ascending: true })
  
  if (error) throw error
  return data?.map(item => item.symbol) || ['000001']
}

export async function loadAccount() {
  if (mode === 'local') {
    const s = lsGet('session', null)
    if (!s) return null
    return lsGet(`account:${s.username}`, null)
  }
  
  // Cloud mode: 从 accounts 表加载
  const user = await currentUser()
  if (!user) return null
  
  const { data, error } = await client
    .from('accounts')
    .select('amount, currency, risk_preference')
    .eq('user_id', user.id)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
  return data ? {
    amount: data.amount,
    currency: data.currency,
    risk: data.risk_preference
  } : null
}

export async function isOnboarded() {
  if (mode === 'local') {
    const s = lsGet('session', null)
    if (!s) return false
    return !!lsGet(`onboarding:${s.username}`, false)
  }
  
  // Cloud mode: 查询 onboarding_status 表
  const user = await currentUser()
  if (!user) return false
  
  const { data, error } = await client
    .from('onboarding_status')
    .select('completed')
    .eq('user_id', user.id)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data?.completed || false
}

export async function markOnboarded(value = true) {
  if (mode === 'local') {
    const s = lsGet('session', null)
    if (!s) throw new Error('未登录')
    lsSet(`onboarding:${s.username}`, !!value)
    return
  }
  
  // Cloud mode: 更新 onboarding_status 表
  const user = await currentUser()
  if (!user) throw new Error('未登录')
  
  const { error } = await client
    .from('onboarding_status')
    .upsert({
      user_id: user.id,
      completed: !!value,
      completed_at: value ? new Date().toISOString() : null
    })
  
  if (error) throw error
}