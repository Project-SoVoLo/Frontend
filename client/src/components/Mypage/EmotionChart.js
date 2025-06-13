import React, { useEffect, useRef, useState } from 'react';
import axios from '../../api/axios';
import Chart from 'chart.js/auto';
import './Mypage.css';

function EmotionChart() {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get('/api/mypage/chat-summaries')
      .then(res => {
        console.log('API 응답 데이터:', res.data);
        const filtered = res.data.filter(item => item.phqScore !== null && item.date);

        // 날짜별 감정점수 평균 계산
        const grouped = filtered.reduce((acc, item) => {
          const date = item.date.split('T')[0];
          if (!acc[date]) {
            acc[date] = { total: 0, count: 0 };
          }
          acc[date].total += item.phqScore;
          acc[date].count += 1;
          return acc;
        }, {});

        const averaged = Object.entries(grouped).map(([date, { total, count }]) => ({
          date,
          avgScore: total / count,
        }));

        const sorted = averaged.sort((a, b) => new Date(a.date) - new Date(b.date));
        const last10 = sorted.slice(-10);

        setRecords(last10);
      })
      .catch(err => {
        console.error('상담 요약 API 오류:', err);
      });
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = records.map(d => {
      const date = new Date(d.date);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}/${day}`;
    });

    const data = records.map(d => d.avgScore);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: '감정 점수',
          data,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        animation: false,
        layout: {
          padding: {
            left: 20,
            right: 10,
            top: 10,
            bottom: 10
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 27,
            title: {
              display: true,
              text: 'PHQ 점수',
            }
          },
          x: {
            offset: true,
            title: {
              display: true,
              text: '상담 날짜',
            }
          }
        },
        plugins: {
          title: {
            display: records.length === 0,
            text: '감정 데이터가 없습니다.',
            padding: {
              top: 10,
              bottom: 20
            },
            font: {
              size: 14
            }
          }
        }
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [records]);

  return (
    <div className="tab-content active">
      <div className="emotion-chart">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default EmotionChart;