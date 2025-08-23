import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Community.module.css";

import CardNews from "./CardNews";

function Community() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get("tab") || "notice";
  const [category, setCategory] = useState(defaultTab);

  useEffect(() => {
    const newTab = searchParams.get("tab");
    if (newTab && newTab !== category) {
      setCategory(newTab);
    }
  }, [searchParams, category]);

  const noticePosts = [
    { title: "서비스 점검 안내", date: "2025.06.01" },
    { title: "새로운 기능 업데이트 안내", date: "2025.05.25" },
    { title: "이용약관 변경 안내", date: "2025.05.10" },
  ];
  const boardPosts = [
    { title: "서비스 이용 관련 문의드립니다", date: "2025.04.01" },
    { title: "로그인 오류가 발생했어요", date: "2025.03.28" },
    { title: "회원가입 절차에 대해 질문있습니다", date: "2025.03.25" },
    { title: "결제 시스템 문의", date: "2025.03.20" },
  ];
  const suggestionPosts = [
    { title: "서비스 개선 아이디어 제안", date: "2025.04.03" },
    { title: "모바일 앱 기능 추가 요청", date: "2025.03.30" },
    { title: "웹사이트 디자인 개선 제안", date: "2025.03.27" },
    { title: "새로운 서비스 아이디어", date: "2025.03.22" },
  ];

  const tabs = [
    { key: "notice", label: "공지사항", description: "공지사항 소개글" },
    { key: "board", label: "커뮤니티", description: "커뮤니티 소개글" },
    { key: "suggestion", label: "건의사항", description: "건의사항 소개글" },
    { key: "cardNews", label: "카드뉴스", description: "심리 건강에 도움이 되는 카드뉴스를 확인하세요" },
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

  const listPosts = {
    notice: noticePosts,
    board: boardPosts,
    suggestion: suggestionPosts,
  }[category];

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {}
        <aside className={styles.sidebar}>
          <div className={styles.buttonContainer}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.categoryBtn} ${category === tab.key ? styles.categoryBtnActive : ""}`}
                onClick={() => {
                  setCategory(tab.key);
                  navigate(`/community?tab=${tab.key}`);
                }}
              >
                <h3>{tab.label}</h3>
                <p>{tab.description}</p>
              </button>
            ))}
          </div>
        </aside>

        {}
        <section className={styles.contentContainer}>
          <div className={`${styles.content} ${styles.contentActive}`}>
            <h2>{tabs.find((t) => t.key === category)?.label}</h2>
            <p className={styles.contentDescription}>{currentDescription}</p>
            <div className={styles.categoryInfo}>
              <p>Category: {currentCategoryInfo.category}</p>
              <p>Since: {currentCategoryInfo.since}</p>
            </div>

            {}
            {category === "cardNews" ? (
              <CardNews />
            ) : (
              <>
                {}
                <div className={styles.buttonGroup}>
                  <button className={styles.actionBtn}>글쓰기</button>
                  <button className={styles.actionBtn}>블로그</button>
                  {category === "board" && (
                    <>
                      <button className={styles.actionBtn}>인스타</button>
                      <button className={styles.actionBtn}>유튜브</button>
                    </>
                  )}
                </div>

                <ul className={styles.postList}>
                  {listPosts?.map((post, idx) => (
                    <li className={styles.postItem} key={idx}>
                      <span className={styles.postTitle}>{post.title}</span>
                      <span className={styles.postDate}>{post.date}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Community;
