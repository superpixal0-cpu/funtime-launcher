import React from 'react';
import './ControlPanel.css';

function ControlPanel({ isRunning, onStartServer, onStopServer }) {
  return (
    <footer className="control-panel">
      <div className="control-content">
        <div className="server-info">
          <span className="info-text">⚡ FunTime Server Launcher v1.0.0</span>
        </div>
        
        <div className="control-buttons">
          <button
            className="btn btn-start"
            onClick={onStartServer}
            disabled={isRunning}
            title="Запустить сервер Minecraft"
          >
            ▶️ Запустить Сервер
          </button>
          
          <button
            className="btn btn-stop"
            onClick={onStopServer}
            disabled={!isRunning}
            title="Остановить сервер Minecraft"
          >
            ⏹️ Остановить Сервер
          </button>
        </div>
      </div>
    </footer>
  );
}

export default ControlPanel;
