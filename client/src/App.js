import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.js";
import Chatbot from "./components/Chatbot/Chatbot.js";
import Footer from "./components/Footer/Footer.js";
import Main from "./components/Main/Main.js";
import Diagnosis from "./components/Diagnosis/Diagnosis.js";
import Community from "./components/Community/Community.js";
import CommunityWrite from "./components/Community/CommunityWrite.js";
import NoticeDetail from './components/Community/NoticeDetail';
import SuggestionDetail from './components/Community/SuggestionDetail';
import CardDetail from './components/Community/CardDetail';
import Mypage from "./components/Mypage/Mypage.js";
import Login from "./components/Login/Login.js";
import Signup from "./components/Signup/Signup.js";
import Counseling from "./components/Mypage/Counseling.js";
import SelfTest from "./components/Mypage/SelfTest.js";
import EmotionChart from "./components/Mypage/EmotionChart.js";
import EditProfile from "./components/Mypage/EditProfile.js";
import LoginExtraInfo from "./components/LoginExtraInfo/LoginExtraInfo.js";
import KakaoCallback from "./components/Login/KaKaoCallback.js";
import Location from "./components/Location/Location.js";
import Profile from "./components/Mypage/Profile.js";

function App() {
  return (
    <Router>
      <div className="app-root">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/diagnosis" element={<Diagnosis />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community-write" element={<CommunityWrite />} />
            <Route path="/notice-detail/:id" element={<NoticeDetail />} />
            <Route path="/suggestion-detail/:id" element={<SuggestionDetail />} />
            <Route path="/card-detail/:id" element={<CardDetail />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/counseling" element={<Counseling />} />
            <Route path="/self_test" element={<SelfTest />} />
            <Route path="/emotion_chart" element={<EmotionChart />} />
            <Route path="/edit_profile" element={<EditProfile />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login-extra-info" element={<LoginExtraInfo/>}/>
            <Route path="/kakao/callback" element={<KakaoCallback />} />
            <Route path="/location" element={<Location />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
