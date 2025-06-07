// api/taipower.js
const fetch = (...args) =>
  import('node-fetch').then(({ default: f }) => f(...args));

module.exports = async (req, res) => {
  try {
    const rsp = await fetch(
      'https://service.taipower.com.tw/data/opendata/apply/file/d006020/001.json'
    );
    if (!rsp.ok) {
      return res.status(rsp.status).json({ error: `Upstream HTTP ${rsp.status}` });
    }
    const data = await rsp.json();

    // 允許前端跨域，也讓 CDN 快取 5 分鐘
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
