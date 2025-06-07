import React, { useEffect, useState } from 'react';
import { fetchPeakReserve } from '../data/fetchPeakReserve';
import BarChartView from '../components/charts/BarChartView';

export default function Home() {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetchPeakReserve().then(records => setData(records));
	}, []);

	return (
		<div>
			<BarChartView
				data={data}
				xKey="日期"
				dataKey="備轉容量率"
				title="每日備轉容量率 (%)"
			/>
		</div>
	);
}
