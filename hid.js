let HID = require("node-hid")
let zmq = require("zmq");

let socket = zmq.socket("pub");
socket.bind("tcp://127.0.0.1:60000");

function connectToDevice(onError) {
    try {
        let device = new HID.HID(1118, 1621);
        device.on("data", (value) => {
            console.log(value);
            let match = [ 1, 0, 0, 0, 0, 1, 0, 0 ];
            let matched = true;
            for(let i = 0; i < match.length; i++) {
                if(value.length <= i || value[i] != match[i]) matched = false;
            }
            if(matched) {
                socket.send("PRESS");
                console.log("Button Pressed!");
            }
        });

        device.on("error", (err) => {
            console.log(err);
            onError();
        });
    } catch(e) {
        console.log(e.message);
        onError();
    }
}

function connectPersistently() {
    connectToDevice(() => {
        console.log("Retry...");
        setTimeout(connectPersistently, 1);
    });
}

connectPersistently();