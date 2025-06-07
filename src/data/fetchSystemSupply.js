// src/data/fetchSystemSupply.js
import axios from 'axios';

const JSON_URL =
  'https://corsproxy.io/?https://service.taipower.com.tw/data/opendata/apply/file/d006020/001.json';

export async function fetchSystemSupply() {
  const res = await axios.get(JSON_URL);
  // 1) 拿到真正的陣列
  const records = res.data.records;

  // 2) 取出我們想 chart 的三筆：即時／預測尖峰／昨日尖峰
  const [realTime, forecast, yesterday] = records;
  const realHour = records[3]; // 真正小時最大供電能力

  // 3) 統一欄位：label, 用電(load), 容量(capacity), 使用率(rate)
  const chartData = [
    {
      label: '即時負載',
      load:  parseFloat(realTime.curr_load),
      capacity: parseFloat(realHour.real_hr_maxi_sply_capacity),
      rate: parseFloat(realTime.curr_util_rate),
    },
    {
      label: '預測尖峰',
      load:  parseFloat(forecast.fore_peak_dema_load),
      capacity: parseFloat(forecast.fore_maxi_sply_capacity),
      rate: parseFloat(forecast.fore_peak_resv_rate),
    },
    {
      label: '昨日尖峰',
      load:  parseFloat(yesterday.yday_peak_dema_load),
      capacity: parseFloat(yesterday.yday_maxi_sply_capacity),
      rate: parseFloat(yesterday.yday_peak_resv_rate),
    },
  ];

  return chartData;
}
