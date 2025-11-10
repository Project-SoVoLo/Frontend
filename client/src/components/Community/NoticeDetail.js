import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './Community.module.css';

function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/notice/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error("공지사항 상세 조회 실패:", err);
        setError(err.message || '데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);


  const handleLike = async () => {
    if (isLiking) return; // 중복 클릭 방지
    setIsLiking(true);

    try {
      // API 명세서에 따라 POST 요청 (axios.js가 토큰을 헤더에 자동 추가)
      const response = await axios.post(`/api/notice/${id}/like`);
      
      // 서버가 보내준 최신 게시글 데이터로 post 상태를 업데이트
      setPost(response.data);
      setError(null); // 혹시 이전 에러가 있었다면 초기화
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      // 401(토큰 없음/만료) 또는 403(권한 없음) 등
      setError(err.response?.data?.message || '좋아요 처리에 실패했습니다. (로그인 필요)');
    } finally {
      setIsLiking(false);
    }
  };


  if (loading) {
    return <div className={styles.contentContainer}>로딩 중...</div>;
  }
  if (error) {
    return <div className={styles.contentContainer}>오류: {error}</div>;
  }
  if (!post) {
    return <div className={styles.contentContainer}>게시글을 찾을 수 없습니다.</div>;
  }

  // 날짜 포맷팅 (YYYY-MM-DD HH:MM)
  const formattedDate = post.date 
    ? post.date.replace('T', ' ').slice(0, 16) 
    : '날짜 없음';

  return (
    <div className={styles.contentContainer}>
      <div className={styles.detailHeader}>
        <h2 className={styles.detailTitle}>{post.title}</h2>
        <div className={styles.detailMeta}>
          <span>작성자: {post.adminId}</span> 
          <span>작성일: {formattedDate}</span>
        </div>
      </div>

      <div className={styles.detailContent}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
      </div>
      

      <div className={styles.detailActions}>
        <button 
          // post.liked 상태에 따라 CSS 클래스 동적 변경
          className={`${styles.likeButton} ${post.liked ? styles.liked : ''}`} 
          onClick={handleLike}
          disabled={isLiking} // 처리 중 비활성화
        >
          {/* ❤️ 🤍 (이모지 또는 아이콘) */}
          {post.liked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
          <span className={styles.likeCount}>{post.likeCount}</span>
        </button>
      </div>

      {/* [추가] 좋아요 처리 시 발생하는 에러 표시 위치 */}
      {error && <p className={styles.error}>{error}</p>}
      
      <hr className={styles.divider} />


      <button 
        className={styles.submitBtn} 
        onClick={() => navigate('/community?tab=notice')}
      >
        목록으로
      </button>
    </div>
  );
}

export default NoticeDetail;