import axios from 'axios';
import Papa from 'papaparse';

// 資料來源
const CSV_URL = 'https://corsproxy.io/?https://service.taipower.com.tw/data/opendata/apply/file/d006002/001.csv';

const formatDate = (dateStr) => {
	if (!/^\d{8}$/.test(dateStr)) return dateStr;
	const year = dateStr.slice(0, 4);
	const month = dateStr.slice(4, 6);
	const day = dateStr.slice(6, 8);
	return `${month}/${day}`;
};

export async function fetchPeakReserve() {
	try {
		const res = await axios.get(CSV_URL, { responseType: 'blob' });

		return await new Promise((resolve, reject) => {
			Papa.parse(res.data, {
				header: true,
				encoding: 'utf-8',
				skipEmptyLines: true,
				complete: (results) => {
					const parsedData = results.data.map(row => ({
						日期: formatDate(row['日期']),
						備轉容量: parseFloat(row['備轉容量(萬瓩)']),
						備轉容量率: parseFloat(row['備轉容量率(%)']),
					})).filter(row => !isNaN(row['備轉容量']) && !isNaN(row['備轉容量率']));

					resolve(parsedData);
				},
				error: (err) => reject(err),
			});
		});
	} catch (err) {
		console.error("資料抓取失敗:", err);
		throw err;
	}
}
