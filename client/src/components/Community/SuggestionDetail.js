import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './Community.module.css';

function SuggestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`/api/inquiry/${id}/read`, {
        password: password
      });
      setPost(response.data);
    } catch (err) {
      console.error("건의사항 조회 실패:", err);
      setError('비밀번호가 올바르지 않거나 게시물을 찾을 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 이 글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.delete(`/api/inquiry/${id}`, {
        data: { password: password }
      });

      alert("게시글이 삭제되었습니다.");
      navigate('/community?tab=suggestion');

    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      setError(err.response?.data?.message || '삭제에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    setCommentError(null);

    const userId = localStorage.getItem('userEmail');

    if (!userId) {
      setCommentError('댓글을 작성하려면 로그 정보(userId, userName)가 필요합니다. 다시 로그인해 주세요.');
      setIsSubmittingComment(false);
      return;
    }


    try {
      const response = await axios.post(`/api/inquiry/${id}/comments`, {
        userId: userId,
        userName: userId,
        content: newComment
      });

      setPost(prevPost => ({
        ...prevPost,
        comments: [...prevPost.comments, response.data]
      }));
      setNewComment('');

    } catch (err) {
      console.error("댓글 작성 실패:", err);
      setCommentError(err.response?.data?.message || '댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (!post) {
    return (
      <div className={styles.contentContainer}>
        <div className={styles.contentActive}>
          <h2 className={styles.detailTitle}>비밀번호 확인</h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            게시글 열람을 위해 게시글 작성 시 설정한 비밀번호가 필요합니다.
          </p>
          <form onSubmit={handleSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <div className={styles.formGroup} >
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.Btngroup}>
              <button
                type="button"
                onClick={() => navigate('/community?tab=suggestion')}
                className={styles.cancelBtn}
              >
                목록으로
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? '확인 중...' : '확인'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.contentActive}>
        <div className={styles.detailHeader}>
          <h2 className={styles.detailTitle}>{post.title}</h2>
        </div>

        <div className={styles.detailContent}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
        </div>

        <hr className={styles.divider} />

        <div className={styles.commentSection}>
          <h3 className={styles.commentTitle}>댓글 ({post.comments?.length || 0})</h3>

          {/* 댓글 목록 렌더링 */}
          <div className={styles.commentList}>
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.commentId} className={styles.commentItem}>
                  <strong>{comment.userName || comment.userId}</strong>
                  <p>{comment.content}</p>
                  <span className={styles.commentDate}>
                    {comment.date ? comment.date.replace('T', ' ').slice(0, 16) : ''}
                  </span>
                </div>
              ))
            ) : (
              <p>작성된 댓글이 없습니다.</p>
            )}
          </div>

          <hr className={styles.divider} />

          {/* 새 댓글 작성 폼 */}
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

        <hr className={styles.divider} />

        <div className={styles.Btngroup}>
          <button
            className={styles.submitBtn}
            onClick={() => navigate('/community?tab=suggestion')}
          >
            목록으로
          </button>
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? '삭제 중...' : '삭제하기'}
          </button>
          {error && <p className={styles.error} style={{ marginTop: '15px' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default SuggestionDetail;