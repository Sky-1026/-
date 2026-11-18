/* 全站爱心计数：一个 KV 键，读写都走 /api/heart。
   没有登录、也不记 IP，所以任何人用 curl 都能把数字加大——它是表白，不是统计指标。 */
const TOTAL = 'heart:total'

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
})

const sameOrigin = request => {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try { return new URL(origin).host === new URL(request.url).host } catch { return false }
}

const read = async env => Number.parseInt(await env.HEART_KV.get(TOTAL), 10) || 0

export async function onRequestGet({ request, env }) {
  if (!env.HEART_KV) return json({ error: 'kv-not-bound' }, 501)
  if (!sameOrigin(request)) return json({ error: 'cross-origin' }, 403)
  return json({ total: await read(env) })
}

export async function onRequestPost({ request, env }) {
  if (!env.HEART_KV) return json({ error: 'kv-not-bound' }, 501)
  if (!sameOrigin(request)) return json({ error: 'cross-origin' }, 403)
  /* 读—改—写不是原子的：两个人同一瞬间按会少算一颗，表白数不值得为此上数据库。 */
  const total = await read(env) + 1
  await env.HEART_KV.put(TOTAL, String(total))
  return json({ total })
}
