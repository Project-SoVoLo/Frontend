import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logoImg from "../../Images/logo.png";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    alert("로그아웃되었습니다.");
    navigate('/login'); 
  };

  const menuItems = [
    "상담",
    "자가진단",
    "마인드케어",
    "커뮤니티",
    "마이페이지",
    token ? "로그아웃" : "로그인" 
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
      { text: "치료센터/병원위치", to: "/location" },
    ],
    [
      { text: "공지사항", to: "/community?tab=notice" },
      { text: "커뮤니티", to: "/community?tab=board" },
      { text: "건의사항", to: "/community?tab=suggestion" },
      { text: "카드뉴스", to: "/community?tab=cardNews" },
    ],
    [
      { text: "챗봇 상담 내역 확인", to: "/mypage?tab=counseling" },
      { text: "자가진단 내역 확인", to: "/mypage?tab=self_test" },
      { text: "호전상태", to: "/mypage?tab=emotion_chart" },
      { text: "개인정보수정", to: "/mypage?tab=edit_profile" },
      { text: "북마크", to: "/mypage?tab=book_mark" },
    ],
    token
      ? [
          { text: "로그아웃", to: "#", onClick: handleLogout }
        ]
      : [
          { text: "로그인", to: "/login" },
          { text: "회원가입", to: "/signup" },
        ]
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
                <span
                  onClick={() => {
                    if (item === "로그아웃") handleLogout();
                  }}
                >
                  {item}
                </span>
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
                      btn.onClick ? (
                        <span
                          key={btn.text}
                          className="dropdown-btn"
                          onClick={btn.onClick}
                          style={{ cursor: 'pointer' }}
                        >
                          {btn.text}
                        </span>
                      ) : (
                        <Link
                          to={btn.to}
                          className="dropdown-btn"
                          key={btn.text}
                        >
                          {btn.text}
                        </Link>
                      )
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
