# Setting Up
Works on Windows 10 / Mac OS X 

Prepare:
- Install nodejs 6.x LTS

Install dependencies:

    npm install

Create Config:

    allofw.yaml

For window(Desktop) mode rename allofw.yaml.window  <br />
For vive mode rename allofw.yaml.vive  <br />
For Allosphere mode rename allofw.yaml.allosphere  <br />

add large Files:
    
    download:
    https://ucsb.box.com/s/hozgflvol5rvve9ho2iilrkxvmpoy3pk

create folder /videos/*files*

Build:

    npm run build

Run:

    npm run start


Controller:
go to 

    http://127.0.0.1:8080/

To control the visualisations



Audio
====

brew install libsndfile fftw

cd sound
mkdir build
cd build
cmake ..
make