#
#   Hello World server in Python
#   Binds REP socket to tcp://*:5555
#   Expects b"Hello" from client, replies with b"World"
#

import time
import zmq

context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://127.0.0.1:50004")

while True:
    #  Do some 'work'
    time.sleep(1)

    #  Send reply back to client
    socket.send(b"hello World")
    print("sent")