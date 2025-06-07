import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function ChartView({ data }) {
  const pieData = data.length ? [{ name: '平均備轉容量率', value: data.reduce((a, b) => a + b['備轉容量率'], 0) / data.length }] : [];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">備轉容量與比例</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="日期" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="備轉容量" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#82ca9d"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}