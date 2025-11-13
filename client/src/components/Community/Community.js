import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './Community.module.css';
import axios from "../../api/axios";

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) {
    return null;
  }

  return (
    <nav>
      <ul className={styles.pagination}>
        {pageNumbers.map(number => (
          <li 
            key={number} 
            className={`${styles.pageItem} ${currentPage === number ? styles.pageItemActive : ''}`}
          >
            <a 
              onClick={() => paginate(number)} 
              href="#!"
              className={styles.pageLink}
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

function Community() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get('tab') || 'notice';
  const [category, setCategory] = useState(defaultTab);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);


  useEffect(() => {
    const newTab = searchParams.get('tab');
    if (newTab && newTab !== category) {
      setCategory(newTab);
      setCurrentPage(1);
    }
  }, [searchParams, category]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      setPosts([]);

      try {
        let apiUrl = '';
        const baseUrl = process.env.REACT_APP_API_BASE_URL;

        switch (category) {
          case 'notice':
            apiUrl = `${baseUrl}/api/notice`;
            break;
          case 'suggestion':
            apiUrl = `${baseUrl}/api/inquiry/all`;
            break;
          case 'board':
            apiUrl = `${baseUrl}/api/community-posts`;
            break;
          case 'cardNews':
            apiUrl = `${baseUrl}/api/card`;
            break;
          default:
            apiUrl = `${baseUrl}/api/${category}`;
            break;
        }

        const response = await axios.get(apiUrl);

        let data = response.data; 

        if (category !== 'suggestion' && Array.isArray(data)) {
          data.sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt).getTime();
            const dateB = new Date(b.date || b.createdAt).getTime();
            return dateB - dateA;
          });
        }

        setPosts(data);
      } catch (err) {
        setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);


  const renderContent = () => {
    if (loading) {
      return <div className={styles.loading}>로딩 중입니다...</div>;
    }

    if (error) {
      return <div className={styles.error}>오류가 발생했습니다: {error}</div>;
    }

    if (posts.length === 0) {
      return <div className={styles.noPosts}>게시글이 없습니다.</div>;
    }

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPostsOnPage = posts.slice(indexOfFirstPost, indexOfLastPost);
    if (currentPostsOnPage.length === 0 && posts.length > 0) {
      setCurrentPage(1);
      return null;
    }

    if (posts.length === 0) {
        return <div className={styles.noPosts}>게시글이 없습니다.</div>;
    }

    return (
      <ul className={styles.postList}>
        {currentPostsOnPage.map((post, idx) => {
          
          let displayData = '';
          let isClickable = false;
          let clickHandler = undefined;

          const dateString = post.date || post.createdAt;

          if (category === 'suggestion') {
            isClickable = true;
            clickHandler = () => navigate(`/suggestion-detail/${post.id}`);
            displayData = post.nickname;
          } 
          else if (category === 'notice') {
            isClickable = true;
            clickHandler = () => navigate(`/notice-detail/${post.postId}`);
            
            // 날짜 포맷팅
            if (dateString) {
              displayData = dateString.replace('T', ' ').slice(0, 16);
            }
          }

          else if (category === 'board') {
            isClickable = true;
            clickHandler = () => navigate(`/board-detail/${post.id}`);
            displayData = post.nickname;
          } 

          else if (category === 'cardNews') {
            isClickable = true;
            clickHandler = () => navigate(`/card-detail/${post.postId}`); 
            if (dateString) {
              displayData = dateString.replace('T', ' ').slice(0, 16);
            }
          }

          else {
            if (dateString) {
              displayData = dateString.replace('T', ' ').slice(0, 16);
            }
          }

          return (
            <li 
              className={`${styles.postItem} ${isClickable ? styles.postItemClickable : ''}`} 
              key={post.postId || post.id || idx}
              onClick={clickHandler}
            >
              <span className={styles.postTitle}>{post.title}</span>
              <span className={styles.postDate}>{displayData}</span>
            </li>
          );
        })}
      </ul>	
    );
  };

  // const noticePosts = [
  //   { title: "서비스 점검 안내", date: "2025.06.01" },
  //   { title: "새로운 기능 업데이트 안내", date: "2025.05.25" },
  //   { title: "이용약관 변경 안내", date: "2025.05.10" },
  // ];
  // const boardPosts = [
  //   { title: "서비스 이용 관련 문의드립니다", date: "2025.04.01" },
  //   { title: "로그인 오류가 발생했어요", date: "2025.03.28" },
  //   { title: "회원가입 절차에 대해 질문있습니다", date: "2025.03.25" },
  //   { title: "결제 시스템 문의", date: "2025.03.20" },
  // ];
  // const suggestionPosts = [
  //   { title: "서비스 개선 아이디어 제안", date: "2025.04.03" },
  //   { title: "모바일 앱 기능 추가 요청", date: "2025.03.30" },
  //   { title: "웹사이트 디자인 개선 제안", date: "2025.03.27" },
  //   { title: "새로운 서비스 아이디어", date: "2025.03.22" },
  // ];
  // const cardNewsPosts = [
  //   { title: "건강한 마음 가꾸기", date: "2025.04.15" },
  //   { title: "스트레스 관리 팁", date: "2025.04.10" },
  //   { title: "일상 속 소소한 행복", date: "2025.04.05" },
  // ];
  // const currentPosts = {
  //   notice: noticePosts,
  //   board: boardPosts,
  //   suggestion: suggestionPosts,
  //   cardNews: cardNewsPosts,
  // }[category];

  const tabs = [
    { key: "notice", label: "공지사항", description: "공지사항 소개글" },
    { key: "board", label: "커뮤니티", description: "커뮤니티 소개글" },
    { key: "suggestion", label: "건의사항", description: "건의사항 소개글" },
    { key: "cardNews", label: "카드뉴스", description: "카드뉴스 소개글" },
  ];

  const currentDescription = {
    notice: "공지사항을 확인하세요",
    board: "고객님의 문의사항을 해결해 드립니다",
    suggestion: "더 나은 서비스를 위한 의견을 제안해주세요",
    cardNews: "심리 건강에 도움이 되는 카드뉴스를 확인하세요",
  }[category];

  const currentCategoryInfo = {
    notice: { category: "공지", since: "2025" },
    board: { category: "문의", since: "2025" },
    suggestion: { category: "건의", since: "2025" },
    cardNews: { category: "카드뉴스", since: "2025" },
  }[category];

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <div className={styles.buttonContainer}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.categoryBtn} ${category === tab.key ? styles.categoryBtnActive : ""}`}
                onClick={() => {
                  // setCategory(tab.key);
                  // navigate(`/community?tab=${tab.key}`);
                  // setCurrentPage(1);
                  if (category !== tab.key) { // 같은 탭일 땐 다시 요청 안 보냄
      setCategory(tab.key);
      navigate(`/community?tab=${tab.key}`);
      setCurrentPage(1);
    }
                }}
              >
                <h3>{tab.label}</h3>
                <p>{tab.description}</p>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={`${styles.content} ${styles.contentActive}`}>
            <h2>{tabs.find(t => t.key === category)?.label}</h2>
            <p className={styles.contentDescription}>{currentDescription}</p>
            <div className={styles.categoryInfo}>
              <p>Category: {currentCategoryInfo.category}</p>
              <p>Since: {currentCategoryInfo.since}</p>
            </div>
            <div className={styles.buttonGroup}>
              {(category === 'board' || category === 'suggestion') && (
                <button 
                  className={styles.actionBtn} 
                  onClick={() => navigate(`/community-write?category=${category}`)}
                >
                  글쓰기
                </button>
              )}
              {/* {category === "cardNews" ? (
                <>
                  <button className={styles.actionBtn}>인스타</button>
                  <button className={styles.actionBtn}>유튜브</button>
                </>
              ) : (
                <>
                  <button className={styles.actionBtn}>블로그</button>
                  {category === "board" && (
                    <>
                      <button className={styles.actionBtn}>인스타</button>
                      <button className={styles.actionBtn}>유튜브</button>
                    </>
                  )}
                </>
              )} */}
            </div>
            {/* <ul className={styles.postList}>
              {currentPosts.map((post, idx) => (
                <li className={styles.postItem} key={idx}>
                  <span className={styles.postTitle}>{post.title}</span>
                  <span className={styles.postDate}>{post.date}</span>
                </li>
              ))}
            </ul> */}

            {renderContent()}

            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={posts.length}
              paginate={(pageNumber) => setCurrentPage(pageNumber)}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;