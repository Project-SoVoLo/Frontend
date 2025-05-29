import React from "react";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="main-content">
        <Chatbot />
      </main>
      <Footer/>
    </div>
  );
}

export default App;
