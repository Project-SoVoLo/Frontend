import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './Community.module.css';

function CommunityWrite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTitle = () => {
    if (category === 'board') return '커뮤니티 글쓰기';
    if (category === 'suggestion') return '건의사항 작성';
    return '글쓰기';
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    const userNickname = localStorage.getItem('userNickname');

    if (!token || !userEmail) {
      setError('로그인 정보가 필요합니다. 다시 로그인해주세요.');
      setLoading(false);
      return;
    }

    let endpoint = '';
    let payload = {};

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'X-User-Id': userEmail
      };

      if (category === 'board') {
        endpoint = `/api/community-posts`;
        payload = {
          title,
          blocks: [
            { type: 'text', content: content }
          ]
        };

        if (!title || !content) {
          setError('제목과 내용을 모두 입력해주세요.');
          setLoading(false);
          return;
        }

      } else if (category === 'suggestion') {
        endpoint = `/api/inquiry`;
        payload = {
          title,
          content,
          password
        };

        if (!title || !content || !password) {
          setError('제목, 내용, 비밀번호를 모두 입력해주세요.');
          setLoading(false);
          return;
        }

      } else {
        setError('유효하지 않은 카테고리입니다.');
        setLoading(false);
        return;
      }

      console.log("==========글쓰기 요청 전송==========");
      if (token) {
        console.log("포함될 토큰 (앞 10자리):", token.substring(0, 10) + "...");
      } else {
        console.warn("localStorage에 'token'이 없습니다. (요청이 실패할 수 있습니다)");
      }
      
      if (userEmail) {
        console.log("포함될 X-User-Id:", userEmail);
      } else {
        console.warn("localStorage에 'userEmail'이 없습니다. (요청이 실패할 수 있습니다)");
      }

      if(userNickname){
        console.log("userNickname:", userNickname);
      } else {
        console.warn("localStorage에 'userNickname'이 없습니다. (요청이 실패할 수 있습니다)");
      }

      console.log("요청 엔드포인트:", endpoint, payload);
      console.log("===================================");

      await axios.post(endpoint, payload, { headers: headers });

      navigate(`/community?tab=${category}`);

    } catch (err) {
      console.error("Post submission error:", err);
      const serverMessage = err.response?.data?.message;
      if (serverMessage) {
        setError(serverMessage);
      } else {
        setError(err.message || '글 작성 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/community?tab=${category || 'notice'}`);
  };

  // 'board' 또는 'suggestion'이 아닐 경우
  useEffect(() => {
    if (!category || (category !== 'board' && category !== 'suggestion')) {
      navigate('/community?tab=notice');
    }
  }, [category, navigate]);

  if (!category || (category !== 'board' && category !== 'suggestion')) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.contentContainer} style={{ flex: 1, minWidth: 0 }}>
          <div className={`${styles.content} ${styles.contentActive}`}>
            <h2>{getTitle()}</h2>

            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>

              <div className={styles.formGroup}>
                <label htmlFor="title">제목</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="content">내용</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력하세요"
                  style={{ flexGrow: 1, minHeight: '250px' }}
                />
              </div>

              {/* 건의사항일 때만 비밀번호 필드 표시 */}
              {category === 'suggestion' && (
                <div className={styles.formGroup}>
                  <label htmlFor="password">비밀번호</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    autoComplete="new-password"
                  />
                </div>
              )}

              {error && <div className={styles.error}>{error}</div>}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCancel}
                  disabled={loading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? '등록 중...' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityWrite;