import React from 'react';
import Home from './pages/Home';
import TaipowerStatus from './components/TaipowerStatus';

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Open Data Dashboard</h1>
      <Home />
      <TaipowerStatus />
    </div>
  );
}