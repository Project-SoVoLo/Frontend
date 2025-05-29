import React from "react";
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>상담</li>
        <li>자가진단</li>
        <li>명상</li>
        <li className="logo">소보로</li>
        <li>위치안내</li>
        <li>공지사항</li>
        <li>로그인/회원가입</li>
      </ul>
    </nav>
  );
}
