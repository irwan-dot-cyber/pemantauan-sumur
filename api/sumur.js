import { timingSafeEqual } from 'node:crypto';

const actions = {getState: 0, saveProgress: 2, saveLocation: 3, deleteProgress: 2};
function equal(a, b) {
  const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || ''));
  return x.length === y.length && timingSafeEqual(x, y);
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') return res.status(405).json({ok:false,error:'Metode tidak diizinkan.'});
  const auth = req.headers.authorization || '';
  let supplied = '';
  if (auth.startsWith('Basic ')) {
    try { supplied = Buffer.from(auth.slice(6), 'base64').toString().split(':').slice(1).join(':'); } catch {}
  }
  if (!process.env.APP_PASSWORD || !equal(supplied, process.env.APP_PASSWORD)) return res.status(401).json({ok:false,error:'Tidak diizinkan.'});
  const {action,args} = req.body || {};
  if (!Object.hasOwn(actions, action) || !Array.isArray(args) || args.length !== actions[action]) return res.status(400).json({ok:false,error:'Permintaan tidak valid.'});
  if (!process.env.APPS_SCRIPT_URL || !process.env.SUMUR_API_TOKEN) return res.status(503).json({ok:false,error:'Koneksi Google Sheet belum dikonfigurasi.'});
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    let upstream;
    try {
      upstream = await fetch(process.env.APPS_SCRIPT_URL, {method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({token:process.env.SUMUR_API_TOKEN,action,args}),redirect:'follow',signal:controller.signal});
    } finally { clearTimeout(timer); }
    const data = await upstream.json();
    if (!upstream.ok || !data.ok) return res.status(502).json({ok:false,error:data.error || 'Google Sheet menolak permintaan.'});
    return res.status(200).json({ok:true,result:data.result});
  } catch (err) { return res.status(502).json({ok:false,error:'Koneksi Google Sheet gagal atau terlalu lama.'}); }
}
