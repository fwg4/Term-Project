import React from 'react'; 
import useAutoFetch from '../hooks/useAutoFetch';

const API_URL = '/api/taipower';

export default function TaipowerStatus() {
  const [data, loading, error] = useAutoFetch(API_URL);

  // ※ API 回傳是一個陣列；最新一筆通常在 index 0
  const record = Array.isArray(data) && data[0] ? data[0] : null;

  if (loading) return <p className="italic text-sm">載入中…</p>;
  if (error)   return <p className="text-red-500">錯誤：{error.message}</p>;
  if (!record) return <p className="text-gray-500">暫無資料</p>;

  return (
    <div className="mt-6 p-4 rounded-xl shadow-lg bg-white dark:bg-slate-800">
      <h2 className="text-lg font-semibold mb-2">台電今日系統供需狀況</h2>

      <p className="text-xs mb-3 text-slate-500">
        更新時間：{record.record_time}
      </p>

      <div className="grid grid-cols-2 gap-y-1 text-sm">
        <span>目前用電量</span>      <span>{record.nowload} MW</span>
        <span>系統可供電量</span>    <span>{record.syscapacity} MW</span>
        <span>預估尖峰負載</span>    <span>{record.forecast_peak_load} MW</span>
        <span>備轉容量</span>        <span>{record.reservecapacity} MW</span>
        <span>備轉容量率</span>      <span>{record.reservepercent} %</span>
      </div>
    </div>
  );
}
