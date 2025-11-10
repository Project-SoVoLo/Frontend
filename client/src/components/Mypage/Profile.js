import React, { useState, useEffect } from 'react';
import { User, LayoutGrid, Heart, Bookmark } from 'lucide-react';

const fetchWithAuth = async (url) => {
  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
  }

  const contentLength = response.headers.get('content-length');
  if (!contentLength || parseInt(contentLength, 10) === 0) {
    return null;
  }
  
  try {
    return await response.json();
  } catch (e) {
    console.error("JSON 파싱 에러", e);
    throw new Error("응답 데이터 형식이 잘못되었습니다.");
  }
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="p-4 bg-red-900 text-red-100 rounded-lg">
    <p>데이터를 불러오는 중 오류가 발생했습니다:</p>
    <p className="font-mono mt-2 text-sm">{message}</p>
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => {
  const IconComponent = icon;
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 group flex items-center justify-center gap-2 py-4 px-3 
        font-medium text-sm border-b-2 transition-all duration-200
        ${
          active
            ? 'border-blue-500 text-white'
            : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200'
        }
      `}
    >
      <IconComponent size={18} className={`transition-all ${active ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-300'}`} />
      <span>{label}</span>
    </button>
  );
};

const ProfileContent = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">상세 정보</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
        <div className="bg-gray-700 p-3 rounded-lg">
          <span className="text-sm text-gray-400 block">이름</span>
          <span className="text-white">{profile.userName}</span>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <span className="text-sm text-gray-400 block">이메일</span>
          <span className="text-white">{profile.userEmail}</span>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <span className="text-sm text-gray-400 block">닉네임</span>
          <span className="text-white">{profile.nickname}</span>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <span className="text-sm text-gray-400 block">전화번호</span>
          <span className="text-white">{profile.userPhone}</span>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <span className="text-sm text-gray-400 block">생년월일</span>
          <span className="text-white">{profile.userBirth}</span>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <span className="text-sm text-gray-400 block">성별</span>
          <span className="text-white">{profile.userGender === 'F' ? '여성' : '남성'}</span>
        </div>
      </div>
    </div>
  );
};

const PostList = ({ posts }) => (
  <div className="space-y-4">
    {posts.length === 0 ? (
      <p className="text-gray-400 text-center">작성한 글이 없습니다.</p>
    ) : (
      posts.map(post => (
        <div key={post.id} className="bg-gray-700 p-4 rounded-lg shadow">
          {/* API 응답 구조에 맞게 이 부분을 수정해야 합니다. */}
          <p className="text-gray-200">{post.content}</p>
        </div>
      ))
    )}
  </div>
);

const LikedOrBookmarkedList = ({ items }) => (
  <div className="space-y-4">
    {items.length === 0 ? (
      <p className="text-gray-400 text-center">목록이 비어있습니다.</p>
    ) : (
      items.map(item => (
        <div key={item.id} className="bg-gray-700 p-4 rounded-lg shadow flex gap-4">
          <img 
            src={item.authorAvatar || 'https://placehold.co/64x64/7f8c8d/ffffff?text=?'} 
            alt={item.author} 
            className="w-10 h-10 rounded-full flex-shrink-0 mt-1"
            onError={(e) => { e.target.src = 'https://placehold.co/64x64/7f8c8d/ffffff?text=Err'; }}
          />
          <div>
             {/* API 응답 구조에 맞게 이 부분을 수정해야 합니다. */}
            <span className="font-semibold text-white">{item.author}</span>
            <p className="text-gray-300 mt-1">{item.content}</p>
          </div>
        </div>
      ))
    )}
  </div>
);

// --- 메인 App 컴포넌트 ---
function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
 
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        setError(null);
        const data = await fetchWithAuth('/api/mypage/profile');
        setProfile(data);
      } catch (err) {
        setError(err.message);
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
      if (activeTab === 'posts' && posts.length > 0) return;
      if (activeTab === 'likes' && likes.length > 0) return;
      if (activeTab === 'bookmarks' && bookmarks.length > 0) return;

      setLoading(true);
      setError(null);
      
      try {
        let data;
        switch (activeTab) {
          case 'posts':
            data = await fetchWithAuth('/api/mypage/community-posts');
            setPosts(data || []);
            break;
          case 'likes':
            data = await fetchWithAuth('/api/mypage/likes');
            setLikes(data || []);
            break;
          case 'bookmarks':
            data = await fetchWithAuth('/api/mypage/bookmarks');
            setBookmarks(data || []);
            break;
          default:
            break;
        }
      } catch (err) {
        setError(err.message);
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
        return <PostList posts={posts} />;
      case 'likes':
        return <LikedOrBookmarkedList items={likes} />;
      case 'bookmarks':
        return <LikedOrBookmarkedList items={bookmarks} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <header className="p-6 md:p-8 border-b border-gray-700 min-h-[160px]">
          {profileLoading ? (
            <LoadingSpinner />
          ) : profile ? (
            <div className="md:flex md:items-center md:gap-6">
              <img
                // API에 avatarUrl이 없으므로 임시 플레이스홀더 사용
                src={'https://placehold.co/128x128/3498db/ffffff?text=' + profile.nickname.charAt(0)}
                alt="Profile Avatar"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto md:mx-0 flex-shrink-0 shadow-md"
                onError={(e) => { e.target.src = 'https://placehold.co/128x128/7f8c8d/ffffff?text=Err'; }}
              />
              <div className="mt-4 md:mt-0 text-center md:text-left flex-1">
                {/* API 응답에 맞게 'nickname'과 'userEmail' 사용 */}
                <h1 className="text-3xl font-bold text-white">{profile.nickname}</h1>
                <p className="text-lg text-gray-400">@{profile.userEmail}</p>
              </div>
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : null}
        </header>

        <nav className="flex border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
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

        <main className="p-6 md:p-8">
          {renderContent()}
        </main>
        
      </div>
    </div>
  );
}

export default Profile;