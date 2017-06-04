# Setting Up

Prepare:
- Works on Windows 10 / Mac OS X (Vive mode only on Mac)
- Install nodejs 6.x LTS

Install dependencies:

    npm install

Build:

    npm run build

Run:

    npm start


Running in the AlloSphere:

[never run npm install]

ssh gr01
. /home/sphere/donghao/AllofwModule/activate
cd /data/donghao/projects/Spherical-Infoviz/
git pull
npm run build
./sync.sh   type YES when asked

Start in AlloLauncher: http://192.168.0.80:10800/

Controller interface is at http://192.168.0.46:8080/

nano text editor
nan
