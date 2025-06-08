import React from 'react';
import Home from './pages/Home';
import SystemSupplyView from './components/SystemSupplyView';
import TaiwanMap from './components/TaiwanMap';
import UnitsView from './components/UnitsView';

export default function App() {
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Term Project</h1>
			<Home />
			<SystemSupplyView />
			<TaiwanMap />
			<UnitsView />
		</div>
	);
}