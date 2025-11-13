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

    // 2. 토큰/이메일 유무 확인
    if (!token || !userEmail) {
      setError('로그인 정보가 필요합니다. 다시 로그인해주세요.');
      setLoading(false);
      return;
    }

    let endpoint = '';
    let payload = {};

    try {
      // 3. axios 요청 헤더를 구성합니다.
      const headers = {
        'Authorization': `Bearer ${token}`,
        'X-User-Id': userEmail
      };

      if (category === 'board') {
        // 커뮤니티 게시글 작성
        endpoint = `/api/community-posts`;
        payload = {
          title,
          blocks: [
            { type: 'text', content: content }
          ]
        };

        // 기본 유효성 검사
        if (!title || !content) {
          setError('제목과 내용을 모두 입력해주세요.');
          setLoading(false);
          return;
        }

      } else if (category === 'suggestion') {
        // 건의사항 게시판 글 작성
        endpoint = `/api/inquiry`;
        payload = {
          title,
          content,
          password
        };

        // 기본 유효성 검사
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

      // 4. axios.post 호출 시 payload와 **headers**를 함께 전달합니다.
      await axios.post(endpoint, payload, { headers: headers });

      // 작성 성공 시, 해당 카테고리 탭으로 이동
      navigate(`/community?tab=${category}`);

    } catch (err) {
      console.error("Post submission error:", err);
      // 서버에서 오는 에러 메시지가 있다면 표시, 없다면 기본 메시지
      const serverMessage = err.response?.data?.message;
      if (serverMessage) {
        setError(serverMessage); // "사용자 정보를 찾을 수 없습니다."
      } else {
        setError(err.message || '글 작성 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 취소 버튼 핸들러
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

              {/* 에러 메시지 표시 */}
              {error && <div className={styles.error}>{error}</div>}

              {/* 버튼 그룹 */}
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