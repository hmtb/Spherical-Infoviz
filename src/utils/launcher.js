var spawn = require("child_process").spawn;

var BufferedPrintLine = function(callback) {
    this.buffer = new Buffer(0);
    this.callback = callback;
};

BufferedPrintLine.prototype.feed = function(chunk) {
    while(chunk.length > 0) {
        var i;
        for(i = 0; i < chunk.length; i++) {
            if(chunk[i] == 0x0A) break;
        }
        if(i == chunk.length) {
            this.buffer = Buffer.concat([this.buffer, chunk]);
            break;
        } else {
            var line = Buffer.concat([this.buffer, chunk.slice(0, i)]).toString("utf8");
            if(line.trim().length >= 0) {
                this.callback(line);
            }
            chunk = chunk.slice(i + 1);
            this.buffer = new Buffer(0);
        }
    }
};

var ExternalProgram = function(name, cmd, args) {
    console.log("Launching External Program: " + cmd + " " + args.join(" "));
    environment_variables = JSON.parse(JSON.stringify(process.env));
    environment_variables["TERM"] = "";
    var p = spawn(cmd, args, {
        env: environment_variables
    });
    p.on('error', (err) => {
        console.log(name, "(error)", err.toString());
    });
    p.on('close', (code, signal) => {
        console.log(name, "(terminated)", "code = " + code + ", signal = " + signal);
    });
    var print_stdout = new BufferedPrintLine((line) => {
        console.log(name, "(stdout)", line);
    });
    var print_stderr = new BufferedPrintLine((line) => {
        console.log(name, "(stderr)", line);
    });
    p.stderr.on('data', (chunk) => { print_stderr.feed(chunk); });
    p.stdout.on('data', (chunk) => { print_stdout.feed(chunk); });
    p.stderr.resume();
    p.stdout.resume();
    this.p = p;
};

ExternalProgram.prototype.kill = function() {
    var p = this.p;
    p.stdin.end();
    p.kill("SIGHUP");
};

exports.ExternalProgram = ExternalProgram;
