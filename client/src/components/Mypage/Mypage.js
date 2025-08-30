import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Counseling from './Counseling';
import SelfTest from './SelfTest';
import EmotionChart from './EmotionChart';
import EditProfile from './EditProfile';
import BookmarkList from './BookMark';
import './Mypage.css';

function MyPage() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'counseling';
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    const newTab = searchParams.get('tab');
    if (newTab && newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [searchParams, activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'counseling': return <Counseling />;
      case 'self_test': return <SelfTest />;
      case 'emotion_chart': return <EmotionChart />;
      case 'edit_profile': return <EditProfile />;
      case 'book_mark': return <BookmarkList />
      default: return null;
    }
  };

  return (
    <div className="container">
      <div className="main-container">
        <div className="sidebar">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="content-container">
          <div className="content active">
          {renderContent()}
        </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;