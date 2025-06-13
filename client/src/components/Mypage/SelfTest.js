import React, { useState, useEffect } from 'react';
import './Mypage.css';
import './Detail.css';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { format } from 'date-fns';  // npm install date-fns

function SelfTest() {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [detailItem, setDetailItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      nav('/login');
      return;
    }

    axios.get('/api/diagnosis/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then(response => {
      const sortedData = (response.data || []).sort(
        (a, b) => new Date(b.diagnosisDate) - new Date(a.diagnosisDate)
      );
      setData(sortedData);
      setLoading(false);
    }).catch(error => {
      console.error('진단 결과 로드 실패:', error);
      setLoading(false);
    });
  }, [token, nav]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="tab-content active">진단 결과를 불러오는 중입니다...</div>;
  }

  if (!loading && data.length === 0) {
    return <div className="tab-content active">진단 기록이 없습니다.</div>;
  }

  if (detailItem) {
    return (
      <div className="tab-content active">
        <p className="detail-date">
          {format(new Date(detailItem.diagnosisDate), 'yyyy-MM-dd')}
        </p>
        <div className="detail-table">
          <table className="detail-table">
            <tbody>
              <tr>
                <td>진단 유형</td>
                <td>{detailItem.diagnosisType}</td>
              </tr>
              <tr>
                <td>점수</td>
                <td>{detailItem.diagnosisScore}</td>
              </tr>
            </tbody>
          </table>
          <div className="back-list">
            <button className="back-button" type="button" onClick={() => setDetailItem(null)}>
              ← 목록으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content active">
      <div className="table-list">
        <table>
          <thead>
            <tr><th>진단 유형</th><th>날짜</th></tr>
          </thead>
          <tbody>
            {pageData.map((d, i) => (
              <tr
                key={`${d.diagnosisDate}-${d.diagnosisType}`}
                className="clickable-row"
                onClick={() => setDetailItem(d)}
              >
                <td>{d.diagnosisType}</td>
                <td>{format(new Date(d.diagnosisDate), 'yyyy-MM-dd')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={`page-${i}`}
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

export default SelfTest;