// src/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChartView from '../components/ChartView';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // ❶ 直接打 data.gov.tw 會被 CORS 擋
-   axios.get('https://data.gov.tw/api/v1/rest/datastore/301000000A-000082-053')
+   axios.get('/api/datagov')     // ← 改成自己的 proxy

      .then((res) => {
        // ❷ 伺服器端 proxy 已經把原始 JSON 轉發回來
        //    結構保持一樣：{ result: { records: [...] } }
        setData(res.data.result.records.slice(0, 10)); // 取前 10 筆測試
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <ChartView data={data} />
    </div>
  );
}
