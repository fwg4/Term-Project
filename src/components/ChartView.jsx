import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ChartView({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">資料視覺化</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="站台名稱" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="AQI" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
