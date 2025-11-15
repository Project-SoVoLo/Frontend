import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LayoutGrid, Heart, Bookmark } from 'lucide-react';
import axios from '../../api/axios';
import styles from './Profile.module.css';

const LoadingSpinner = () => (
  <div className={styles.loadingSpinner}>
    <div className={styles.spinner}></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className={styles.errorMessage}>
    <p>데이터를 불러오는 중 오류가 발생했습니다:</p>
    <p style={{ fontFamily: 'monospace', marginTop: '8px', fontSize: '13px' }}>
      {message}
    </p>
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => {
  const IconComponent = icon;
  return (
    <button
      onClick={onClick}
      className={`${styles.tabButton} ${active ? styles.tabButtonActive : ''}`}
    >
      <IconComponent size={18} className={styles.tabIcon} />
      <span>{label}</span>
    </button>
  );
};

const ProfileContent = ({ profile }) => {
  if (!profile) return null;

  const formatBirth = (birthDate) => {
    if (birthDate && typeof birthDate === 'string' && birthDate.length === 8 && !isNaN(Number(birthDate))) {
      const year = birthDate.slice(0, 4);
      const month = birthDate.slice(4, 6);
      const day = birthDate.slice(6, 8);
      return `${year}-${month}-${day}`;
    }

    if (birthDate && typeof birthDate === 'string' && birthDate.length >= 10 && birthDate[4] === '-') {
      return birthDate.slice(0, 10);
    }

    return birthDate || '정보 없음';
  };

  return (
    <div className={styles.profileContent}>
      <div className={styles.infoBox}>
        <span>이름</span>
        <span>{profile.userName}</span>
      </div>
      <div className={styles.infoBox}>
        <span>이메일</span>
        <span>{profile.userEmail}</span>
      </div>
      <div className={styles.infoBox}>
        <span>닉네임</span>
        <span>{profile.nickname}</span>
      </div>
      <div className={styles.infoBox}>
        <span>전화번호</span>
        <span>{profile.userPhone}</span>
      </div>
      <div className={styles.infoBox}>
        <span>생년월일</span>
        <span>{formatBirth(profile.userBirth)}</span>
      </div>
      <div className={styles.infoBox}>
        <span>성별</span>
        <span>{profile.userGender === 'F' ? '여성' : '남성'}</span>
      </div>
    </div>
  );

};

// const PostList = ({ posts, navigate }) => (
//   <ul className={styles.postList}>
//     {posts.length === 0 ? (
//       <p className={styles.noPosts}>작성한 글이 없습니다.</p>
//     ) : (
//       posts.map(post => (
//         <li
//           key={post.id}
//           className={`${styles.postItem} ${styles.postItemClickable}`}
//           onClick={() => navigate(`/board-detail/${post.id}`)} 
//         >
//           <span className={styles.postTitle}>{post.title}</span>
//           <span className={styles.postDate}>{post.date}</span>
//         </li>
//       ))
//     )}
//   </ul>
// );

const ListSection = ({ title, items, navigate }) => {
  if (items.length === 0) {
    return (
      <div className={styles.sectionEmpty}>
        <p className={styles.noPosts}>{title} 목록이 비어있습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.listSection}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <ul className={styles.postList}>
        {items.map(item => {
          let path = '/board-detail/';
          let idToUse = item.id; 

          if (item.postType === 'notice') {
            path = '/notice-detail/';
            idToUse = item.postId;
          } else if (item.postType === 'cardNews') {
            path = '/card-detail/';
            idToUse = item.postId;
          }
          
          // key는 두 ID 중 하나를 사용
          const key = item.id || item.postId; 

          return (
            <li
              key={key}
              className={`${styles.postItem} ${styles.postItemClickable}`}
              // 동적으로 결정된 path와 idToUse를 사용
              onClick={() => navigate(`${path}${idToUse}`)}
            >
              <span className={styles.postTitle}>{item.title}</span>
              {item.date && (
                <span className={styles.postDate}>{item.date}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const LikedOrBookmarkedList = ({ items, navigate, tabType }) => {
  const communityPosts = items.filter(
    item => item.postType === 'community' || item.postType === 'board' || !item.postType
  );
  const notices = items.filter(item => item.postType === 'notice');
  const cardNews = items.filter(item => item.postType === 'card');
  
  return (
    <div className={styles.sectionContainer}>
      {tabType === 'likes' && (
        <ListSection
          title="공지사항"
          items={notices}
          navigate={navigate}
        />
      )}

      <ListSection
        title="커뮤니티"
        items={communityPosts}
        navigate={navigate}
      />

      {tabType === 'bookmarks' && (
        <ListSection
        title="카드뉴스"
        items={cardNews}
        navigate={navigate}
      />
      )}      
    </div>
  );
};

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        setError(null);
        const response = await axios.get('/api/mypage/profile');
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    const loadTabData = async () => {
      if (activeTab === 'profile') {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let response;
        switch (activeTab) {
          case 'posts':
            response = await axios.get('/api/mypage/community-posts');
            setPosts(response.data || []);
            break;
          case 'likes':
            response = await axios.get('/api/mypage/likes');
            setLikes(response.data || []);
            break;
          case 'bookmarks':
            response = await axios.get('/api/mypage/bookmarks');
            setBookmarks(response.data || []);
            console.log(response.data);
            break;
          default:
            break;
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTabData();
  }, [activeTab]);

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    switch (activeTab) {
      case 'profile':
        return <ProfileContent profile={profile} />;
      case 'posts':
        //return <PostList posts={posts} navigate={navigate} />;
        return (
          <LikedOrBookmarkedList
            items={posts}
            navigate={navigate}
            tabType="posts"
          />
        );
      case 'likes':
        return (
          <LikedOrBookmarkedList
            items={likes}
            navigate={navigate}
            tabType="likes"
          />
        );
      case 'bookmarks':
        return (
          <LikedOrBookmarkedList
            items={bookmarks}
            navigate={navigate}
            tabType="bookmarks"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <header className={styles.header}>
          {profileLoading ? (
            <LoadingSpinner />
          ) : profile ? (
            <>
              <div className={styles.avatar}>
                {profile.nickname.charAt(0)}
              </div>
              <div className={styles.userInfo}>
                <h1>{profile.nickname}</h1>
                <p>{profile.userEmail}</p>
              </div>
            </>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : null}
        </header>

        <nav className={styles.nav}>
          <TabButton
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            icon={User}
            label="프로필"
          />
          <TabButton
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
            icon={LayoutGrid}
            label="작성한 글"
          />
          <TabButton
            active={activeTab === 'likes'}
            onClick={() => setActiveTab('likes')}
            icon={Heart}
            label="좋아요"
          />
          <TabButton
            active={activeTab === 'bookmarks'}
            onClick={() => setActiveTab('bookmarks')}
            icon={Bookmark}
            label="북마크"
          />
        </nav>

        <main className={styles.contentArea}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Profile;