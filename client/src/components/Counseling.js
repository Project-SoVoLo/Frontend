import React, { useState } from 'react';
import { dummyCounselings } from './dummyData.js';

function Counseling() {
  const [detailItem, setDetailItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  if (detailItem) {
    return (
      <div className="tab-content active">
        <h3>{detailItem.title}</h3>
        <p><strong>날짜:</strong> {detailItem.date}</p>
        <p><strong>내용:</strong><br />{detailItem.content}</p>
        <button className="back-button" onClick={() => setDetailItem(null)}>← 목록으로</button>
      </div>
    );
  }

  const totalPages = Math.ceil(dummyCounselings.length / itemsPerPage);
  const pageData = dummyCounselings.slice(
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