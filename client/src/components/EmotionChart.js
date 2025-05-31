// src/components/EmotionChart.jsx
import React, { useEffect, useRef } from 'react';
import { moodData } from './dummyData.js';
import Chart from 'chart.js/auto';

function EmotionChart() {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');

    // 이전 차트 인스턴스를 파괴
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: moodData.map(d => d.date),
        datasets: [{
          label: '감정 점수',
          data: moodData.map(d => d.score),
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          fill: true,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            max: 1,
          },
        },
      },
    });

    // cleanup 함수에서 차트 제거
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="tab-content active">
      <canvas ref={canvasRef} width="600" height="300"></canvas>
    </div>
  );
}

export default EmotionChart;
