const ws = require('nodejs-websocket');

const UserInfo = (conn) => {
    return {
        conn: conn,
        lastUpdateTime: new Date().getTime(),
    };
}

const CommandCode = {
    'START': 1,
    'END': 2,
    'MOUSE_EVENT': 3,
};

const MouseEvent = {
    'CLICK': 1,
    'DOUBLE_CLICK': 2,
    'DRAG_START': 3,
    'DRAG_END': 4,
    'DRAG': 5,
};

class SocketServer {

    port = 8000;
    server = null;
    userInfoList = [];

    constructor(port) {
        this.port = port || 8000;
    }

    run() {
        this.server = ws.createServer(conn => {

            conn.on('connect', code => {
                console.log('开启连接', code);
                this._connect(conn);
            });

            conn.on('text', result => {
                console.log('接收文本', result);
                const r = JSON.parse(result);
                if(!r || !r.code) return;
                switch(r.code) {
                    case CommandCode.START:
                        this._startApp(r.body);
                        break;
                    case CommandCode.END:
                        this._endApp(r.body);
                        break;
                    case CommandCode.MOUSE_EVENT:
                        this._endApp(r.body);
                        break;
                    default:
                        break;
                }
            });

            conn.on('close', code => {
                console.log('关闭连接', code);
                this._disconnect(conn);
            });

            conn.on('error', code => {
                console.log('异常关闭', code);
                this._disconnect(conn);
            });

        });

        this.server.listen(this.port);
    }

    _startApp(evt) {
        console.log('start', evt);
    }

    _endApp(evt) {
        console.log('end', evt);
    }

    _mouseEventHandler(evt) {
        console.log('mouseEvent', evt);
    }

    _connect(conn) {
        if(this.userInfoList.findIndex(v => v.conn == conn) < 0) {
            const userInfo = UserInfo(conn);
            this.userInfoList.push(userInfo);
        }
    }

    _disconnect(conn) {
        const idx = this.userInfoList.findIndex(v => v.conn == conn);
        if(idx >= 0) {
            this.userInfoList.splice(idx, 1);
        }
    }

}

// run
new SocketServer().run();