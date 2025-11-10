import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './Community.module.css'; 

import bookmarkEmptyIcon from '../../Images/bookmark_empty.png';
import bookmarkFilledIcon from '../../Images/bookmark_filled.png';

function CardDetail() {
  const { id } = useParams(); // URL에서 :id 값(cardId)을 가져옵니다.
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isBookmarking, setIsBookmarking] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // API 명세서에 따라 /api/card/{id} 경로로 GET 요청
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

  const handleBookmark = async () => {
    if (isBookmarking) return; // 중복 클릭 방지
    setIsBookmarking(true);

    try {
      // API 명세서에 따라 POST 요청 (axios.js가 토큰 자동 추가)
      const response = await axios.post(`/api/card/${id}/bookmark`);
      
      // 서버가 보내준 최신 게시글 데이터로 post 상태를 업데이트
      setPost(response.data);
      setError(null); // 이전 에러 초기화
    } catch (err) {
      console.error("북마크 처리 실패:", err);
      // 401 (로그인 필요) 등
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

  // 날짜 포맷팅 (YYYY-MM-DD HH:MM)
  const formattedDate = post.date 
    ? post.date.replace('T', ' ').slice(0, 16) 
    : '날짜 없음';

  return (
    <div className={styles.contentContainer}>
      {/* NoticeDetail.js에서 사용한 스타일 재사용 */}
      <div className={styles.detailHeader}>
        <h2 className={styles.detailTitle}>{post.title}</h2>
        <div className={styles.detailMeta}>
          <span>작성자: {post.adminId}</span> 
          <span>작성일: {formattedDate}</span>
        </div>
      </div>

      <div className={styles.detailContent}>
        {/* 텍스트 본문 */}
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
      </div>
      
      {/* [추가] 카드뉴스 이미지 목록 */}
      <div className={styles.cardImageContainer}>
        {post.imageUrls && post.imageUrls.map((imgUrl, index) => (
          <img 
            key={index}
            // [중요] imgUrl이 /uploads/... 형태이므로, 백엔드 URL을 앞에 붙여줍니다.
            src={`${process.env.REACT_APP_API_BASE_URL}${imgUrl}`} 
            alt={`카드뉴스 이미지 ${index + 1}`}
            className={styles.cardImage}
          />
        ))}
      </div>
      
        {/* [추가] 북마크 버튼 섹션 */}
      <div className={styles.detailActions}>
        
      </div>

      {/* [추가] 북마크 처리 시 발생하는 에러 표시 위치 */}
      {error && <p className={styles.error}>{error}</p>}


      <hr className={styles.divider} /> 
      
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
            src={post.bookmarked ? bookmarkFilledIcon : bookmarkEmptyIcon} // [수정] 상태에 따라 아이콘 변경
            alt="북마크 아이콘" 
            className={styles.bookmarkIcon} // [수정] 이미지 스타일
          />
        </button>
    </div>
  );
}

export default CardDetail;