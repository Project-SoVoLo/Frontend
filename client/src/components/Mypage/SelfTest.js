import React, { useState } from 'react';
import { dummySelfTests } from './dummyData.js';
import './Mypage.css';

function SelfTest() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(dummySelfTests.length / itemsPerPage);
  const pageData = dummySelfTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="tab-content active">
      <div className="diagnosis-list">
        <table>
          <thead>
            <tr><th>제목</th><th>날짜</th></tr>
          </thead>
          <tbody>
            {pageData.map(d => (
              <tr key={d.id} className="clickable-row">
                <td>{d.title}</td><td>{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

export default SelfTest;