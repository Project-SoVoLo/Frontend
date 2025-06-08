import React, { useState, useEffect } from 'react';
import './Mypage.css';
import './Detail.css';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { format } from 'date-fns';  //npm install date-fns 필요

function Counseling() {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [detailItem, setDetailItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 15;

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    // if (!token) {
    //   alert('로그인이 필요합니다.');
    //   nav('/login');  // 로그인 페이지로 리디렉션
    //   return;
    // }

    axios.get('/api/mypage/chat-summaries', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setData(response.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('데이터 로드 실패:', error);
        setLoading(false);
      });
  }, [token, nav]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="tab-content active">상담 데이터를 불러오는 중입니다...</div>;
  }

  if (!loading && data.length === 0) {
    return <div className="tab-content active">상담기록이 없습니다.</div>;
  }

  if (detailItem) {
    return (
      <div className="tab-content active">
        <p className="counseling-detail-date">
          {format(new Date(detailItem.date), 'yyyy-MM-dd')}
        </p>
        <table className="counseling-detail-table">
          <tbody>
            <tr>
              <td>요약</td>
              <td>{detailItem.summary}</td>
            </tr>
            <tr>
              <td>피드백</td>
              <td>{detailItem.feedback}</td>
            </tr>
            <tr>
              <td>감정</td>
              <td>{detailItem.emotionKo}</td>
            </tr>
          </tbody>
        </table>
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
              <td>{format(new Date(d.date), 'yyyy-MM-dd')}</td>
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
