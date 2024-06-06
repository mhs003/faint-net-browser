const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

const onDev = true;

if (require("electron-squirrel-startup")) {
    app.quit();
}

if (onDev) {
    try {
        require("electron-reloader")(module, {
            debug: true,
            watchRenderer: true,
        });
    } catch (_) {
        console.log("Error");
    }
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        transparent: true,
        frame: false,
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, "preload.js"),
            enableRemoteModule: true,
            frame: false,
            devTools: false,
        },
    });

    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadFile(path.join(__dirname, "index.html"));

    // check if control+r is pressed
    mainWindow.webContents.on("before-input-event", (event, input) => {
        if (input.control && input.key.toLowerCase() === "r") {
            event.preventDefault();
        }
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
    ipcMain.on("minimize", () => {
        mainWindow.minimize();
    });
    ipcMain.on("maximize", () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });
};
ipcMain.on("close", () => {
    app.quit();
});

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
