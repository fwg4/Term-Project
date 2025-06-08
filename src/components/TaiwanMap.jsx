import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getTotalElectricityByCity, getAvailableYearMonths, getElectricityDetailByCityAndMonth } from '../data/fetchElectricityData';

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
function darkenColor(hex, amount = 0.2) {
    // 將 hex 轉為 RGB，乘上 (1 - amount)
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, ((num >> 16) & 0xff) * (1 - amount));
    const g = Math.max(0, ((num >> 8) & 0xff) * (1 - amount));
    const b = Math.max(0, (num & 0xff) * (1 - amount));
    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

export default function TaiwanMap() {
    const [geoData, setGeoData] = useState(null);
    const [yearMonth, setYearMonth] = useState('11404'); // 預設年月
    const [totalByCity, setTotalByCity] = useState({});
    const [maxTotal, setMaxTotal] = useState(0);
    const [yearMonths, setYearMonths] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [detailData, setDetailData] = useState([]);

    const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

    useEffect(() => {
        fetch(TOPOJSON_URL)
            .then(res => res.json())
            .then(setGeoData);

        getAvailableYearMonths().then(ymArr => {
            //console.log('available yearMonths:', ymArr);
            setYearMonths(ymArr);
            if (ymArr.length > 0) {
                setYearMonth(ymArr[ymArr.length - 1]);
            }
        });

    }, []);

    useEffect(() => {
        if (!yearMonth) return;
        getTotalElectricityByCity(yearMonth).then(totals => {
            setTotalByCity(totals);
            setMaxTotal(Math.max(...Object.values(totals)));
        });
    }, [yearMonth]);

    useEffect(() => {
        if (selectedCity && yearMonth) {
            getElectricityDetailByCityAndMonth(selectedCity, yearMonth).then(data => {
                setDetailData(data);
            });
        } else {
            setDetailData([]);
        }
    }, [selectedCity, yearMonth]);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
                台灣電力公司各縣市總售電量熱度圖
            </h2>

            {/* 年月選擇 */}
            <div className="mb-4">
                <label htmlFor="yearMonthSelect" className="mr-2 font-semibold">選擇年月：</label>
                <select
                    id="yearMonthSelect"
                    value={yearMonth}
                    onChange={e => setYearMonth(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    {yearMonths.map(ym => (
                        <option key={ym} value={ym}>{ym}</option>
                    ))}
                </select>
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
                            <h3 className="text-lg font-semibold mb-4">{selectedCity} - {yearMonth} 用電佔比</h3>
                            <PieChart width={300} height={300}>
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
                        </>
                    ) : (
                        <p>請點擊地圖上的縣市以查看詳細用電資料</p>
                    )}
                </div>
            </div>
        </div>
    );
}
