import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Diagnosis from "./components/Diagnosis.js";
import Mypage from "./components/Mypage.js";
import Counseling from "./components/Counseling.js";
import SelfTest from "./components/SelfTest.js";
import EmotionChart from "./components/EmotionChart.js";
import EditProfile from "./components/EditProfile.js";

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
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/counseling" element={<Counseling />} />
            <Route path="/self_test" element={<SelfTest />} />
            <Route path="/emotion_chart" element={<EmotionChart />} />
            <Route path="/edit_profile" element={<EditProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
