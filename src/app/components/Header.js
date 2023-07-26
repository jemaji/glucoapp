'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import firebaseService, { useAuth } from '@/app/services/firebaseService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = useAuth();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuOptionClick = (option) => {
    if (option === 'close') 
      firebaseService.logoutUser()
    handleMenuToggle();
  };

  return (
    <header className="header">
      <div className="logo">
      <Link href="/" className="link"><img src="/glucoapp.png" alt="GlucoApp Logo" /></Link>
      </div>
      <h1 className="header-title"><Link href="/" className="link">GlucoApp</Link></h1>
      <button className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} onClick={handleMenuToggle}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link href="/" className="link" onClick={() => handleMenuOptionClick('Glucosa')}>
              Glucosa
            </Link>
          </li>
          <li>
            <Link href="/charts" className="link" onClick={() => handleMenuOptionClick('Histórico')}>
              Histórico
            </Link>
          </li>
          <li>
            <Link href="/auth/login" className="link" onClick={() => handleMenuOptionClick('close')}>
              Cerrar sesión
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
