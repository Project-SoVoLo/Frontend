import React, { useEffect, useRef, useState } from 'react';
import axios from '../../api/axios';
import Chart from 'chart.js/auto';
import './Mypage.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
};

function EmotionChart() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedData, setGroupedData] = useState({});
  
  const [activeTab, setActiveTab] = useState(null);
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/diagnosis/history')
      .then(res => {
        const data = res.data || [];
        
        const grouped = data.reduce((acc, item) => {
          const key = item.diagnosisType || "기타";
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});
        setGroupedData(grouped);
        
        if (Object.keys(grouped).length > 0) {
          setActiveTab(Object.keys(grouped)[0]);
        }
      })
      .catch(err => {
        console.error('진단 내역 API 오류:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !activeTab || !groupedData[activeTab]) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    const items = groupedData[activeTab];

    // 1. 현재 탭의 날짜별 점수 맵 생성 (중복 날짜 처리)
    const scoreMap = {};
    items.forEach(item => {
      const date = formatDate(item.diagnosisDate);
      scoreMap[date] = Number(item.diagnosisScore) || 0;
    });

    // 2. 현재 탭의 고유한 날짜(key)만 추출하여 정렬 (이 탭의 고유 X축)
    const tabDates = Object.keys(scoreMap).sort((a, b) => new Date(a) - new Date(b));

    // 3. 정렬된 날짜(tabDates) 순서대로 점수 배열(dataArr) 생성
    const dataArr = tabDates.map(date => scoreMap[date]);

    // 4. 정렬된 날짜(tabDates)로 X축 레이블 생성
    const labels = tabDates.map(d => {
      const date = new Date(d);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}/${day}`;
    });

    // 기존 차트 파괴
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // 새 차트 생성
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: '진단 점수',
          data: dataArr,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            title: {
              display: true,
              text: '진단 점수',
            }
          },
          x: {
            offset: true,
            title: {
              display: true,
              text: '진단 날짜',
            }
          }
        },
        plugins: {
          title: {
            display: !items || items.length === 0,
            text: '데이터가 없습니다.',
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
  }, [activeTab, groupedData]);

  if (loading) {
    return <div className="tab-content active"><p>로딩 중입니다...</p></div>;
  }

  if (error) {
    return <div className="tab-content active"><p>{error}</p></div>;
  }

  const diagnosisTypes = Object.keys(groupedData);

  if (diagnosisTypes.length === 0) {
    return <div className="tab-content active"><p>진단 내역이 없습니다.</p></div>;
  }

  return (
    <div className="tab-content active">
      <nav className="emotion-chart-nav">
        {diagnosisTypes.map(type => (
          <button
            key={type}
            className={`emotion-tab-button ${activeTab === type ? 'emotion-tab-button-active' : ''}`}
            onClick={() => setActiveTab(type)}
          >
            {type}
          </button>
        ))}
      </nav>

      <div className="emotion-chart-content">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default EmotionChart;