import {app, BrowserWindow} from 'electron'
import * as path from 'path';
import * as url from 'url';

let win: null | BrowserWindow
const size = {x: 800, y: 600}

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.on('ready', () => {
    win = new BrowserWindow({
        frame: false,
        width: size.x,
        height: size.y,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs')
        }
    });
    win.loadURL(url.format({
       pathname: path.join(__dirname, '../pages/index.html'),
       protocol: 'file',
       slashes: true
    }));
    win.on('closed', () => {win = null;});
})