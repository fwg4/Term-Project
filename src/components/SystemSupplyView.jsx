// src/components/charts/SystemSupplyView.jsx
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { fetchSystemSupply } from '../data/fetchSystemSupply'; // 確認相對路徑

export default function SystemSupplyView() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSystemSupply()
      .then(setData)
      .catch(err => console.error('fetchSystemSupply 錯誤:', err));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">今日系統供需狀況</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 負載 vs 容量 */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={val => `${val} 萬瓩`} />
            <Bar dataKey="load"     name="用電負載"  fill="#8884d8" />
            <Bar dataKey="capacity" name="最大供電能力" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        {/* 使用率 */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis domain={[0, 100]} unit="%" />
            <Tooltip formatter={val => `${val.toFixed(2)}%`} />
            <Line
              type="monotone"
              dataKey="rate"
              name="使用率"
              stroke="#ff7300"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
