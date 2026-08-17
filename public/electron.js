const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const os = require('os');

let mainWindow;
let serverProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Server management
ipcMain.handle('start-server', async (event, config) => {
  try {
    const serverPath = config.serverPath;
    const jarFile = path.join(serverPath, config.serverJar);

    if (!fs.existsSync(jarFile)) {
      return { success: false, error: `JAR file not found: ${jarFile}` };
    }

    // Create eula.txt
    const eulaPath = path.join(serverPath, 'eula.txt');
    if (!fs.existsSync(eulaPath)) {
      fs.writeFileSync(eulaPath, 'eula=true\n');
    }

    // Build Java command
    const args = [
      `-Xms${config.ramMin}G`,
      `-Xmx${config.ramMax}G`,
      '-jar',
      jarFile,
      'nogui'
    ];

    serverProcess = spawn('java', args, {
      cwd: serverPath,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    serverProcess.stdout.on('data', (data) => {
      mainWindow.webContents.send('server-log', data.toString());
    });

    serverProcess.stderr.on('data', (data) => {
      mainWindow.webContents.send('server-log', data.toString());
    });

    serverProcess.on('close', (code) => {
      serverProcess = null;
      mainWindow.webContents.send('server-stopped');
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-server', async (event) => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
    return { success: true };
  }
  return { success: false, error: 'No server running' };
});

ipcMain.handle('get-config', async (event) => {
  const configPath = path.join(os.homedir(), '.funtime_launcher.json');
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading config:', error);
  }
  return getDefaultConfig();
});

ipcMain.handle('save-config', async (event, config) => {
  const configPath = path.join(os.homedir(), '.funtime_launcher.json');
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('select-folder', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0] || null;
});

function getDefaultConfig() {
  return {
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
  };
}
