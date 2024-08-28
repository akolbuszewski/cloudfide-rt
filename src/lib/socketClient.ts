import {BinanceSocketData} from "../hooks/useBinanceTradeData";

class SocketClient {
    private _ws: WebSocket;
    public baseUrl: string;
    private _path: string;
    private _handlers: Map;
    constructor(path: string, baseUrl: string) {
        this.baseUrl = baseUrl || 'wss://stream.binance.com/';
        this._path = path;
        this._createSocket();
        this._handlers = new Map();
    }

    _createSocket() {
        console.log(`${this.baseUrl}${this._path}`);
        this._ws = new WebSocket(`${this.baseUrl}${this._path}`);

        this._ws.onopen = () => {
            console.info('ws connected');
        };

        this._ws.onclose = () => {
            console.warn('ws closed');
        };

        this._ws.onerror = (err) => {
            console.warn('ws error', err);
        };

        this._ws.onmessage = (msg) => {
            try {
                const message = JSON.parse(msg.data);
                if (this.isMultiStream(message)) {
                    this._handlers.get(message.stream).forEach(cb => cb(message));
                } else if (message.e && this._handlers.has(message.e)) {
                    this._handlers.get(message.e).forEach(cb => {
                        cb(message);
                    });
                } else {
                    console.warn('Unknown method', message);
                }
            } catch (e) {
                console.warn('Parse message failed', e);
            }
        };

        this.heartBeat();
    }

    isMultiStream(message) {
        return message.stream && this._handlers.has(message.stream);
    }

    heartBeat() {
        setInterval(() => {
            if (this._ws.readyState === WebSocket.OPEN) {
                this._ws.ping();
                console.debug("ping server");
            }
        }, 5000);
    }

    setHandler(method: string, callback:(params: BinanceSocketData) => void) {
        if (!this._handlers.has(method)) {
            this._handlers.set(method, []);
        }
        this._handlers.get(method).push(callback);
    }

    removeHandler(method: string){
        this._handlers.delete(method);
    }
}

export default SocketClient;