import { app, BrowserWindow } from "electron";
import path from "path";

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true, // Hides the toolbar/menu bar
    });

    if (app.isPackaged) {
        // Load the production build from the dist folder
        mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    } else {
        // Load the development server
        mainWindow.loadURL("http://localhost:5173"); // Replace with your dev server URL
    }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
