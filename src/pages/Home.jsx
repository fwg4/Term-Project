// src/Home.jsx
import React, { useEffect, useState } from 'react';
import { fetchPeakReserve } from '../data/fetchPeakReserve';
import BarChartView from '../components/charts/BarChartView';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
<<<<<<< HEAD
    // ❶ 直接打 data.gov.tw 會被 CORS 擋
-   axios.get('https://data.gov.tw/api/v1/rest/datastore/301000000A-000082-053')
+   axios.get('/api/datagov')     // ← 改成自己的 proxy

      .then((res) => {
        // ❷ 伺服器端 proxy 已經把原始 JSON 轉發回來
        //    結構保持一樣：{ result: { records: [...] } }
        setData(res.data.result.records.slice(0, 10)); // 取前 10 筆測試
      })
      .catch((err) => console.error(err));
=======
    fetchPeakReserve().then(records => setData(records));
>>>>>>> ecc20ea (直方圖)
  }, []);

  return (
    <div>
      <BarChartView
        data={data}
        xKey="日期"
        dataKey="備轉容量率"
        title="每日備轉容量率 (%)"
      />
    </div>
  );
}
