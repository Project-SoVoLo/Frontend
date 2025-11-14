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

  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  const currentUserNickname = localStorage.getItem('userNickname');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        setError(null);

        const postResponse = await axios.get(`/api/community-posts/${id}`);
        const postData = postResponse.data;

        const commentsResponse = await axios.get(`/api/community-posts/${id}/comments`);
        const commentsData = commentsResponse.data;

        setPost({
          ...postData,
          comments: commentsData
        });

      } catch (err) {
        console.error("게시글 또는 댓글 조회 실패:", err);
        setError(err.message || '데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
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
      navigate('/community?tab=board');
    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      setError(err.response?.data?.message || '삭제에 실패했습니다. (본인 글이 아니거나, 로그인 정보가 유효하지 않을 수 있습니다.)');
    } finally {
      setIsDeleting(false);
    }
  };

  // 댓글
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    setCommentError(null);

    const userId = localStorage.getItem('userEmail');

    if (!userId) {
      setCommentError('댓글을 작성하려면 로그 정보(userId)가 필요합니다. 다시 로그인해 주세요.');
      setIsSubmittingComment(false);
      return;
    }

    try {
      const response = await axios.post(`/api/community-posts/${id}/comments`, {
        // userId: userId,
        // userName: userId,
        content: newComment
      });

      console.log("서버로부터 받은 댓글 응답:", response.data);

      setPost(prevPost => ({
        ...prevPost,
        comments: [...(prevPost.comments || []), response.data]
      }));
      setNewComment('');
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      setCommentError(err.response?.data?.message || '댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await axios.delete(`/api/community-posts/${id}/comments/${commentId}`);

      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.filter(c => c.commentId !== commentId)
      }));
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      alert(err.response?.data?.message || '댓글 삭제에 실패했습니다. (권한 없음)');
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditingCommentContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.put(
        `/api/community-posts/${id}/comments/${commentId}`,
        { content: editingCommentContent }
      );

      const updatedComment = response.data;
      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.map(c =>
          c.commentId === updatedComment.commentId ? updatedComment : c
        )
      }));
      handleCancelEdit();
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      alert(err.response?.data?.message || '댓글 수정에 실패했습니다. (권한 없음)');
    }
  };

  // 좋아요
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setError(null);
    try {
      const response = await axios.post(`/api/community-posts/${id}/like`);
      const isNowLiked = response.data;

      setPost(prevPost => ({
        ...prevPost,
        likedByMe: isNowLiked,
        likeCount: isNowLiked
          ? prevPost.likeCount + 1
          : Math.max(0, prevPost.likeCount - 1)
      }));
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      setError(err.response?.data?.message || '좋아요 처리에 실패했습니다. (로그인 필요)');
    } finally {
      setIsLiking(false);
    }
  };

  // 북마크
  const handleBookmark = async () => {
    if (isBookmarking) return;
    setIsBookmarking(true);
    setError(null);
    try {
      const response = await axios.post(`/api/community-posts/${id}/bookmark`);
      const isNowBookmarked = response.data;

      setPost(prevPost => ({
        ...prevPost,
        bookmarkedByMe: isNowBookmarked,
        bookmarkCount: isNowBookmarked
          ? prevPost.bookmarkCount + 1
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
            {post.blocks && post.blocks.length > 0 ? (
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {post.blocks.find(block => block.type === 'text')?.content || '(내용 없음)'}
              </p>
            ) : (
              <p>(내용 없음)</p>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.commentSection}>
            <h3 className={styles.commentTitle}>댓글 ({post.comments?.length || 0})</h3>

            {/* 댓글 목록 */}
            <div className={styles.commentList}>
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.commentId} className={styles.commentItem}>
                    {editingCommentId === comment.commentId ? (
                      /*  수정 모드 (editCommentId === 현재 댓글 ID) */
                      <form className={styles.editCommentForm}>
                        <strong>{comment.nickname || comment.userName || comment.userId} (수정 중)</strong>
                        <textarea
                          value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)}
                          className={styles.commentTextarea}
                          style={{ minHeight: '80px', margin: '10px 0' }}
                        />
                        <div className={styles.commentActions}>
                          <button
                            type="button"
                            className={styles.submitBtn}
                            onClick={() => handleUpdateComment(comment.commentId)}
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={handleCancelEdit}
                          >
                            취소
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <strong>{comment.nickname || comment.userName || comment.userId}</strong>
                        <p>{comment.content}</p>
                        <span className={styles.commentDate}>
                          {comment.updatedAt ? comment.updatedAt.replace('T', ' ').slice(0, 16)
                            : comment.createdAt ? comment.createdAt.replace('T', ' ').slice(0, 16)
                              : ''}
                        </span>

                        {/* 수정/삭제 버튼 (본인 확인) */
                          // currentUserNickname === comment.nickname && (
                          //   <div className={styles.commentActions}>
                          //     <button
                          //       className={styles.commentActionButton}
                          //       onClick={() => handleEditComment(comment)}
                          //     >
                          //       수정
                          //     </button>
                          //     <button
                          //       className={styles.commentActionButton}
                          //       onClick={() => handleDeleteComment(comment.commentId)}
                          //     >
                          //       삭제
                          //     </button>
                          //   </div>
                          // )
                        }
                        {(() => {
                          console.log('현재 유저:', currentUserNickname, '댓글 작성자:', comment.nickname);

                          if (currentUserNickname === comment.nickname) {
                            return (
                              <div className={styles.commentActions}>
                                <button
                                  className={styles.commentActionButton}
                                  onClick={() => handleEditComment(comment)}
                                >
                                  수정
                                </button>
                                <button
                                  className={styles.commentActionButton}
                                  onClick={() => handleDeleteComment(comment.commentId)}
                                >
                                  삭제
                                </button>
                              </div>
                            );
                          }
                          return null; // 조건이 맞지 않으면 아무것도 렌더링하지 않음
                        })()
                        }
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p>작성된 댓글이 없습니다.</p>
              )}
            </div>

            <hr className={styles.divider} />

            {/* 새 댓글 작성 */}
            <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className={styles.commentTextarea}
                required
              />
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmittingComment}
              >
                {isSubmittingComment ? '등록 중...' : '댓글 등록'}
              </button>
              {commentError && <p className={styles.error}>{commentError}</p>}
            </form>
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
              className={`${styles.likeButton} ${post.likedByMe ? styles.liked : ''}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              {post.likedByMe ? '❤️ 좋아요 취소' : '🤍 좋아요'}
              <span className={styles.likeCount}>{post.likeCount}</span>
            </button>

            <button
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