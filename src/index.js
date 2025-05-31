import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';
import './globalstyle.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>      
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error('❌ #root element를 찾을 수 없습니다. index.html을 확인하세요.');
}
