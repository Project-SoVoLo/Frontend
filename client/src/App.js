import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // 추가
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Diagnosis from "./components/Diagnosis.js";

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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
