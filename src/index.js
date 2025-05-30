import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globalstyle.css';  // ✅ 전역 스타일

const rootElement = document.getElementById('root');

// 안전하게 rootElement 존재 여부까지 확인
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('❌ #root element를 찾을 수 없습니다. index.html을 확인하세요.');
}
