import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import b1 from '../assets/b1.png';
import b2 from '../assets/b2.png';
import b3 from '../assets/b3.png';
import b4 from '../assets/b4.png';

const Home = () => {
  const navigate = useNavigate();
  const scrollRefs = useRef([]);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToBelow = (index) => {
    if (isScrolling) return;
    const current = scrollRefs.current[index];
    const next = scrollRefs.current[index + 1];
    if (current && next) {
      setIsScrolling(true);
      const y = next.offsetTop;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setTimeout(() => setIsScrolling(false), 500);
    }
  };

  useEffect(() => {
    const handleWheel = (e, index) => {
      if (e.deltaY > 0) scrollToBelow(index);
    };

    const imgs = scrollRefs.current;
    imgs.forEach((el, idx) => {
      if (el) el.addEventListener('wheel', (e) => handleWheel(e, idx));
    });

    return () => {
      imgs.forEach((el, idx) => {
        if (el) el.removeEventListener('wheel', (e) => handleWheel(e, idx));
      });
    };
  }, []);

  const items = [
    { img: b1, text: '상담', link: 'chat.html' },
    { img: b2, text: '자가진단', link: 'selfcheck.html' },
    { img: b3, text: '치료센터/병원위치', link: 'meditation.html' },
    { img: b4, text: '커뮤니티', link: 'community.html' },
    { img: b1, text: '마이페이지', link: 'consult_log.html' },
    { img: b2, text: '로그인', link: 'login.html' }
  ];

  return (
    <>
      <div className="wrap">
        <Navbar />
      </div>
      <div className="container">
        <div className="logo"></div>
        <div className="wrap_box">
          {items.map((item, i) => (
            <div className="box" key={i} ref={(el) => scrollRefs.current[i] = el}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.link.endsWith('.html')) {
                    const route = '/' + item.link.replace('.html', '');
                    navigate(route);
                  } else {
                    scrollToBelow(i);
                  }
                }}
              >
                <div className="icon"><img src={item.img} alt={item.text} /></div>
                <p>{item.text}</p>
                <span className="arrow">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
