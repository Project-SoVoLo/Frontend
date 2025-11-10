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
    // 1. 사용자에게 재확인
    if (!window.confirm("정말 이 글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // 2. API 명세서대로 DELETE 요청 (비밀번호는 '조회' 시 사용했던 것을 재사용)
      //    axios.delete는 body를 보낼 때 { data: { ... } } 객체로 감싸야 합니다.
      await axios.delete(`/api/inquiry/${id}`, {
        data: { password: password }
      });

      // 3. 삭제 성공
      alert("게시글이 삭제되었습니다.");
      navigate('/community?tab=suggestion'); // 목록으로 이동

    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      // 4. 삭제 실패 (예: 비밀번호가 바뀐 경우, 서버 오류 등)
      setError(err.response?.data?.message || '삭제에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // 빈 댓글 방지

    setIsSubmittingComment(true);
    setCommentError(null);

    // [중요] localStorage에서 userId와 userName을 가져옵니다.
    // ※ 이 부분이 작동하려면 Login.js 수정이 필요합니다. (2단계 참고)
    const userId = localStorage.getItem('userEmail'); // Login.js에서 저장한 값

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

      // API 응답으로 받은 새 댓글을 post 상태에 추가
      setPost(prevPost => ({
        ...prevPost,
        comments: [...prevPost.comments, response.data]
      }));
      setNewComment(''); // 입력창 비우기

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
        <h2 className={styles.detailTitle}>비밀번호 확인</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          이 게시글은 작성 시 설정한 비밀번호가 필요합니다.
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
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
          
          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={loading}
          >
            {loading ? '확인 중...' : '확인'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/community?tab=suggestion')} 
            className={styles.cancelBtn}
          >
            목록으로
          </button>
        </form>
      </div>
    );
  }

//   return (
//     <div className={styles.contentContainer}>
//       <div className={styles.detailHeader}>
//         <h2 className={styles.detailTitle}>{post.title}</h2>
//       </div>

//       <div className={styles.detailContent}>
//         <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
//         {post.comments && post.comments.length > 0 && (
//           <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
//             <strong>댓글:</strong>
//             {post.comments.map((comment, idx) => (
//               <p key={idx}>{comment.content} (by {comment.userId})</p>
//             ))}
//           </div>
//         )}
//       </div>

//       <button 
//         className={styles.submitBtn} 
//         onClick={() => navigate('/community?tab=suggestion')}
//       >
//         목록으로
//       </button>

//        <button 
//         className={styles.deleteBtn}
//         onClick={handleDelete}
//         disabled={loading}
//       >
//         {loading ? '삭제 중...' : '삭제하기'}
//       </button>
//       {error && <p className={styles.error} style={{ marginTop: '15px' }}>{error}</p>}
//     </div>
//   );
// }

return (
    <div className={styles.contentContainer}>
      <div className={styles.detailHeader}>
        <h2 className={styles.detailTitle}>{post.title}</h2>
      </div>

      <div className={styles.detailContent}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
      </div>
      
      <hr className={styles.divider} />

      {/* --- [수정] 댓글 섹션 --- */}
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
      {/* --- 댓글 섹션 끝 --- */}

      <hr className={styles.divider} />
      
      {/* 목록/삭제 버튼 */}
      <div>
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
  );
}

export default SuggestionDetail;