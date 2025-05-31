import React, { useState } from 'react';
import Sidebar from './Sidebar.js';  // components 경로 수정 (상위 폴더에서 접근)
import Counseling from './Counseling.js';
import SelfTest from './SelfTest.js';
import EmotionChart from './EmotionChart.js';
import EditProfile from './EditProfile.js';
import './myPage.css'; // CSS 파일 경로는 필요에 따라 수정하세요.

function MyPage() {
  const [activeTab, setActiveTab] = useState('counseling');

  const renderContent = () => {
    switch (activeTab) {
      case 'counseling': return <Counseling />;
      case 'selftest': return <SelfTest />;
      case 'emotion': return <EmotionChart />;
      case 'editprofile': return <EditProfile />;
      default: return null;
    }
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>
      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
}

export default MyPage;
