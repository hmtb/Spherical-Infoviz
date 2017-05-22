// let { AudioContext, AudioBufferSourceNode, AudioBuffer } = require("web-audio-api");
// let context = new AudioContext({
//     bufferSize: 1024
// });
// let fs = require("fs");
// let Speaker = require("speaker");
// let zmq = require("zmq");

// context.outStream = new Speaker({
//     channels: context.format.numberOfChannels,
//     bitDepth: context.format.bitDepth,
//     sampleRate: context.sampleRate
// });

// let cache = {};

// function decodeSoundFile(filename, callback) {
//     if(cache[filename]) {
//         callback(cache[filename]);
//     } else {
//         let data = fs.readFile(filename, (err, data) => {
//             context.decodeAudioData(data, (audioBuffer) => {
//                 cache[filename] = audioBuffer;
//                 callback(audioBuffer);
//             });
//         });
//     }
// }

// function playSoundFile(filename) {
//     decodeSoundFile(filename, (audioBuffer) => {
//         let source = context.createBufferSource();
//         source.connect(context.destination);
//         source.buffer = audioBuffer;
//         source.start(context.currentTime);
//     });
// }



const child_process = require("child_process");
const zmq = require("zmq");

let cache = {};

function playSound(filename) {
    child_process.spawn("python", [ "-c", `import winsound; winsound.PlaySound("${filename}", winsound.SND_FILENAME)` ]);
}

let socket = zmq.socket("pull");
socket.bind("tcp://127.0.0.1:60001");
socket.on("message", (msg) => {
    let name = msg.toString("utf-8");
    let filename = null;
    switch(name) {
        case "hit": {
            filename = "./sound/correct.wav";
        } break;
        case "miss": {
            filename = "./sound/misclick.wav";
        } break;
        case "disappear": {
            filename = "./sound/missed.wav";
        } break;
    }
    if(filename) {
        playSound(filename);
    }
});