#!/bin/bash
. /home/sphere/donghao/AllofwModule/activate
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR

export LD_LIBRARY_PATH=./node_modules/allofw/linux_x64:./deps

if [ "$(hostname)" = "gr01" ]; then
  ./node_modules/.bin/allofw-run --role simulator dist/app.js
else
  ./node_modules/.bin/allofw-run --role renderer dist/app.js
fi
