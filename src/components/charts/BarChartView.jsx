import React from 'react';
import {
	BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const SAFE_THRESHOLD = 40; // 安全閾值（%）

export default function BarChartView({ data }) {
	return (
		<div className="bg-white p-4 rounded shadow">
			<h2 className="text-xl font-semibold mb-2">台灣電力公司  每日尖峰備轉容量</h2>

			<ResponsiveContainer width="100%" height={300}>
				<BarChart
					data={data}
					margin={{ top: 10, right: 10, left: 60, bottom: 10 }}
				>
					<XAxis dataKey="日期" />
					<YAxis unit="萬瓩" />
					<Tooltip />
					<Bar dataKey="備轉容量">
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={entry['備轉容量率'] < SAFE_THRESHOLD ? '#82ca9d' : '#ff7f7f'}
							/>
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
			</div>
	);
}
