// src/data/fetchUnits.js
import axios from 'axios';

const URL =
  'https://corsproxy.io/?https://service.taipower.com.tw/data/opendata/apply/file/d006001/001.json';

export async function fetchUnits() {
  const res = await axios.get(URL);
  const aaData = res.data.aaData || [];

  return aaData
    .filter(item =>
      item['機組名稱'] &&
      !/小計|N\/A/.test(item['機組名稱'])
    )
    .map(item => {
      const capacity = parseFloat(item['裝置容量(MW)'].replace(/[()%]/g, '')) || 0;
      const generation = parseFloat(item['淨發電量(MW)'].replace(/,/g, '')) || 0;
      const ratio = parseFloat((item['淨發電量/裝置容量比(%)'] || '0').replace(/%/g, '')) || 0;

      return {
        name:       item['機組名稱'],
        type:       item['機組類型'],   // ← 新增這行
        capacity,
        generation,
        ratio,     // 百分比 0~100
      };
    });
}
