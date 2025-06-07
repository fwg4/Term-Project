import { useEffect, useState, useRef } from 'react';

/**
 * @param {string} url        – 要抓取的 API
 * @param {number} intervalMs – 更新間隔 (毫秒)
 * @returns {[data, loading, error]}
 */
export default function useAutoFetch(url, intervalMs = 600000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();                          // 先抓一次
    timerRef.current = setInterval(fetchData, intervalMs); // 每隔 intervalMs 再抓
    return () => clearInterval(timerRef.current);          // 元件卸載時清除計時器
  }, [url, intervalMs]);

  return [data, loading, error];
}
