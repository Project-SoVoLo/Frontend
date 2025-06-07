import React, { useState, useEffect } from 'react';
import './Mypage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Counseling() {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [detailItem, setDetailItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 15;

  // 예시용 토큰 - 실제 토큰으로 교체하거나 상태관리에서 받아오세요
  const token = 'YOUR_ACCESS_TOKEN';

  useEffect(() => {
    axios.get('/api/mypage/chat-summaries', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('데이터 로드 실패:', error);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="tab-content active">상담 데이터를 불러오는 중입니다...</div>;
  }

  if (detailItem) {
    return (
      <div className="tab-content active">
        <h3>요약: {detailItem.summary}</h3>
        <p><strong>날짜:</strong> {detailItem.date}</p>
        <p><strong>피드백:</strong> {detailItem.feedback}</p>
        <p><strong>감정:</strong> {detailItem.emotionType}</p>
        <button className="back-button" type="button" onClick={() => setDetailItem(null)}>
          ← 목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="tab-content active">
      <table>
        <thead>
          <tr><th>요약</th><th>날짜</th></tr>
        </thead>
        <tbody>
          {pageData.map(d => (
            <tr key={d.id} className="clickable-row" onClick={() => setDetailItem(d)}>
              <td>{d.summary}</td>
              <td>{d.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Counseling;
