import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function BarChartView({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="日期" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="備轉容量率" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
