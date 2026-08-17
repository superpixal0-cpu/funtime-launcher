import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="logo">⚡ FunTime Server Launcher</h1>
          <p className="tagline">🎮 Запусти свой сервер за секунды</p>
        </div>
        <div className="header-badge">
          <span className="version">v1.0.0</span>
          <span className="beta">BETA</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
