import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChartView from '../components/ChartView';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 你可以把這個換成任何開放資料 API
    axios
      .get('https://data.gov.tw/api/v1/rest/datastore/301000000A-000082-053')
      .then((res) => {
        setData(res.data.result.records.slice(0, 10)); // 測試抓前10筆資料
      });
  }, []);

  return (
    <div>
      <ChartView data={data} />
    </div>
  );
}