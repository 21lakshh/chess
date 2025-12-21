import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./message";
import { Game } from "./Game";

// Game manager class manages all of your games 
export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null; // user that is waiting for a game
    private users: WebSocket[]; // users that are playing a game
    private static instance: GameManager; // singleton instance associated with a class not with an Object


    private constructor() { // making constructior private to implement singleton pattern
        this.games = [];
        this.pendingUser = null; 
        this.users = [];
    }

    static getInstance() {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
        // stop the game because user left 
    }

    private addHandler(socket: WebSocket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    //start a game between the two users
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = socket;
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
        
    }

}
export const gameManager = GameManager.getInstance();