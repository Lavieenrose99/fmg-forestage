#!/bin/bash 

cd ..
npm run build

mv ./dist ./deploy/dist
docker build -t registry.cn-hangzhou.aliyuncs.com/ivannnj/fmg-management:v1 ./deploy
docker push registry.cn-hangzhou.aliyuncs.com/ivannnj/fmg-management:v1
rm -r ./deploy/dist

