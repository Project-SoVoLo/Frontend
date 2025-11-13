import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './Community.module.css';

import bookmarkEmptyIcon from '../../Images/bookmark_empty.png';
import bookmarkFilledIcon from '../../Images/bookmark_filled.png';

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const currentUserNickname = localStorage.getItem('userNickname');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`/api/community-posts/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error("커뮤니티 상세 조회 실패:", err);
        setError(err.message || '데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleEditClick = () => {
    if (id && id !== 'undefined') {
      navigate(`/community-write?id=${id}`);
    } else {
      alert('게시글 ID가 올바르지 않아 수정할 수 없습니다.');
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return; 

    if (!window.confirm("정말 이 글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await axios.delete(`/api/community-posts/${id}`);

      alert("게시글이 삭제되었습니다.");
      navigate('/community?tab=board'); // 목록으로 이동

    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      // API 명세 "본인,관리자" -> 권한 오류가 주 원인일 수 있음
      setError(err.response?.data?.message || '삭제에 실패했습니다. (본인 글이 아니거나, 로그인 정보가 유효하지 않을 수 있습니다.)');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setError(null);
    try {
      //const response = await axios.post(`/api/community-posts/{postId}/like`);
      const response = await axios.post(`/api/community-posts/${id}/like`);
      const isNowLiked = response.data;

      setPost(prevPost => ({
        ...prevPost,
        likedByMe: isNowLiked, // API가 반환한 값으로 갱신
        // 카운트 수동 조절
        likeCount: isNowLiked
          ? prevPost.likeCount + 1
          // 0보다 작아지지 않게 방지
          : Math.max(0, prevPost.likeCount - 1)
      }));
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      setError(err.response?.data?.message || '좋아요 처리에 실패했습니다. (로그인 필요)');
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    if (isBookmarking) return;
    setIsBookmarking(true);
    setError(null);
    try {
      //const response = await axios.post(`/api/community-posts/{postId}/bookmark`);
      const response = await axios.post(`/api/community-posts/${id}/bookmark`);
      const isNowBookmarked = response.data; // API가 반환한 true 또는 false

      setPost(prevPost => ({
        ...prevPost,
        bookmarkedByMe: isNowBookmarked, // API가 반환한 값으로 갱신
        // 카운트 수동 조절
        bookmarkCount: isNowBookmarked
          ? prevPost.bookmarkCount + 1
          // 0보다 작아지지 않게 방지
          : Math.max(0, prevPost.bookmarkCount - 1)
      }));
    } catch (err) {
      console.error("북마크 처리 실패:", err);
      setError(err.response?.data?.message || '북마크 처리에 실패했습니다. (로그인 필요)');
    } finally {
      setIsBookmarking(false);
    }
  };


  if (loading) {
    return <div className={styles.contentContainer}><div className={styles.contentActive}>로딩 중...</div></div>;
  }
  if (error && !post) {
    return <div className={styles.contentContainer}><div className={styles.contentActive}>오류: {error}</div></div>;
  }
  if (!post) {
    return <div className={styles.contentContainer}><div className={styles.contentActive}>게시글을 찾을 수 없습니다.</div></div>;
  }

  const isOwner = post && currentUserNickname === post.nickname;

  const formattedDate = post.createdAt
    ? post.createdAt.replace('T', ' ').slice(0, 16)
    : '날짜 없음';

  return (
    <div className={styles.contentContainer}>
      <div className={styles.contentActive}>
        <div style={{ flexGrow: 1 }}>
          <div className={styles.detailHeader}>
            <h2 className={styles.detailTitle}>{post.title}</h2>
            <div className={styles.detailMeta}>
              <span>작성자: {post.nickname}</span>
              <span>작성일: {formattedDate}</span>
            </div>
          </div>

          <div className={styles.detailContent}>
            {/* [수정] 'board'는 content가 아닌 blocks 배열을 사용 */}
            {/* 우선 간단하게 첫 번째 텍스트 블록만 표시 (추후 'Editor.js' 등으로 대체 필요) */}
            {post.blocks && post.blocks.length > 0 ? (
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {post.blocks.find(block => block.type === 'text')?.content || '(내용 없음)'}
              </p>
            ) : (
              <p>(내용 없음)</p>
            )}
          </div>


        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div>
          <hr className={styles.divider} />
          <div className={styles.Btngroup}>
            <button
              className={styles.submitBtn}
              onClick={() => navigate('/community?tab=board')}
            >
              목록으로
            </button>

            {isOwner && (
              <>
                <button
                  className={styles.submitBtn}
                  onClick={handleEditClick} 
                >
                  수정하기
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? '삭제 중...' : '삭제하기'}
                </button>
              </>
            )}

            <button
              // [수정 3] post.liked -> post.likedByMe
              className={`${styles.likeButton} ${post.likedByMe ? styles.liked : ''}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              {post.likedByMe ? '❤️ 좋아요 취소' : '🤍 좋아요'}
              {/* [수정 3] post.likeCount */}
              <span className={styles.likeCount}>{post.likeCount}</span>
            </button>

            <button
              // [수정 3] post.bookmarked -> post.bookmarkedByMe
              className={styles.bookmarkButton}
              onClick={handleBookmark}
              disabled={isBookmarking}
            >
              <img
                src={post.bookmarkedByMe ? bookmarkFilledIcon : bookmarkEmptyIcon}
                alt="북마크 아이콘"
                className={styles.bookmarkIcon}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;