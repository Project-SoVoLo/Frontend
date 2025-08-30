import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const BookmarkList = () => {
  const nav = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (!token) {
          alert('로그인이 필요합니다.');
          nav('/login');
          return;
        }
        const response = await axios.get("/api/mypage/bookmarks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookmarks(response.data);
      } catch (error) {
        console.error("북마크 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [nav, token]);

  if (loading) return <p>북마크 불러오는 중...</p>;

  // 카테고리별 그룹화
  const grouped = {
    notice: bookmarks.filter(bm => bm.type === "notice"),
    cardnews: bookmarks.filter(bm => bm.type === "cardnews"),
    community: bookmarks.filter(bm => bm.type === "community"),
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>내 북마크 목록</h2>

      {/* 공지사항 */}
      <h3>📢 공지사항</h3>
      {grouped.notice.length === 0 ? (
        <p>북마크한 공지사항이 없습니다.</p>
      ) : (
        <ul>
          {grouped.notice.map((bm) => (
            <li key={bm.id}>
              <a href={`/notice/${bm.postId}`}>{bm.title}</a>
              <span style={{ marginLeft: "8px", color: "gray" }}>
                ({new Date(bm.createdAt).toLocaleDateString()})
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* 카드뉴스 */}
      <h3>📰 카드뉴스</h3>
      {grouped.cardnews.length === 0 ? (
        <p>북마크한 카드뉴스가 없습니다.</p>
      ) : (
        <ul>
          {grouped.cardnews.map((bm) => (
            <li key={bm.id}>
              <a href={`/cardnews/${bm.postId}`}>{bm.title}</a>
              <span style={{ marginLeft: "8px", color: "gray" }}>
                ({new Date(bm.createdAt).toLocaleDateString()})
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* 커뮤니티 */}
      <h3>💬 커뮤니티</h3>
      {grouped.community.length === 0 ? (
        <p>북마크한 커뮤니티 글이 없습니다.</p>
      ) : (
        <ul>
          {grouped.community.map((bm) => (
            <li key={bm.id}>
              <a href={`/community/${bm.postId}`}>{bm.title}</a>
              <span style={{ marginLeft: "8px", color: "gray" }}>
                ({new Date(bm.createdAt).toLocaleDateString()})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookmarkList;
