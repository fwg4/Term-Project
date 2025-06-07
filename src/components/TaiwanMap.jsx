import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { getTotalElectricityByCity, getAvailableYearMonths } from '../data/fetchElectricityData';

const TOPOJSON_URL = '/assets/twCounty2010merge.topo.json';
const COLOR_RANGE = ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'];
const cityNameMap = {
  '台北市': '台北市',
  '新北市': '新北市',
  '桃園縣': '桃園市',
  '台中市': '台中市',
  '台南市': '台南市',
  '高雄市': '高雄市',
  '基隆市': '基隆市',
  '新竹市': '新竹市',
  '新竹縣': '新竹縣',
  '苗栗縣': '苗栗縣',
  '彰化縣': '彰化縣',
  '南投縣': '南投縣',
  '雲林縣': '雲林縣',
  '嘉義市': '嘉義市',
  '嘉義縣': '嘉義縣',
  '屏東縣': '屏東縣',
  '宜蘭縣': '宜蘭縣',
  '花蓮縣': '花蓮縣',
  '台東縣': '台東縣',
  '澎湖縣': '澎湖縣',
  '金門縣': '金門縣',
  '連江縣': '連江縣'
};

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
                                        const mappedCityName = cityNameMap[cityName];

                                        const totalElectricity = totalByCity[mappedCityName] || 0;
                                        const fillColor = totalElectricity > 0 ? getColor(totalElectricity, maxTotal) : '#EEE';

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={fillColor}
                                                stroke="#333"
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
                    <p>這裡可以放該月份的詳細用電資料。</p>
                </div>
            </div>
        </div>
    );
}
