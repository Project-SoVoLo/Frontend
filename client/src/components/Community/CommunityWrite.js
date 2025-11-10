import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './Community.module.css';

function CommunityWrite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategory(cat);
    } else {
      navigate('/community');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    let apiUrl = '';
    let postData = {};

    switch (category) {
      case 'suggestion':
        apiUrl = '/api/inquiry';
        postData = { title, content, password };
        break;
      
      case 'board':
        apiUrl = '/api/community-posts';
        postData = { 
          title, 
          blocks: [{ type: 'text', content: content }]
        };
        break;
      
      default:
        setError('유효하지 않은 카테고리입니다.');
        return;
    }

    try {
      await axios.post(apiUrl, postData);
      
      alert('게시글이 성공적으로 등록되었습니다.');
      navigate(`/community?tab=${category}`);

    } catch (err) {
      console.error("게시글 등록 실패:", err);
      setError(err.response?.data?.message || err.message || '게시글 등록 중 오류가 발생했습니다.');
    }
  };

  const pageTitle = {
    suggestion: '건의사항 글쓰기',
    board: '커뮤니티 글쓰기',
  }[category];

  return (
    <div className={styles.contentContainer}>
      <h2>{pageTitle}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        
        {/* 건의사항 카테고리일 때만 비밀번호 입력 표시 */}
        {category === 'suggestion' && (
          <div className={styles.formGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="게시글 확인용 비밀번호 (숫자, 문자 등)"
              required
            />
          </div>
        )}
        
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">등록하기</button>
        <button type="button" onClick={() => navigate(-1)}>취소</button>
      </form>
    </div>
  );
}

export default CommunityWrite;