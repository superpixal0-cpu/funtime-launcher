import React, { useState } from 'react';
import './SettingsPanel.css';

function SettingsPanel({ config, onSaveConfig }) {
  const [localConfig, setLocalConfig] = useState(config);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleChange = (field, value) => {
    setLocalConfig({ ...localConfig, [field]: value });
    setUnsavedChanges(true);
  };

  const handleSelectFolder = async () => {
    try {
      const folder = await window.api.selectFolder();
      if (folder) {
        handleChange('serverPath', folder);
      }
    } catch (error) {
      console.error('Ошибка при выборе папки:', error);
    }
  };

  const handleSave = () => {
    onSaveConfig(localConfig);
    setUnsavedChanges(false);
  };

  const handleReset = () => {
    setLocalConfig(config);
    setUnsavedChanges(false);
  };

  return (
    <div className="settings-panel">
      <div className="section-header">
        <h2>⚙️ Настройки</h2>
        {unsavedChanges && <span className="unsaved-badge">Не сохранено</span>}
      </div>

      <div className="divider"></div>

      <div className="settings-container">
        <div className="setting-group">
          <label>Папка сервера</label>
          <div className="folder-input">
            <input
              type="text"
              value={localConfig.serverPath}
              onChange={(e) => handleChange('serverPath', e.target.value)}
              placeholder="Выберите папку сервера..."
              readOnly
            />
            <button onClick={handleSelectFolder} className="folder-btn">
              📁
            </button>
          </div>
        </div>

        <div className="setting-group">
          <label>JAR файл</label>
          <input
            type="text"
            value={localConfig.serverJar}
            onChange={(e) => handleChange('serverJar', e.target.value)}
            placeholder="server.jar"
          />
        </div>

        <div className="setting-group">
          <label>Имя сервера</label>
          <input
            type="text"
            value={localConfig.serverName}
            onChange={(e) => handleChange('serverName', e.target.value)}
            placeholder="Имя сервера"
          />
        </div>

        <div className="setting-group">
          <label>MOTD (Сообщение дня)</label>
          <input
            type="text"
            value={localConfig.motd}
            onChange={(e) => handleChange('motd', e.target.value)}
            placeholder="Приветственное сообщение"
          />
        </div>

        <div className="settings-row">
          <div className="setting-group">
            <label>Min RAM (GB)</label>
            <input
              type="number"
              min="1"
              max="64"
              value={localConfig.ramMin}
              onChange={(e) => handleChange('ramMin', e.target.value)}
            />
          </div>
          <div className="setting-group">
            <label>Max RAM (GB)</label>
            <input
              type="number"
              min="1"
              max="64"
              value={localConfig.ramMax}
              onChange={(e) => handleChange('ramMax', e.target.value)}
            />
          </div>
        </div>

        <div className="settings-row">
          <div className="setting-group">
            <label>Порт</label>
            <input
              type="text"
              value={localConfig.port}
              onChange={(e) => handleChange('port', e.target.value)}
              placeholder="25565"
            />
          </div>
          <div className="setting-group">
            <label>Макс. игроков</label>
            <input
              type="number"
              min="1"
              value={localConfig.maxPlayers}
              onChange={(e) => handleChange('maxPlayers', e.target.value)}
            />
          </div>
        </div>

        <div className="settings-row">
          <div className="setting-group">
            <label>Режим игры</label>
            <select
              value={localConfig.gamemode}
              onChange={(e) => handleChange('gamemode', e.target.value)}
            >
              <option value="survival">Выживание</option>
              <option value="creative">Творческий</option>
              <option value="adventure">Приключение</option>
              <option value="spectator">Наблюдатель</option>
            </select>
          </div>
          <div className="setting-group">
            <label>Сложность</label>
            <select
              value={localConfig.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value)}
            >
              <option value="peaceful">Мирная</option>
              <option value="easy">Лёгкая</option>
              <option value="normal">Нормальная</option>
              <option value="hard">Сложная</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={!unsavedChanges}
        >
          🔄 Сброс
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!unsavedChanges}
        >
          💾 Сохранить
        </button>
      </div>
    </div>
  );
}

export default SettingsPanel;
