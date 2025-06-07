// api/datagov.js
const fetch = (...args) =>
  import('node-fetch').then(({ default: f }) => f(...args));

module.exports = async (req, res) => {
  const url =
    'https://data.gov.tw/api/v1/rest/datastore/301000000A-000082-053';
  try {
    const rsp = await fetch(url);
    if (!rsp.ok) {
      return res.status(rsp.status).json({ error: `Upstream HTTP ${rsp.status}` });
    }
    const data = await rsp.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
