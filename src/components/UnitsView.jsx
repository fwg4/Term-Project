// src/components/UnitsView.jsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { fetchUnits } from '../data/fetchUnits';

const TYPE_COLORS = {
  '核能':            '#8B0000',
  '汽電共生':        '#6F4E37',
  '燃煤':            '#FF0000',
  '民營電廠-燃煤':    '#FF0000',
  '燃氣':            '#FFA500',
  '民營電廠-燃氣':    '#FFA500',
  '輕油':            '#800080',
  '燃油':            '#800080',
  '風力':            '#008000',
  '水力':            '#0000FF',
  '太陽能':          '#FFD700',
  '其它再生能源':    '#000000',
  '儲能':            '#00FFFF',
  '儲能負載':        '#808080',
};

export default function UnitsView() {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetchUnits().then(setUnits).catch(console.error);
  }, []);

  // 只顯示 ratio >= 1%
  const visibleUnits = units.filter(u => !isNaN(u.ratio) && u.ratio >= 1);

  return (
    <div className="mt-8 space-y-4">
      {/* 標題 + 顏色圖例 */}
      <div>
        <h2 className="text-xl font-semibold">
          台灣電力公司各機組發電量即時資訊
        </h2>
        <div className="flex flex-wrap items-center gap-4 mt-1 text-s">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <span key={type} className="font-semibold" style={{ color }}>
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
        {visibleUnits.map(u => {
          const color = TYPE_COLORS[u.type] || '#FF4D4F';
          return (
            <div
              key={u.name}
              className="relative group bg-white rounded-2xl shadow p-1.5 overflow-hidden"
            >
              {/* 小圓環 (滑入隱藏) */}
              <div className="flex justify-center items-center group-hover:hidden">
                <ResponsiveContainer width={50} height={50}>
                  <PieChart>
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
                </ResponsiveContainer>
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
