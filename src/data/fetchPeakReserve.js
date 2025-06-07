import axios from 'axios';
import Papa from 'papaparse';

// 資料來源
const CSV_URL = 'https://corsproxy.io/?https://service.taipower.com.tw/data/opendata/apply/file/d006002/001.csv';


export async function fetchPeakReserve() {
  const res = await axios.get(CSV_URL, {
    responseType: 'blob', // 因為是 CSV 文件
  });
  
  return new Promise((resolve, reject) => {
    Papa.parse(res.data, {
      header: true,
      encoding: 'utf-8',
      skipEmptyLines: true,
      complete: (results) => {
        // 處理資料轉換
        const parsedData = results.data.map(row => ({
          日期: row['日期'],
          備轉容量: parseFloat(row['備轉容量(萬瓩)']),
          備轉容量率: parseFloat(row['備轉容量率(%)']),
        })).filter(row => !isNaN(row['備轉容量率'])); // 濾掉無效資料

        resolve(parsedData);
      },
      error: (err) => reject(err),
    });
  });
}
