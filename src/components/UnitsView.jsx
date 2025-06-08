// src/components/UnitsView.jsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { fetchUnits } from '../data/fetchUnits';

const TYPE_COLORS = {
  '核能':            '#D9534F', // 柔和深紅
  '汽電共生':        '#C49A6C', // 柔和咖啡
  '燃煤':            '#E57373', // 柔和紅
  '民營電廠-燃煤':    '#E57373',
  '燃氣':            '#FFB74D', // 柔和橘
  '民營電廠-燃氣':    '#FFB74D',
  '輕油':            '#BA68C8', // 柔和紫
  '燃油':            '#BA68C8',
  '風力':            '#81C784', // 柔和綠
  '水力':            '#64B5F6', // 柔和藍
  '太陽能':          '#FFF176', // 柔和黃
  '其它再生能源':    '#757575', // 中灰
  '儲能':            '#4DD0E1', // 柔和青
  '儲能負載':        '#BDBDBD', // 淺灰
};

export default function UnitsView() {
    const [units, setUnits] = useState([]);

    useEffect(() => {
        fetchUnits().then(setUnits).catch(console.error);
    }, []);

    // 只顯示發電率 >= 1%
    const visibleUnits = units.filter(u => !isNaN(u.ratio) && u.ratio >= 1);

    return (
        <div className="mt-8 space-y-4">
            {/* 標題 + 顏色圖例 */}
            <div>
                <h2 className="text-xl font-semibold">
                    台灣電力公司各機組發電量即時資訊
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-1 text-xs">
                    {Object.entries(TYPE_COLORS).map(([type, color]) => (
                        <span
                            key={type}
                            className="font-semibold"
                            style={{ color }}
                        >
                            {type}
                        </span>
                    ))}
                </div>
            </div>

            {/* 機組圓環卡片網格 */}
            <div className="
          grid gap-2
          grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10
        ">
        {visibleUnits.map((u, i) => {
          const color = TYPE_COLORS[u.type] || '#FFCDD2';
          return (
            <div
              key={`${u.name}-${i}`}                /* 唯一 key */
              className="relative group bg-white rounded-2xl shadow p-1.5 overflow-hidden"
            >
              {/* 小圓環 (滑入隱藏) */}
              <div className="flex justify-center items-center group-hover:hidden">
                <PieChart width={50} height={50}>  {/* 固定大小 */}
                  <Pie
                    data={[{ value: u.ratio }, { value: 100 - u.ratio }]}
                    innerRadius={15}
                    outerRadius={22}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill={color} />
                    <Cell fill="#f0f0f0" />
                  </Pie>
                </PieChart>
              </div>

                            {/* 滑入後覆蓋層 */}
                            <div
                                className="
                  absolute inset-0 flex flex-col justify-center items-center
                  text-white rounded-2xl opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                "
                                style={{ backgroundColor: color }}
                            >
                                <div className="text-xs font-bold">{u.name}</div>
                                <div className="text-[8px] mt-0.5">
                                    {u.generation.toFixed(1)} MW / {u.capacity.toFixed(1)} MW
                                </div>
                                <div className="text-base font-bold mt-1">
                                    {u.ratio.toFixed(0)}%
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
