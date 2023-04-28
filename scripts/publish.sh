#!/bin/sh
# 进入主包更新版本
cd packages/umi-meta-ui
VERSION=`npx select-version-cli`
cd ../../
# 安装依赖，并触发更新版本的钩子 
pnpm i --strict-peer-dependencies=false

# changelog
# pnpm changelog

echo "build..."
# build
pnpm build:ui
# commit
#git add -A
#git commit -m "release: $VERSION"
# tag
echo "tag... v$VERSION"
#git tag -a v$VERSION -m "[release] $VERSION"
echo "push... v$VERSION"
# push
#git push origin master
#git push origin v$VERSION
#git checkout dev
#git rebase master
#git push origin dev

# publish
cd packages/umi-meta-ui/dist
pnpm publish

# back
#cd ../../../
#git checkout master

echo "✅ Publish completed"