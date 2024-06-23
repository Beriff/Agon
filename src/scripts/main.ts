import {app, BrowserWindow} from 'electron'
import path from 'node:path';
import url from 'node:url';

let win: null | BrowserWindow
const size = {x: 800, y: 600}

app.on('ready', () => {
    win = new BrowserWindow({
        frame: false,
        width: size.x,
        height: size.y,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadURL(url.format({
       pathname: path.join(__dirname, '../pages/index.html'),
       protocol: 'file',
       slashes: true
    }));
    win.on('closed', () => {win = null;});
})