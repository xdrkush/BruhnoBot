#!/bin/bash

source ~/.bashrc
echo "Check if NodeJS is at least >=v18.x.x."

NODE_VERSION=$(node -e "const v = process.version.match(/(\\d+)\.(\\d+)\.(\\d+)/).slice(1).map(_ => parseInt(_)); console.log(v[0] >= 18 || (v[0] >= 18 && v[1] >= 18))")
if $NODE_VERSION -eq "true" ;
then
    echo "Great ! " $(node -v)
else
    echo "Install node v18, because you have: " $(node -v) 
    # nvm use 18
    ~/.nvm/nvm.sh
    nvm i 18
    echo "Now you have: " $(node -v) 
fi

