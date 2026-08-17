import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import StatusPanel from './components/StatusPanel';
import SettingsPanel from './components/SettingsPanel';
import ControlPanel from './components/ControlPanel';

function App() {
  const [config, setConfig] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    loadConfig();
    setupIpcListeners();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConfig = async () => {
    try {
      const loadedConfig = await window.api.getConfig();
      setConfig(loadedConfig);
      addLog('✅ Конфигурация загружена');
    } catch (error) {
      console.error('Error loading config:', error);
      setConfig(getDefaultConfig());
    }
  };

  const setupIpcListeners = () => {
    window.api.onServerLog((data) => {
      addLog(data.trim());
    });

    window.api.onServerStopped(() => {
      setIsRunning(false);
      addLog('🔴 Сервер остановлен');
    });
  };

  const getDefaultConfig = () => ({
    serverPath: '',
    serverJar: 'server.jar',
    ramMin: '2',
    ramMax: '4',
    port: '25565',
    serverName: 'FunTime Server',
    motd: 'Welcome to FunTime!',
    maxPlayers: '20',
    gamemode: 'survival',
    difficulty: 'normal'
  });

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString('ru-RU');
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleSaveConfig = async (newConfig) => {
    try {
      await window.api.saveConfig(newConfig);
      setConfig(newConfig);
      addLog('✅ Настройки сохранены');
    } catch (error) {
      addLog(`❌ Ошибка сохранения: ${error.message}`);
    }
  };

  const handleStartServer = async () => {
    if (!config.serverPath) {
      addLog('❌ Выберите папку сервера');
      return;
    }

    try {
      addLog('🚀 Запуск сервера...');
      addLog(`💾 RAM: ${config.ramMin}GB - ${config.ramMax}GB`);
      addLog(`🌐 Порт: ${config.port}`);
      
      const result = await window.api.startServer(config);
      if (result.success) {
        setIsRunning(true);
        addLog('✅ Сервер запущен успешно');
      } else {
        addLog(`❌ Ошибка: ${result.error}`);
      }
    } catch (error) {
      addLog(`❌ Ошибка: ${error.message}`);
    }
  };

  const handleStopServer = async () => {
    try {
      addLog('⏹️  Остановка сервера...');
      const result = await window.api.stopServer();
      if (result.success) {
        setIsRunning(false);
        addLog('✅ Сервер остановлен');
      } else {
        addLog(`❌ Ошибка: ${result.error}`);
      }
    } catch (error) {
      addLog(`❌ Ошибка: ${error.message}`);
    }
  };

  if (!config) {
    return <div className="loading">⏳ Загрузка...</div>;
  }

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <div className="left-panel">
          <StatusPanel isRunning={isRunning} config={config} logs={logs} logsEndRef={logsEndRef} />
        </div>
        <div className="right-panel">
          <SettingsPanel config={config} onSaveConfig={handleSaveConfig} />
        </div>
      </div>
      <ControlPanel 
        isRunning={isRunning} 
        onStartServer={handleStartServer}
        onStopServer={handleStopServer}
      />
    </div>
  );
}

export default App;
