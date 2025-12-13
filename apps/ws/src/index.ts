import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const gameManager = new GameManager();

const wss = new WebSocketServer({ port: 8080 }, () => {
    console.log('Server is running on port 8080');
})

wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);

    ws.onclose = function close() {
        gameManager.removeUser(ws);
    }
})