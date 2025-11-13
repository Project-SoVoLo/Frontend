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
    if (isLiking) return;
    setIsLiking(true);
    try {
      const response = await axios.post(`/api/notice/${id}/like`);

      setPost(response.data);
      setError(null);
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
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
      <div className={styles.contentActive}>
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

        {error && <p className={styles.error}>{error}</p>}

        <hr className={styles.divider} />

        <div className={styles.Btngroup}>
          <button
            className={styles.submitBtn}
            onClick={() => navigate('/community?tab=notice')}
          >
            목록으로
          </button>

          <button
            className={`${styles.likeButton} ${post.liked ? styles.liked : ''}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            {post.liked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
            <span className={styles.likeCount}>{post.likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoticeDetail;