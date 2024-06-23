"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var node_path_1 = __importDefault(require("node:path"));
var node_url_1 = __importDefault(require("node:url"));
var win;
var size = { x: 800, y: 600 };
electron_1.app.on('ready', function () {
    win = new electron_1.BrowserWindow({
        frame: false,
        width: size.x,
        height: size.y,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: node_path_1.default.join(__dirname, 'preload.js')
        }
    });
    win.loadURL(node_url_1.default.format({
        pathname: node_path_1.default.join(__dirname, '../pages/index.html'),
        protocol: 'file',
        slashes: true
    }));
    win.on('closed', function () { win = null; });
});
