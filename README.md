# Term Project

執行步驟，且須具備 NPM 便可運行：
```bash
git clone https://github.com/fwg4/Term-Project.git
cd Term-Project
npm install
npm run dev
```


src/:
```tree
src/
├── components/                     // 根據 props 呼叫不同圖表
│   ├── TaiwanMap.jsx
│   └── VisualizationCard.jsx       // 可選的通用 UI 區塊容器
├── data/
│   ├── fetchPeakReserve.js         // 擴充用於其他資料集
│   ├── parser.js                   // 共用 CSV 解析器
├── services/
│   └── apiClient.js                // Axios 包裝
├── pages/
│   └── Home.jsx
```