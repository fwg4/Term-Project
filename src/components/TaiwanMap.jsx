import React, { useEffect, useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from 'recharts';

import {
    getTotalElectricityByCity,
    getAvailableYearMonths,
    getElectricityDetailByCityAndMonth
} from '../data/fetchElectricityData';

const TOPOJSON_URL = '/assets/twCounty2010merge.topo.json';
const COLOR_RANGE = ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'];

function getColor(value, maxValue) {
    const ratio = value / maxValue;
    if (ratio > 0.8) return COLOR_RANGE[4];
    if (ratio > 0.6) return COLOR_RANGE[3];
    if (ratio > 0.4) return COLOR_RANGE[2];
    if (ratio > 0.2) return COLOR_RANGE[1];
    return COLOR_RANGE[0];
}
function formatYearMonth(ym) {
    if (!ym || ym.length !== 5) return '';
    const year = parseInt(ym.slice(0, 3), 10);
    const month = parseInt(ym.slice(3, 5), 10);
    return `民國 ${year} 年 ${month} 月`;
}


function darkenColor(hex, amount = 0.2) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, ((num >> 16) & 0xff) * (1 - amount));
    const g = Math.max(0, ((num >> 8) & 0xff) * (1 - amount));
    const b = Math.max(0, (num & 0xff) * (1 - amount));
    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

export default function TaiwanMap() {
    const [geoData, setGeoData] = useState(null);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [yearMonths, setYearMonths] = useState([]);
    const [selectedYearMonth, setSelectedYearMonth] = useState('');

    const [totalByCity, setTotalByCity] = useState({});
    const [maxTotal, setMaxTotal] = useState(0);
    const [selectedCity, setSelectedCity] = useState(null);
    const [detailData, setDetailData] = useState([]);

    const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

    // 載入地圖與可用年月清單，並設定預設年月選擇
    useEffect(() => {
        fetch(TOPOJSON_URL)
            .then(res => res.json())
            .then(setGeoData);

        getAvailableYearMonths().then(ymArr => {
            setYearMonths(ymArr);
            if (ymArr.length > 0) {
                const lastYM = ymArr[ymArr.length - 1];
                setSelectedYearMonth(lastYM);
                setYear(lastYM.slice(0, 3));
                setMonth(lastYM.slice(3, 5));
            }
        });
    }, []);

    // 當 year 或 month 改變時，更新 selectedYearMonth
    useEffect(() => {
        if (year && month) {
            const combined = `${year}${month}`;
            // 確認 combined 是否在 yearMonths 裡
            if (yearMonths.includes(combined)) {
                setSelectedYearMonth(combined);
            }
        }
    }, [year, month, yearMonths]);

    // 當 selectedYearMonth 改變時，抓取該年月的各縣市用電總量
    useEffect(() => {
        if (!selectedYearMonth) return;
        getTotalElectricityByCity(selectedYearMonth).then(totals => {
            setTotalByCity(totals);
            setMaxTotal(Math.max(...Object.values(totals)));
        });
    }, [selectedYearMonth]);

    // 當選擇縣市或 selectedYearMonth 改變時，抓取詳細用電資料
    useEffect(() => {
        if (selectedCity && selectedYearMonth) {
            getElectricityDetailByCityAndMonth(selectedCity, selectedYearMonth).then(data => {
                setDetailData(data);
            });
        } else {
            setDetailData([]);
        }
    }, [selectedCity, selectedYearMonth]);

    // 年份下拉選單選項
    const yearOptions = useMemo(() => {
        if (!Array.isArray(yearMonths)) return [];
        const years = new Set(yearMonths.map(ym => ym.slice(0, 3)));
        return Array.from(years).sort((a, b) => b - a);
    }, [yearMonths]);

    // 月份下拉選單選項
    const monthOptions = useMemo(() => {
        if (!Array.isArray(yearMonths)) return [];
        return yearMonths
            .filter(ym => ym.startsWith(year))
            .map(ym => ym.slice(3, 5))
            .sort((a, b) => a - b);
    }, [year, yearMonths]);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
                台灣電力公司各縣市總售電量
            </h2>

            <div className="mb-4 flex items-center space-x-4">
                <div>
                    <label htmlFor="yearSelect" className="block mb-1 font-semibold">選擇年</label>
                    <select
                        id="yearSelect"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        className="border rounded px-3 py-2 shadow-sm"
                    >
                        {yearOptions.map(y => (
                            <option key={y} value={y}>{`民國 ${y} 年`}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="monthSelect" className="block mb-1 font-semibold">選擇月</label>
                    <select
                        id="monthSelect"
                        value={month}
                        onChange={e => setMonth(e.target.value)}
                        className="border rounded px-3 py-2 shadow-sm"
                    >
                        {monthOptions.map(m => (
                            <option key={m} value={m}>{`${parseInt(m)} 月`}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-full md:w-1/2 h-80 md:h-[600px]">
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{ scale: 8000, center: [121, 24] }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {geoData && (
                            <Geographies geography={geoData}>
                                {({ geographies }) =>
                                    geographies.map(geo => {
                                        const cityName = geo.properties.COUNTYNAME || geo.properties.name;
                                        const totalElectricity = totalByCity[cityName] || 0;
                                        const fillColor = totalElectricity > 0 ? getColor(totalElectricity, maxTotal) : '#EEE';

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={fillColor}
                                                stroke="#333"
                                                onClick={() => {
                                                    if (cityName) setSelectedCity(cityName);
                                                }}

                                                style={{
                                                    default: { outline: 'none' },
                                                    hover: {
                                                        fill: darkenColor(fillColor, 0.1),
                                                        outline: 'none'
                                                    },
                                                    pressed: { fill: '#444', outline: 'none' },
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        )}
                    </ComposableMap>
                </div>

                <div className="w-1/2 p-4 bg-gray-50 rounded border">
                    {selectedCity ? (
                        <>
                            <>
                                <div className="text-center text-2xl font-bold mb-1 text-gray-800">
                                    {formatYearMonth(selectedYearMonth)}
                                </div>
                                <div className="text-center text-xl font-semibold mb-1 text-gray-700">
                                    縣市：{selectedCity}
                                </div>
                                <div className="text-center text-lg font-medium text-gray-600">
                                    總用電佔量：{totalByCity[selectedCity]?.toLocaleString()} kWh
                                </div>
                            </>
                            <div className="flex justify-center">
                                <PieChart width={500} height={400}>
                                    <Pie
                                        data={detailData}
                                        dataKey="用電佔比"
                                        nameKey="用電性質"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label={(entry) => `${entry.用電性質}: ${entry.用電佔比.toFixed(1)}%`}
                                    >
                                        {detailData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value}%`} />
                                    <Legend />
                                </PieChart>
                            </div>
                        </>
                    ) : (
                        <p>請點擊地圖上的縣市以查看詳細用電資料</p>
                    )}
                </div>
            </div>
        </div>
    );
}
