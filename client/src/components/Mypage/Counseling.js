import React, { useState, useEffect } from 'react';
import './Mypage.css';
import { useNavigate } from 'react-router-dom';

function Counseling() {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [detailItem, setDetailItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetch('/api/counseling') //실제 백엔드 API 주소
      .then(response => {
        if (!response.ok) {
          throw new Error('서버 응답 오류');
        }
        return response.json();
      })
      .then(json => setData(json))
      .catch(err => {
        console.error('데이터 로드 실패:', err);
      });
  }, []);

  const fetchDetail = (id) => {
    fetch(`/api/counselings/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('상세 내용 불러오기 실패');
        return res.json();
      })
      .then(data => setDetailItem(data))
      .catch(err => console.error(err));
  };

  //상담데이터 없거나 불러오기 실패
  if (detailItem === null) {
    return <div className="tab-content active">상담 데이터를 불러오는 중입니다...</div>;
  }

  if (fetchDetail) {
    return (
      <div className="tab-content active">
        <h3>{detailItem.title}</h3>
        <p><strong>날짜:</strong> {detailItem.date}</p>
        <p><strong>내용:</strong><br />{detailItem.content}</p>
        {/* <button className="back-button" onClick={() => setDetailItem(null)}>← 목록으로</button> */}
        <button className="back-button" type="button" onClick={() => {nav(-1);}}>
          ← 목록으로
        </button>
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="tab-content active">
      <table>
        <thead>
          <tr><th>제목</th><th>날짜</th></tr>
        </thead>
        <tbody>
          {pageData.map(d => (
            <tr key={d.id} className="clickable-row" onClick={() => setDetailItem(d)}>
              <td>{d.title}</td><td>{d.date}</td>
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