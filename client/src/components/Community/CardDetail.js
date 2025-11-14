import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './Community.module.css';

import bookmarkEmptyIcon from '../../Images/bookmark_empty.png';
import bookmarkFilledIcon from '../../Images/bookmark_filled.png';

function CardDetail() {
  // 게시글 PostId
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isBookmarking, setIsBookmarking] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/card/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error("카드뉴스 상세 조회 실패:", err);
        setError(err.message || '데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // 북마크 
  const handleBookmark = async () => {
    if (isBookmarking) return;
    setIsBookmarking(true);
    
    try {
      const response = await axios.post(`/api/card/${id}/bookmark`);

      console.log('[북마크 성공] 서버 응답:', response.data);
      setPost(response.data);
      setError(null);
    } catch (err) {
      console.error("북마크 처리 실패:", err);
      setError(err.response?.data?.message || '북마크 처리에 실패했습니다. (로그인 필요)');
    } finally {
      setIsBookmarking(false);
    }
  };


  if (loading) {
    return <div className={styles.contentContainer}>로딩 중...</div>;
  }
  if (error && !post) {
    return <div className={styles.contentContainer}>오류: {error}</div>;
  }
  if (!post) {
    return <div className={styles.contentContainer}>게시글을 찾을 수 없습니다.</div>;
  }

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

        <div className={styles.cardImageContainer}>
          {post.imageUrls && post.imageUrls.map((imgUrl, index) => (
            <img
              key={index}
              src={`${process.env.REACT_APP_API_BASE_URL}${imgUrl}`}
              alt={`카드뉴스 이미지 ${index + 1}`}
              className={styles.cardImage}
            />
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <hr className={styles.divider} />

        <div className={styles.Btngroup}>
          <button
            className={styles.submitBtn}
            onClick={() => navigate('/community?tab=cardNews')}
          >
            목록으로
          </button>
          <button
            className={`${styles.bookmarkButton} ${post.bookmarked ? styles.bookmarked : ''}`}
            onClick={handleBookmark}
            disabled={isBookmarking}
          >
            <img
              src={post.bookmarked ? bookmarkFilledIcon : bookmarkEmptyIcon}
              alt="북마크 아이콘"
              className={styles.bookmarkIcon}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardDetail;