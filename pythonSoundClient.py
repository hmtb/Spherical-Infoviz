#
#   Hello World client in Python
#   Connects REQ socket to tcp://localhost:5555
#   Sends "Hello" to server, expects "World" back
#

import zmq
import winsound
import time

def main():
    """ main method """
   
    # Prepare our context and publisher
    context    = zmq.Context()
    subscriber = context.socket(zmq.SUB)
    subscriber.connect("tcp://127.0.0.1:50004")
    subscriber.setsockopt(zmq.SUBSCRIBE, '')

    while True:
        # Read envelope with address
        message = subscriber.recv_string()
        print(message)
        comand,filename,currentTime,time,x,y,z = message.split(';')
        print(filename)
        winsound.PlaySound(filename, winsound.SND_FILENAME)
        


    # We never get here but clean up anyhow
    subscriber.close()
    context.term()

if __name__ == "__main__":
    main()