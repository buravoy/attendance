import { app, BrowserWindow } from 'electron/main';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const createWindow = async () => {
    const win = new BrowserWindow({
        width: 815,
        minWidth: 815,
        height: 900,
        minHeight: 500,
        icon: __dirname + '/dist/icon-only.png',
    })
    win.removeMenu();
    await win.loadFile('./dist/index.html')
}

app.whenReady().then(async () => {
    await createWindow()

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})