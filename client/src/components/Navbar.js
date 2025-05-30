import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logoImg from "../Images/logo.png"; 

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const menuItems = [
    "상담",
    "자가진단",
    "마인드케어",
    "커뮤니티",
    "마이페이지",
    "로그인",
  ];


  const dropdownSections = [
    [
      { text: "채팅 상담", to: "/chat" },
      { text: "음성 상담", to: "/chat" },
    ],
    [
      { text: "자가진단", to: "/diagnosis" },
    ],
    [
      { text: "명상", to: "/hospital_information" },
      { text: "치료센터/병원위치", to: "/location_and_pharmacies" },
    ],
    [
      { text: "공지사항", to: "/notice" },
      { text: "커뮤니티", to: "/health_magazine" },
      { text: "건의사항", to: "/receiving_suggestion" },
      { text: "카드뉴스", to: "/notice" },
    ],
    [
      { text: "개인정보 수정", to: "/reservation_info" },
      { text: "챗봇 상담 내역 확인", to: "/modify" },
      { text: "자가진단 내역 확인", to: "/questionnaire" },
      { text: "호전상태", to: "/reservation_info" },
    ],
    [] 
  ];

  return (
    <div className="nav-bg">
      <div className="navbar-container">
        <div className="logo-area">
          <Link to="/">
            <img src={logoImg} alt="소보로 로고" />
          </Link>
        </div>
        <div
          className="menu-center-wrapper"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <ul className="nav-menu">
            {menuItems.map((item, idx) => (
              <li key={item} className="nav-menu-item">
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {dropdownOpen && (
            <div className="dropdown-bg">
              <div className="dropdown-placeholder" />
              <div className="dropdown-menu">
                {dropdownSections.map((section, idx) => (
                  <div className="dropdown-section" key={idx}>
                    {section.map((btn) => (
                      <Link
                        to={btn.to}
                        className="dropdown-btn"
                        key={btn.text}
                      >
                        {btn.text}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
