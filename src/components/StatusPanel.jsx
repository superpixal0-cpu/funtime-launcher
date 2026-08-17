import React from 'react';
import './StatusPanel.css';

function StatusPanel({ isRunning, config, logs, logsEndRef }) {
  return (
    <div className="status-panel">
      <div className="section-header">
        <h2>📊 Статус Сервера</h2>
        <div className="status-indicator">
          <div className={`status-dot ${isRunning ? 'running' : 'offline'}`}></div>
          <span className="status-text">{isRunning ? '🟢 ОНЛАЙН' : '🔴 ОФФЛАЙН'}</span>
        </div>
      </div>

      <div className="divider"></div>

      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Статус:</span>
          <span className={`info-value ${isRunning ? 'success' : 'error'}`}>
            {isRunning ? 'Запущен' : 'Выключен'}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Игроки:</span>
          <span className="info-value">0/{config.maxPlayers}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Порт:</span>
          <span className="info-value">{config.port}</span>
        </div>
        <div className="info-item">
          <span className="info-label">RAM:</span>
          <span className="info-value">{config.ramMin}GB - {config.ramMax}GB</span>
        </div>
      </div>

      <div className="logs-section">
        <h3>📝 Консоль</h3>
        <div className="logs-container">
          {logs.length === 0 ? (
            <div className="logs-empty">Нет логов...</div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="log-line">
                {log}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}

export default StatusPanel;
