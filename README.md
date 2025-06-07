# Term Project


```tree
Term-Project/
├── public/
├── src/
│   ├── components/
│   │   └── ChartView.jsx
│   ├── pages/
│   │   └── Home.jsx
│   ├── App.jsx
│   ├── main.jsx
├── .devcontainer/   <-- Codespaces 設定
├── index.html
├── package.json
```


1. package.json（含所有依賴）
2. vite.config.js
3. src/ 中的基本頁面 + 初步抓取與視覺化邏輯
4. .devcontainer/devcontainer.json（讓 Codespaces 正常啟動）

src/:
```tree
src/
├── components/
│   ├── charts/
│   │   ├── BarChartView.jsx
│   │   ├── PieChartView.jsx
│   │   └── ChartView.jsx          // 根據 props 呼叫不同圖表
│   ├── TaiwanMap.jsx
│   └── VisualizationCard.jsx      // 可選的通用 UI 區塊容器
├── data/
│   ├── fetchPeakReserve.js        // 擴充用於其他資料集
│   ├── parser.js                  // 共用 CSV 解析器
├── services/
│   └── apiClient.js               // Axios 包裝
├── pages/
│   └── Home.jsx
```