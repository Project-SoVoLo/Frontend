// src/components/Footer/Footer.jsx
import React from 'react';
import './Footer.css';
import footerImg from '../../assets/footer.png';

const Footer = () => {
  return (
    <footer className="footer">
      <img src={footerImg} alt="footer" />
    </footer>
  );
};

export default Footer;
