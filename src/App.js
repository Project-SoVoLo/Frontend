// src/App.jsx
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CounselingTab from './components/CounselingTab';
import SelfTestTab from './components/SelfTestTab';
import EmotionChart from './components/EmotionChart';
import EditProfile from './components/EditProfile';
import './style/myPage.css';

function App() {
  const [activeTab, setActiveTab] = useState('counseling');

  const renderContent = () => {
    switch (activeTab) {
      case 'counseling':
        return <CounselingTab />;
      case 'selftest':
        return <SelfTestTab />;
      case 'emotion':
        return <EmotionChart />;
      case 'editprofile':
        return <EditProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>
      <main className="content">{renderContent()}</main>
    </div>
  );
}

export default App;