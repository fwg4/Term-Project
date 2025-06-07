import Papa from 'papaparse';

const CSV_URL = 'https://corsproxy.io/?https://service.taipower.com.tw/data/opendata/apply/file/d007012/001.csv';

const STORAGE_KEY = 'electricityRawData';

export async function fetchElectricityRawData() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    const res = await fetch(CSV_URL);
    const csvText = await res.text();

    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: results => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(results.data));
                resolve(results.data);
            },
            error: err => reject(err),
        });
    });
}


export async function getTotalElectricityByCity(yearMonth) {
    const data = await fetchElectricityRawData();

    const filtered = data.filter(row => row['年月'] === yearMonth);
    //console.log('Filtered data for yearMonth:', yearMonth, filtered);
    const totals = {};
    filtered.forEach(row => {
        const city = row['縣市'];
        const amount = Number(row['售電量(度)']) || 0;
        if (!totals[city]) totals[city] = 0;
        totals[city] += amount;
    });

    return totals;
}

// 取得全部不同年月（方便做選單）
export async function getAvailableYearMonths() {
    const data = await fetchElectricityRawData();
    const unique = new Set(data.map(row => row['年月']));
    return Array.from(unique).sort(); // 排序
}


export async function getElectricityDetailByCityAndMonth(city, yearMonth) {
    const data = await fetchElectricityRawData();

    return data.filter(row => row['縣市'] === city && row['年月'] === yearMonth)
        .map(row => ({
            用電性質: row['用電性質'],
            售電量: Number(row['售電量(度)']) || 0,
            用電佔比: Number(row['用電佔比(%)']) || 0,
        }));
}